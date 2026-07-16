-- Corre isto no Supabase SQL Editor antes/apos fazer deploy desta versão.
-- Adiciona URL de imagem aos crafts existentes sem apagar dados.
alter table crafts add column if not exists image_url text default '';
