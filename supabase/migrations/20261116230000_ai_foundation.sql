-- StudyX Milestone 7: server-side AI usage and private history.

create type public.ai_request_status as enum ('completed', 'failed');

create table public.ai_usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  request_count integer not null default 0 check (request_count >= 0),
  input_characters integer not null default 0 check (input_characters >= 0),
  output_characters integer not null default 0 check (output_characters >= 0),
  primary key (user_id, usage_date)
);

create table public.ai_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool text not null check (tool in ('explain', 'translate')),
  input_text text not null,
  output_text text,
  source_language text,
  target_language text,
  provider text,
  status public.ai_request_status not null,
  error_code text,
  created_at timestamptz not null default now()
);

create index ai_history_user_created_idx on public.ai_history (user_id, created_at desc);

alter table public.ai_usage_daily enable row level security;
alter table public.ai_history enable row level security;

create policy "users read own ai usage"
on public.ai_usage_daily for select to authenticated
using (user_id = auth.uid());

create policy "users read own ai history"
on public.ai_history for select to authenticated
using (user_id = auth.uid());

create or replace function public.consume_ai_request(
  requested_characters integer,
  max_requests integer,
  max_input_characters integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
  current_input integer;
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  if requested_characters < 1 or requested_characters > max_input_characters then
    raise exception using errcode = '22023', message = 'Input exceeds the configured limit';
  end if;

  insert into public.ai_usage_daily (user_id, usage_date, request_count, input_characters)
  values (auth.uid(), current_date, 0, 0)
  on conflict (user_id, usage_date) do nothing;

  select request_count, input_characters
  into current_count, current_input
  from public.ai_usage_daily
  where user_id = auth.uid() and usage_date = current_date
  for update;

  if current_count >= max_requests or current_input + requested_characters > max_input_characters * max_requests then
    raise exception using errcode = '54000', message = 'Daily AI usage limit reached';
  end if;

  update public.ai_usage_daily
  set request_count = request_count + 1,
      input_characters = input_characters + requested_characters
  where user_id = auth.uid() and usage_date = current_date;
end;
$$;

revoke all on function public.consume_ai_request(integer, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_ai_request(integer, integer, integer) to authenticated;
