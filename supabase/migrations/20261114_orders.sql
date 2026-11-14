-- Orders, their history, and small settings the server caches (CJ token, variant id).
-- Only the server touches these tables, using the secret key. Row level security is on with
-- no policies, so the public (anon) key can read or write nothing.

create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('OXY' || nextval('public.order_number_seq')::text),
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  status text not null default 'paid'
    check (status in ('paid', 'sending', 'sent', 'shipped', 'delivered', 'failed', 'needs_review', 'cancelled')),
  bundle text not null,
  quantity integer not null check (quantity > 0),
  amount_total integer not null,
  currency text not null,
  customer_email text,
  customer_name text,
  customer_phone text,
  ship_name text,
  ship_line1 text,
  ship_line2 text,
  ship_city text,
  ship_state text,
  ship_postal_code text,
  ship_country text,
  cj_order_id text,
  cj_status text,
  cj_logistic_name text,
  cj_postage numeric(10, 2),
  cj_order_amount numeric(10, 2),
  tracking_number text,
  tracking_carrier text,
  attempts integer not null default 0,
  last_error text,
  last_attempt_at timestamptz,
  confirmation_email_at timestamptz,
  shipping_email_at timestamptz,
  alerted_at timestamptz,
  sent_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

create table if not exists public.order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  kind text not null,
  message text,
  data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists order_events_order_idx on public.order_events (order_id, created_at desc);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Atomically takes an order for sending to the supplier, so two workers never send it twice.
-- An order stuck in 'sending' (for example after a crash) can be taken again once it is stale.
create or replace function public.claim_order_for_sending(p_id uuid, p_stale_minutes integer default 15)
returns setof public.orders
language sql
set search_path = ''
as $$
  update public.orders
     set status = 'sending',
         attempts = attempts + 1,
         last_attempt_at = now()
   where id = p_id
     and (
       status in ('paid', 'failed')
       or (status = 'sending' and last_attempt_at < now() - make_interval(mins => p_stale_minutes))
     )
  returning *;
$$;

alter table public.orders enable row level security;
alter table public.order_events enable row level security;
alter table public.app_settings enable row level security;

revoke all on public.orders, public.order_events, public.app_settings from anon, authenticated;
revoke all on sequence public.order_number_seq from anon, authenticated;
revoke execute on function public.claim_order_for_sending(uuid, integer) from public, anon, authenticated;
grant execute on function public.claim_order_for_sending(uuid, integer) to service_role;
