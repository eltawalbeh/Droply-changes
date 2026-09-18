import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const prefix = "/make-server-821e46f4";

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

function jsonError(c: any, status: number, message: string) {
  return c.json({ error: message }, status);
}

function authClient() {
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  return createClient(url, anonKey);
}

async function requireUser(c: any) {
  const authHeader = c.req.header("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) {
    return { error: jsonError(c, 401, "Authentication required") };
  }

  const { data, error } = await authClient().auth.getUser(token);

  if (error || !data.user) {
    return { error: jsonError(c, 401, "Invalid or expired session") };
  }

  return { user: data.user };
}

function appMeta(user: any) {
  return (user?.app_metadata ?? {}) as Record<string, unknown>;
}

function sameDay(value?: string | null) {
  if (!value) return false;
  return value.slice(0, 10) === new Date().toISOString().slice(0, 10);
}

async function enrichOrder(order: any) {
  const customerKey = order.customerId
    ? "customer:" + order.stationId + ":" + order.customerId
    : "";
  const addressKey = order.customerAddressId
    ? "address:" + order.customerId + ":" + order.customerAddressId
    : "";

  const [customer, address, items] = await Promise.all([
    customerKey ? kv.get(customerKey) : null,
    addressKey ? kv.get(addressKey) : null,
    kv.getByPrefix("order-item:" + order.id + ":"),
  ]);

  return {
    ...order,
    customer: customer
      ? {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
        }
      : undefined,
    address: address ?? undefined,
    items,
  };
}

app.get(prefix + "/health", (c) => {
  return c.json({ status: "ok" });
});

app.get(prefix + "/public/qr/:code", async (c) => {
  try {
    const code = c.req.param("code");
    const qrCode = await kv.get("qr:" + code);

    if (!qrCode || qrCode.isActive === false) {
      return jsonError(c, 404, "QR code not found or inactive");
    }

    const [station, location, containerTypes] = await Promise.all([
      kv.get("station:" + qrCode.stationId),
      kv.get("location:" + qrCode.stationLocationId),
      kv.getByPrefix("container-type:" + qrCode.stationId + ":"),
    ]);

    if (!station || station.isActive === false) {
      return jsonError(c, 404, "Station is unavailable");
    }

    if (!location || location.isActive === false) {
      return jsonError(c, 404, "Station location is unavailable");
    }

    return c.json({
      qrCode: {
        code: qrCode.code ?? code,
        stationId: qrCode.stationId,
        stationLocationId: qrCode.stationLocationId,
      },
      station,
      location,
      containerTypes: containerTypes.filter((item: any) => item?.isActive !== false),
    });
  } catch (error) {
    console.error("public qr error", error);
    return jsonError(c, 500, "Unable to resolve station QR");
  }
});

app.get(prefix + "/driver/orders", async (c) => {
  try {
    const auth = await requireUser(c);
    if ("error" in auth) return auth.error;

    const metadata = appMeta(auth.user);
    const role = metadata.role;
    const stationId = metadata.station_id;
    const driverId = metadata.driver_id;

    if (role !== "driver" || typeof stationId !== "string" || typeof driverId !== "string") {
      return jsonError(c, 403, "Driver access required");
    }

    const scope = c.req.query("scope") ?? "today";
    const allOrders = await kv.getByPrefix("order:" + stationId + ":");
    const assigned = allOrders.filter((order: any) => order?.driverId === driverId);

    const scoped = assigned.filter((order: any) => {
      if (scope === "active") {
        return order.status === "accepted" || order.status === "out_for_delivery";
      }

      if (scope === "completed") {
        return (
          (order.status === "delivered" || order.status === "closed") &&
          sameDay(order.deliveredAt ?? order.closedAt ?? order.createdAt)
        );
      }

      return (
        ["new", "accepted", "out_for_delivery"].includes(order.status) &&
        sameDay(order.createdAt)
      );
    });

    const orders = await Promise.all(
      scoped
        .sort((a: any, b: any) =>
          String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")),
        )
        .map(enrichOrder),
    );

    return c.json({ orders });
  } catch (error) {
    console.error("driver orders error", error);
    return jsonError(c, 500, "Unable to load driver orders");
  }
});

app.get(prefix + "/driver/orders/:orderId", async (c) => {
  try {
    const auth = await requireUser(c);
    if ("error" in auth) return auth.error;

    const metadata = appMeta(auth.user);
    const role = metadata.role;
    const stationId = metadata.station_id;
    const driverId = metadata.driver_id;

    if (role !== "driver" || typeof stationId !== "string" || typeof driverId !== "string") {
      return jsonError(c, 403, "Driver access required");
    }

    const orderId = c.req.param("orderId");
    const order = await kv.get("order:" + stationId + ":" + orderId);

    if (!order || order.driverId !== driverId) {
      return jsonError(c, 404, "Order not found");
    }

    return c.json({ order: await enrichOrder(order) });
  } catch (error) {
    console.error("driver order error", error);
    return jsonError(c, 500, "Unable to load order");
  }
});

app.get(prefix + "/station/dashboard", async (c) => {
  try {
    const auth = await requireUser(c);
    if ("error" in auth) return auth.error;

    const metadata = appMeta(auth.user);
    const role = metadata.role;
    const stationId = metadata.station_id;

    if (
      !["station_admin", "station_staff", "platform_admin"].includes(String(role)) ||
      typeof stationId !== "string"
    ) {
      return jsonError(c, 403, "Station access required");
    }

    const [orders, customers] = await Promise.all([
      kv.getByPrefix("order:" + stationId + ":"),
      kv.getByPrefix("customer:" + stationId + ":"),
    ]);

    const todayOrders = orders.filter((order: any) => sameDay(order?.createdAt));
    const paidToday = todayOrders.filter((order: any) => order?.paymentStatus === "paid");

    const sumPaid = (method: string) =>
      paidToday
        .filter((order: any) => order?.paymentMethod === method)
        .reduce((sum: number, order: any) => sum + Number(order?.totalAmount ?? 0), 0);

    return c.json({
      metrics: {
        ordersToday: todayOrders.length,
        newOrders: todayOrders.filter((order: any) => order?.status === "new").length,
        outForDelivery: todayOrders.filter((order: any) => order?.status === "out_for_delivery").length,
        delivered: todayOrders.filter(
          (order: any) => order?.status === "delivered" || order?.status === "closed",
        ).length,
        cashCollected: sumPaid("cash"),
        cliqCollected: sumPaid("cliq"),
        pendingPayments: todayOrders.filter(
          (order: any) => order?.paymentStatus === "pending",
        ).length,
        activeCustomers: customers.filter(
          (customer: any) => customer?.isActive !== false,
        ).length,
      },
    });
  } catch (error) {
    console.error("station dashboard error", error);
    return jsonError(c, 500, "Unable to load station dashboard");
  }
});

Deno.serve(app.fetch);
