insert into storage.buckets (id, name, public)
values ('station-logos', 'station-logos', true)
on conflict (id) do nothing;

-- Add storage write policies together with authenticated station roles.
-- Do not add broad demo policies such as "any authenticated user can upload".
