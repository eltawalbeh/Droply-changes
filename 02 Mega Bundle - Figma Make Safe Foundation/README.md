# 02 Mega Bundle - Figma Make Safe Foundation

Upload/apply this bundle as ONE change.

## Goal
Make Droply consistent with the native Figma Make scaffold while removing all AquaFlow/demo/mock behavior and establishing the correct desktop-first administration foundation.

## Important
Copy each file to the SAME target path in the Droply project.
Do not ask Figma Make to redesign or auto-fix anything between files.

## Includes
- Restores Figma Make Vite 8 + Tailwind v4 toolchain compatibility
- Removes mixed react-router versions
- Restores Figma Make index.html slots and vite plugins
- Uses src/index.css as the canonical global CSS file
- Removes demo users, mock tenants, Saudi sample data, Unsplash demo assets, fake timers/actions
- Removes placeholder Supabase credentials
- Establishes desktop-first Station Admin + Platform Admin routes
- Supabase-ready environment setup
- Multi-tenant Droply domain types
- Jordan default currency (JOD)
- Data model for stations, locations, service areas, drivers, customers, addresses, container types, customer containers, orders and payments
- Cash / CliQ / optional coupon payment methods
- PIN-ready customer model (PIN hashing must be server-side; never store raw PINs)

## Do not copy
This README is documentation only.

## Old files that become unused
- src/styles.css

It can be deleted later. The application no longer imports it.
