-- Executar uma vez no Supabase SQL Editor antes de usar esta versão.
-- Não apaga materiais, crafts ou ingredientes existentes.

alter table crafts
  add column if not exists sale_percentage numeric not null default 25;

create table if not exists craft_tables (
  name text primary key,
  tag text not null,
  color text not null,
  sort_order bigint not null default 0
);

insert into craft_tables (name, tag, color, sort_order) values
  ('Mesa Normal', 'GERAL', '#00f0a8', 0),
  ('Mesa de Armas', 'ARMAS', '#ff405f', 1),
  ('Mesa de Eletrónica', 'ELETRÓNICA', '#ffd34d', 2),
  ('Mesa das Gazuas', 'GAZUAS', '#bd7bff', 3)
on conflict (name) do nothing;

alter table craft_tables enable row level security;

drop policy if exists "public read craft tables" on craft_tables;
drop policy if exists "public insert craft tables" on craft_tables;
drop policy if exists "public update craft tables" on craft_tables;
drop policy if exists "public delete craft tables" on craft_tables;
create policy "public read craft tables" on craft_tables for select using (true);
create policy "public insert craft tables" on craft_tables for insert with check (true);
create policy "public update craft tables" on craft_tables for update using (true);
create policy "public delete craft tables" on craft_tables for delete using (true);

do $$
begin
  alter publication supabase_realtime add table craft_tables;
exception
  when duplicate_object then null;
end $$;
