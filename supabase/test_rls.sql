DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000001'; -- Remplacer par un UUID existant
BEGIN
    -- 1. Simulation d'un utilisateur authentifié
    -- (Dans Supabase, request.jwt.claim.sub définit l'uid)
    PERFORM set_config('request.jwt.claims', '{"sub": "' || test_user_id || '"}', true);
    PERFORM set_config('role', 'authenticated', true);

    -- 2. TENTATIVE D'UPDATE DIRECT SUR L'XP (DOIT ÉCHOUER)
    BEGIN
        UPDATE public.profiles SET xp = 999999 WHERE id = test_user_id;
        RAISE EXCEPTION 'TEST ÉCHOUÉ: Update direct sur xp a fonctionné !';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'SUCCÈS: Update direct sur xp bloqué (insufficient_privilege).';
    END;

    -- 3. TENTATIVE VIA RPC AVEC UN GAIN SUSPECT (DOIT ÉCHOUER)
    BEGIN
        PERFORM public.sync_user_progress(999999, 1, 1, '[]'::jsonb);
        RAISE EXCEPTION 'TEST ÉCHOUÉ: RPC a accepté un gain d''XP absurde !';
    EXCEPTION WHEN raise_exception THEN
        RAISE NOTICE 'SUCCÈS: RPC a bloqué le gain suspect d''XP (%).', sqlerrm;
    END;

    -- 4. TENTATIVE D'INSERTION DE CHECKPOINT DIRECTE (DOIT ÉCHOUER)
    BEGIN
        INSERT INTO public.user_checkpoints (user_id, checkpoint_id, score) VALUES (test_user_id, '1', 100);
        RAISE EXCEPTION 'TEST ÉCHOUÉ: Insert direct sur user_checkpoints a fonctionné !';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'SUCCÈS: Insert direct sur user_checkpoints bloqué.';
    END;

    -- 5. TENTATIVE VIA RPC AVEC UN SCORE INVALIDE (DOIT ÉCHOUER)
    BEGIN
        PERFORM public.claim_checkpoint_reward('1', 500, 'FAKE-CERT');
        RAISE EXCEPTION 'TEST ÉCHOUÉ: RPC a accepté un score > 100 !';
    EXCEPTION WHEN raise_exception THEN
        RAISE NOTICE 'SUCCÈS: RPC a bloqué le score invalide (%).', sqlerrm;
    END;

END $$;
