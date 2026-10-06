import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Le client Supabase est mocké : aucun accès réseau n'est possible en test, et ce qui
 * est vérifié ici est la logique propre au module (mapping des colonnes, fail-open,
 * exigence du service_role), pas le comportement de la bibliothèque.
 */
const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));
// Sans implémentation : les arguments enregistrés restent inspectables sans cast.
const createClientMock = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: (...args: unknown[]) => {
    createClientMock(...args);
    return { from: fromMock };
  },
}));

const ORIGINAL_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ORIGINAL_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let errorSpy: ReturnType<typeof vi.spyOn>;

/** Reimporte le module : le client est mémorisé au niveau module, il faut repartir de zéro. */
async function loadModule() {
  vi.resetModules();
  return import('./cspPersistence');
}

beforeEach(() => {
  insertMock.mockReset();
  fromMock.mockClear();
  createClientMock.mockClear();
  insertMock.mockResolvedValue({ error: null });
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
  if (ORIGINAL_URL === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = ORIGINAL_URL;
  if (ORIGINAL_KEY === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  else process.env.SUPABASE_SERVICE_ROLE_KEY = ORIGINAL_KEY;
});

const VIOLATION = {
  directive: 'script-src-elem',
  blockedUri: 'https://evil.example.com/x.js',
  documentUri: 'https://kenza-dusky.vercel.app/etudier',
};

describe('persistCspViolations', () => {
  it('mappe les champs camelCase vers les colonnes snake_case', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://projet.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'cle-service';
    const { persistCspViolations } = await loadModule();

    await persistCspViolations([VIOLATION]);

    expect(fromMock).toHaveBeenCalledWith('csp_violations');
    expect(insertMock).toHaveBeenCalledWith([
      {
        directive: 'script-src-elem',
        blocked_uri: 'https://evil.example.com/x.js',
        document_uri: 'https://kenza-dusky.vercel.app/etudier',
      },
    ]);
  });

  it('utilise la clé service_role, JAMAIS la clé anon', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://projet.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'cle-service';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'cle-anon-publique';
    const { persistCspViolations } = await loadModule();

    await persistCspViolations([VIOLATION]);

    const [, key] = createClientMock.mock.calls[0] as unknown as [string, string];
    expect(key).toBe('cle-service');
    expect(key).not.toBe('cle-anon-publique');
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('n’appelle RIEN pour une liste vide', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://projet.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'cle-service';
    const { persistCspViolations } = await loadModule();

    await persistCspViolations([]);

    expect(createClientMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('fail-open : configuration absente → signale, ne lève pas', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { persistCspViolations } = await loadModule();

    await expect(persistCspViolations([VIOLATION])).resolves.toBeUndefined();

    expect(createClientMock).not.toHaveBeenCalled();
    expect(errorSpy.mock.calls.map((c) => String(c[0])).join(' ')).toContain('non persistées');
  });

  it('fail-open : erreur d’insertion → signale, ne lève pas', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://projet.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'cle-service';
    insertMock.mockResolvedValue({ error: { message: 'permission denied for table csp_violations' } });
    const { persistCspViolations } = await loadModule();

    await expect(persistCspViolations([VIOLATION])).resolves.toBeUndefined();

    expect(errorSpy.mock.calls.map((c) => String(c[0])).join(' ')).toContain('insertion refusée');
  });

  it('fail-open : exception du client → signale, ne lève pas', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://projet.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'cle-service';
    insertMock.mockRejectedValue(new Error('NETWORK_DOWN'));
    const { persistCspViolations } = await loadModule();

    await expect(persistCspViolations([VIOLATION])).resolves.toBeUndefined();

    expect(errorSpy.mock.calls.map((c) => String(c[0])).join(' ')).toContain('échec');
  });
});
