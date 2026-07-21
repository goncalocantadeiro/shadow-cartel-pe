alter table public.crafts
  add column if not exists sale_price_override numeric null;

comment on column public.crafts.sale_price_override is
  'Optional manual final sale price. When null, price is calculated from sale_percentage.';
