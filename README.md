# Droply changes

This repository is the working change set for the Droply project.

## Current foundation

- React + TypeScript + Vite
- Supabase-ready client structure
- Desktop-first Station Admin shell
- Multi-role domain types prepared
- No demo data
- No fake buttons or simulated actions
- No example analytics or placeholder business metrics
- Arabic/English and RTL/LTR support to be added at the product UI layer
- Customer and Driver mobile experiences will be added after the Station foundation

## Supabase

Copy `.env.example` to `.env` and provide:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No database schema or fake records are included yet.

## Product direction

Droply is a multi-tenant ordering platform for neighborhood water stations. Customers register from station/location QR codes, save their address and container profile, and place repeat water orders without calling the station. Orders are routed to the appropriate station service area and driver. Payment methods initially include Cash, CliQ and optional coupons.
