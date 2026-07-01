create extension if not exists pgcrypto;

create table if not exists materials (
  name text primary key,
  price numeric not null default 0
);

create table if not exists crafts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  table_name text not null,
  output_qty numeric not null default 1,
  sort_order bigint default 0
);

create table if not exists craft_ingredients (
  id uuid primary key default gen_random_uuid(),
  craft_id uuid references crafts(id) on delete cascade,
  material_name text not null,
  qty numeric not null default 1,
  sort_order int default 0
);

create table if not exists settings (
  id text primary key,
  value numeric not null
);

insert into settings (id, value)
values ('sale_percentage', 25)
on conflict (id) do nothing;

alter table materials enable row level security;
alter table crafts enable row level security;
alter table craft_ingredients enable row level security;
alter table settings enable row level security;

drop policy if exists "public read materials" on materials;
drop policy if exists "public insert materials" on materials;
drop policy if exists "public update materials" on materials;
drop policy if exists "public delete materials" on materials;
drop policy if exists "public read crafts" on crafts;
drop policy if exists "public insert crafts" on crafts;
drop policy if exists "public update crafts" on crafts;
drop policy if exists "public delete crafts" on crafts;
drop policy if exists "public read ingredients" on craft_ingredients;
drop policy if exists "public insert ingredients" on craft_ingredients;
drop policy if exists "public update ingredients" on craft_ingredients;
drop policy if exists "public delete ingredients" on craft_ingredients;
drop policy if exists "public read settings" on settings;
drop policy if exists "public insert settings" on settings;
drop policy if exists "public update settings" on settings;

create policy "public read materials" on materials for select using (true);
create policy "public insert materials" on materials for insert with check (true);
create policy "public update materials" on materials for update using (true);
create policy "public delete materials" on materials for delete using (true);

create policy "public read crafts" on crafts for select using (true);
create policy "public insert crafts" on crafts for insert with check (true);
create policy "public update crafts" on crafts for update using (true);
create policy "public delete crafts" on crafts for delete using (true);

create policy "public read ingredients" on craft_ingredients for select using (true);
create policy "public insert ingredients" on craft_ingredients for insert with check (true);
create policy "public update ingredients" on craft_ingredients for update using (true);
create policy "public delete ingredients" on craft_ingredients for delete using (true);

create policy "public read settings" on settings for select using (true);
create policy "public insert settings" on settings for insert with check (true);
create policy "public update settings" on settings for update using (true);
