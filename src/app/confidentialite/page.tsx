import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Kenza',
  description: 'Comment Kenza traite vos données personnelles.',
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#1B2A4A]">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <header className="space-y-2">
          <Link href="/" className="text-xs text-[#7A7670] underline hover:text-[#1B2A4A]">
            ← Retour à Kenza
          </Link>
          <h1 className="font-display text-3xl font-bold">Politique de confidentialité</h1>
          <p className="text-sm text-[#7A7670]">Dernière mise à jour : septembre 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">1. Données collectées</h2>
          <p className="text-sm leading-relaxed">
            Kenza collecte votre adresse e-mail et un identifiant de compte lors de l&apos;inscription,
            ainsi que votre progression d&apos;apprentissage (leçons terminées, révisions, points).
            Ces données servent uniquement à faire fonctionner le service et à synchroniser votre
            progression entre vos appareils.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">2. Authentification (Supabase)</h2>
          <p className="text-sm leading-relaxed">
            L&apos;authentification et le stockage de vos données sont assurés par Supabase. Votre mot
            de passe n&apos;est jamais accessible en clair : il est géré par le service
            d&apos;authentification de Supabase. Vous pouvez également vous connecter via un
            fournisseur tiers (Google), auquel cas seule l&apos;identité nécessaire à la connexion est
            transmise.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">3. Paiements (Stripe)</h2>
          <p className="text-sm leading-relaxed">
            Les paiements et abonnements sont traités par Stripe. Vos données de carte bancaire sont
            saisies directement sur l&apos;interface sécurisée de Stripe et ne transitent jamais par
            les serveurs de Kenza, qui n&apos;en conserve aucune copie. Kenza stocke uniquement un
            identifiant client Stripe et le statut de l&apos;abonnement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">4. Stockage local</h2>
          <p className="text-sm leading-relaxed">
            Certaines données de progression sont conservées localement sur votre appareil pour
            permettre l&apos;utilisation hors-ligne. Le statut d&apos;abonnement, lui, n&apos;est jamais
            stocké localement : il est relu depuis nos serveurs à chaque session.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">5. Vos droits</h2>
          <p className="text-sm leading-relaxed">
            Vous pouvez demander l&apos;accès, la correction ou la suppression de vos données à tout
            moment en nous contactant à l&apos;adresse ci-dessous. La suppression du compte entraîne
            l&apos;effacement des données associées.
          </p>
        </section>

        <footer className="pt-6 border-t border-[#E8E2D5] text-sm text-[#7A7670] space-y-2">
          <p>
            Voir également nos{' '}
            <Link href="/cgu" className="underline hover:text-[#1B2A4A]">
              conditions générales
            </Link>
            .
          </p>
          <p>
            Contact :{' '}
            <a href="mailto:anoirqotbi87@gmail.com" className="underline hover:text-[#1B2A4A]">
              anoirqotbi87@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
