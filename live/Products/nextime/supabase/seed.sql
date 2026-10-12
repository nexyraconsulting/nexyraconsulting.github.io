-- NEXTime seed data. Safe to run more than once.
-- Plans are created by migration 0001. This file adds provider ids and the first platform admin.

-- 1. Stripe Price ids (Stripe Dashboard → Product catalogue). Create one product per plan with a
--    monthly and a yearly recurring GBP price, excluding VAT, then paste the ids here.
update public.plans set stripe_price_monthly = 'price_REPLACE_STARTER_MONTHLY', stripe_price_annual = 'price_REPLACE_STARTER_ANNUAL' where id = 'starter';
update public.plans set stripe_price_monthly = 'price_REPLACE_TEAM_MONTHLY',    stripe_price_annual = 'price_REPLACE_TEAM_ANNUAL'    where id = 'team';
update public.plans set stripe_price_monthly = 'price_REPLACE_BUSINESS_MONTHLY', stripe_price_annual = 'price_REPLACE_BUSINESS_ANNUAL' where id = 'business';

-- 2. Platform admin (NEXTime staff who use console.html).
--    First sign up normally through account.html with your own email, then run:
-- insert into public.platform_admins (user_id)
--   select id from auth.users where email = 'REPLACE_WITH_YOUR_EMAIL'
--   on conflict do nothing;

-- No demo tenants or users are seeded in production.
