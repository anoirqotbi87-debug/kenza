import type { Metadata } from 'next';
import Link from 'next/link';
import { formatPriceInBothCurrencies, TRIAL_PERIOD_DAYS } from '@/config/pricing';

export const metadata: Metadata = {
  title: 'Conditions Générales — Kenza',
  description: "Conditions générales d'utilisation et d'abonnement de Kenza.",
};

export default function CguPage() {
  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#1B2A4A]">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <header className="space-y-2">
          <Link href="/" className="text-xs text-[#7A7670] underline hover:text-[#1B2A4A]">
            ← Retour à Kenza
          </Link>
          <h1 className="font-display text-3xl font-bold">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-sm text-[#7A7670]">Dernière mise à jour : septembre 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">1. Objet</h2>
          <p className="text-sm leading-relaxed">
            Kenza est une application d&apos;apprentissage du dialecte marocain (darija). L&apos;accès aux
            modules 1 et 2 est gratuit. L&apos;accès aux modules 3 à 7 ainsi qu&apos;aux fonctionnalités
            avancées nécessite un abonnement Kenza Pro.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">2. Abonnements et tarifs</h2>
          <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
            <li>
              Formule annuelle : {formatPriceInBothCurrencies('yearly')}, avec {TRIAL_PERIOD_DAYS} jours
              d&apos;essai gratuit.
            </li>
            <li>
              Formule mensuelle : {formatPriceInBothCurrencies('monthly')}, sans période d&apos;essai.
            </li>
          </ul>
          <p className="text-sm leading-relaxed">
            Pendant la période d&apos;essai gratuit de la formule annuelle, aucun montant n&apos;est
            débité. À l&apos;issue des {TRIAL_PERIOD_DAYS} jours, l&apos;abonnement démarre
            automatiquement et le montant annuel est facturé.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">3. Reconduction automatique</h2>
          <p className="text-sm leading-relaxed">
            Les abonnements sont à reconduction automatique : ils se renouvellent à échéance
            (mensuelle ou annuelle) sauf résiliation avant la date de renouvellement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">4. Résiliation</h2>
          <p className="text-sm leading-relaxed">
            Vous pouvez résilier à tout moment, sans frais, depuis l&apos;espace « Gérer mon
            abonnement » de votre profil. Cette action ouvre le portail de facturation sécurisé de
            notre prestataire de paiement. La résiliation prend effet à la fin de la période en
            cours ; l&apos;accès reste ouvert jusqu&apos;à cette date.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">5. Paiement</h2>
          <p className="text-sm leading-relaxed">
            Les paiements sont traités par Stripe. Kenza ne stocke aucune donnée bancaire : les
            informations de carte sont saisies directement sur l&apos;interface sécurisée du
            prestataire.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">6. Droit de rétractation</h2>
          <p className="text-sm leading-relaxed">
            Conformément à la réglementation applicable aux contenus numériques, l&apos;accès
            immédiat au service peut limiter le droit de rétractation une fois l&apos;abonnement
            effectivement entamé.
          </p>
        </section>

        <footer className="pt-6 border-t border-[#E8E2D5] text-sm text-[#7A7670] space-y-2">
          <p>
            Voir également notre{' '}
            <Link href="/confidentialite" className="underline hover:text-[#1B2A4A]">
              politique de confidentialité
            </Link>
            .
          </p>
          <p>
            Contact :{' '}
            <a href="mailto:support@kenza.app" className="underline hover:text-[#1B2A4A]">
              support@kenza.app
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
