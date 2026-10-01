-- Migration: 20261001000000_secure_subscription_rpcs.sql
-- Description: Version and secure subscription RPC functions against public and anon execution.

-- 1. set_user_subscription
CREATE OR REPLACE FUNCTION public.set_user_subscription(
  p_user_id uuid,
  p_is_premium boolean,
  p_customer_id text DEFAULT NULL::text,
  p_subscription_id text DEFAULT NULL::text,
  p_cycle text DEFAULT NULL::text
)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  UPDATE public.profiles
  SET 
    is_premium = p_is_premium,
    stripe_customer_id = COALESCE(p_customer_id, stripe_customer_id),
    stripe_subscription_id = COALESCE(p_subscription_id, stripe_subscription_id),
    subscription_cycle = COALESCE(p_cycle, subscription_cycle),
    updated_at = NOW()
  WHERE id = p_user_id;

  RETURN FOUND;
END;
$function$;

-- 2. cancel_user_subscription
CREATE OR REPLACE FUNCTION public.cancel_user_subscription(
  p_subscription_id text
)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  UPDATE public.profiles
  SET is_premium = false, updated_at = NOW()
  WHERE stripe_subscription_id = p_subscription_id;
  RETURN FOUND;
END;
$function$;

-- 3. update_user_subscription_status
CREATE OR REPLACE FUNCTION public.update_user_subscription_status(
  p_subscription_id text,
  p_is_active boolean
)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  UPDATE public.profiles
  SET is_premium = p_is_active, updated_at = NOW()
  WHERE stripe_subscription_id = p_subscription_id;
  RETURN FOUND;
END;
$function$;

-- Revoke execution from anonymous and standard authenticated users
REVOKE ALL ON FUNCTION public.set_user_subscription FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancel_user_subscription FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_user_subscription_status FROM PUBLIC, anon, authenticated;

-- Grant execution exclusively to service_role (used by server-side Stripe webhook)
GRANT EXECUTE ON FUNCTION public.set_user_subscription TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_user_subscription TO service_role;
GRANT EXECUTE ON FUNCTION public.update_user_subscription_status TO service_role;
