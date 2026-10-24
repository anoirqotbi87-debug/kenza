'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, MessagesSquare, Turtle, Volume2, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { playAudio } from '@/lib/audio';
import { hapticSuccess, hapticError } from '@/lib/haptics';
import ArabiziGuideModal from '@/components/curriculum/ArabiziGuideModal';
import { SITUATION_SCENARIOS, SituationScenario, SituationToken, SituationReplyOption } from '@/data/scenarios';
import { localize, detectArabiziDigit, getVisibleTurnCount } from '@/lib/situations/engine';

const SLOW_SPEED = 0.75;

/** Renvoie la clé de langue d'interface pour la localisation des données. */
function langKey(uiLanguage: string): string {
  return uiLanguage === 'fr' || uiLanguage === 'en' || uiLanguage === 'es' || uiLanguage === 'ar'
    ? uiLanguage
    : 'fr';
}

const ARABIC_RTL = /[\u0600-\u06FF]/;

/** Horodatage stable pour les bulles (ex : « 09:41 »). */
function chatTime(): string {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** Bouton audio (vitesse normale / lente 🐢). */
function AudioButton({ ariaLabel, onClick, slow }: {
  ariaLabel: string; onClick: () => void; slow?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-9 grid place-items-center rounded-full transition-colors ${
        slow ? 'bg-[#F3EDDF] text-[#142943] hover:bg-[#E8E2D5]' : 'bg-[#142943] text-[#FDFCF8] hover:bg-[#1B2A4A]'
      }`}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {slow ? <Turtle size={17} /> : <Volume2 size={16} />}
    </button>
  );
}

/** Bulle de discussion (style messagerie). Les tokens sont tapables (Tap-to-Inspect). */
function ChatBubble({ turn, scenario, lang, soundEnabled, onTokenTap, showArabic, preferArabizi }: {
  turn: SituationScenario['turns'][number];
  scenario: SituationScenario;
  lang: string;
  soundEnabled: boolean;
  onTokenTap: (token: SituationToken) => void;
  showArabic: boolean;
  preferArabizi: boolean;
}) {
  const isUser = turn.speaker === 'user';
  const roleLabel = localize(turn.role, lang);
  const time = chatTime();

  const handlePlay = (slow = false) => {
    void playAudio(turn.arabizi, turn.arabicVocalized, soundEnabled, slow ? SLOW_SPEED : 1);
  };

  return (
    <div className={`flex w-full gap-2.5 mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-[#F3EDDF] grid place-items-center border-2 border-[#C9A05C]/60 shrink-0">
          <span role="img" aria-label={roleLabel} className="text-lg">{scenario.interlocutorEmoji}</span>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm text-sm leading-relaxed ${
          isUser
            ? 'bg-[#D7E3F4] text-[#142943] rounded-tr-none ml-auto'
            : 'bg-white border border-[#E8E2D5] text-[#3B3B3B] rounded-tl-none'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-bold ${isUser ? 'text-[#2A4A7F]' : 'text-[#C9A05C]'}`}>
            {roleLabel}
          </span>
          <span className="text-[10px] text-[#9AA3AF]">{time}</span>
        </div>

        {showArabic && (
          <div className="text-xl font-arabic font-bold mt-1.5" dir="rtl" lang="ar">
            {turn.arabicVocalized}
          </div>
        )}
        {preferArabizi && (
          <div className="mt-0.5 flex flex-wrap gap-y-1">
            {turn.tokens.map((token, i) => (
              <button
                key={`${token.arabizi}-${i}`}
                type="button"
                onClick={() => onTokenTap(token)}
                title={localize(token.translation, lang)}
                className="inline-block px-1 rounded-md bg-[#FAF7F0] hover:bg-[#F3EDDF] active:bg-[#E8E2D5] font-medium"
              >
                {token.arabizi}
              </button>
            ))}
            {turn.tokens.length === 0 && <span className="font-medium">{turn.arabizi}</span>}
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-1.5">
          <AudioButton ariaLabel={roleLabel} onClick={() => handlePlay(false)} />
          <AudioButton ariaLabel={roleLabel} onClick={() => handlePlay(true)} slow />
        </div>
      </div>
      {isUser && (
        <div className="w-9 h-9 rounded-full bg-blue-100 grid place-items-center border-2 border-blue-300 shrink-0">
          <span role="img" aria-label="Vous" className="text-lg">🙋</span>
        </div>
      )}
    </div>
  );
}

/** Carte d'option de réponse (Choose Your Reply). */
function ReplyCard({ option, lang, selected, onSelect }: {
  option: SituationReplyOption;
  lang: string;
  selected: 'correct' | 'wrong' | null;
  onSelect: () => void;
}) {
  const isRtl = ARABIC_RTL.test(option.arabic);
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={selected !== null}
      className={`text-left rounded-xl border px-3 py-2.5 transition-colors w-full ${
        selected === 'correct'
          ? 'border-emerald-300 bg-emerald-50'
          : selected === 'wrong'
            ? 'border-orange-300 bg-orange-50'
            : 'border-[#E8E2D5] bg-[#FDFCF8] hover:border-[#C9A05C]'
      }`}
    >
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-[#142943]">{option.arabizi}</span>
      </div>
      {isRtl && <div className="mt-1 text-base font-arabic" dir="rtl" lang="ar">{option.arabic}</div>}
      <div className="text-[11px] text-[#7A7670]">{localize(option.translation, lang)}</div>
    </button>
  );
}

/** Feuille de traduction par mot (Tap-to-Inspect) + accès au guide phonétique. */
function InspectSheet({ token, lang, onClose, onOpenPhonetic }: {
  token: SituationToken;
  lang: string;
  onClose: () => void;
  onOpenPhonetic: (() => void) | null;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={token.arabizi}
      className="fixed inset-x-0 bottom-0 z-50 bg-[#FDFCF8] shadow-2xl border-t border-[#E8E2D5] rounded-t-2xl animate-in fade-in slide-in-from-bottom-2"
    >
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-arabic" dir="rtl" lang="ar">{token.arabic}</span>
            <span className="text-[#7A7670] mx-1">·</span>
            <span className="font-bold text-[#142943]">{token.arabizi}</span>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-[#F3EDDF]" aria-label="Fermer">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-[#3B3B3B]">
          {localize(token.translation, lang)}
        </p>
        {token.arabiziDigit && onOpenPhonetic && (
          <button
            type="button"
            onClick={onOpenPhonetic}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A05C] text-[#142943] font-medium text-xs hover:bg-[#B98C44]"
          >
            <span className="font-bold">{token.arabiziDigit}</span>
            {localize({ fr: 'Clé des chiffres', en: 'Numbers key', es: 'Clave de números', ar: 'مفتاح الأرقام' }, lang)}
          </button>
        )}
      </div>
    </div>
  );
}

/** Carte de sélection d'un scénario. */
function ScenarioCard({ scenario, lang, onSelect }: {
  scenario: SituationScenario;
  lang: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-left rounded-2xl border border-[#E8E2D5] bg-[#FDFCF8] hover:border-[#C9A05C] hover:bg-[#F7F3EA] transition-colors p-4 shadow-sm w-full"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{scenario.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#C9A05C]">
            {localize(scenario.badge, lang)}
          </p>
          <h3 className="font-display text-base font-bold text-[#142943] mt-0.5">
            {localize(scenario.title, lang)}
          </h3>
          <p className="text-xs text-[#7A7670] mt-1 line-clamp-2">
            {localize(scenario.context, lang)}
          </p>
        </div>
        <ArrowLeft className="w-4 h-4 text-[#C9A05C] rotate-180" />
      </div>
    </button>
  );
}

export default function SituationsPage() {
  const { t } = useTranslation();
  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const preferredNotation = useAppStore((s) => s.preferredNotation || 'arabizi');
  const lang = langKey(String(uiLanguage || 'fr').toLowerCase());
  const s = t.pages?.situations as Record<string, string> | undefined;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [inspectToken, setInspectToken] = useState<SituationToken | null>(null);
  const [phoneticOpen, setPhoneticOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Record<string, SituationReplyOption>>({});
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scenario = useMemo(
    () => SITUATION_SCENARIOS.find((sc) => sc.id === selectedId),
    [selectedId]
  );

  // Défilement automatique vers le bas à chaque nouveau message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turnIndex, feedbacks]);

  if (phoneticOpen) {
    return <ArabiziGuideModal onClose={() => setPhoneticOpen(false)} />;
  }

  // Écran de sélection
  if (!scenario) {
    return (
      <div className="min-h-screen bg-[#F7F3EA]">
        <PageHeader
          badge={s?.badge ?? 'Situations du Bled'}
          title={s?.title ?? 'Simulateur de conversations'}
        />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <MessagesSquare className="w-4.5 h-4.5 text-[#2E8B57]" />
            <span className="text-sm font-semibold text-[#2E8B57]">
              {s?.offlineBadge ?? '100 % hors-ligne'}
            </span>
          </div>
          <h2 className="mt-5 text-lg font-display font-bold text-[#142943]">
            {s?.chooseScenario ?? 'Choisis une situation'}
          </h2>
          <div className="grid gap-4 mt-3">
            {SITUATION_SCENARIOS.map((sc) => (
              <ScenarioCard
                key={sc.id}
                scenario={sc}
                lang={lang}
                onSelect={() => {
                  setSelectedId(sc.id);
                  setTurnIndex(0);
                  setFeedbacks({});
                }}
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const turns = scenario.turns;
  const currentIndex = Math.min(turnIndex, turns.length - 1);
  const currentTurn = turns[currentIndex];
  const visibleTurnCount = getVisibleTurnCount(currentIndex);
  const visibleTurns = turns.slice(0, visibleTurnCount);
  const isDone = turnIndex >= turns.length;
  const atUserTurn = !isDone && currentTurn.speaker === 'user';
  const currentOptions = atUserTurn ? (currentTurn.options ?? []) : [];

  const chooseReply = (option: SituationReplyOption) => {
    if (!currentTurn) return;
    const good = option.correct === true;
    setFeedbacks((f) => ({ ...f, [currentTurn.id]: option }));
    if (good) hapticSuccess(); else hapticError();
    if (good) {
      window.setTimeout(() => {
        setTurnIndex((i) => i + 1);
      }, 950);
    }
  };

  const restart = () => {
    setTurnIndex(0);
    setFeedbacks({});
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA]">
      <PageHeader
        badge={s?.badge ?? 'Situations du Bled'}
        title={localize(scenario.title, lang)}
        backHref="/situations"
        actions={
          <button
            type="button"
            onClick={restart}
            className="px-2.5 py-1 rounded-full bg-[#FDFCF8] text-[#C9A05C] font-medium text-xs hover:bg-[#F3EDDF]"
          >
            {s?.startOver ?? 'Recommencer'}
          </button>
        }
      />

      <main className="max-w-2xl mx-auto px-3 py-4 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-semibold text-[#2E8B57]">
            {s?.offlineBadge ?? '100 % hors-ligne'}
          </span>
          <span className="text-[#E8E2D5] mx-1.5">|</span>
          <span className="text-[11px] text-[#7A7670]">
            {s?.tapWord ?? 'Touche un mot pour voir sa traduction'}
          </span>
        </div>

        {/* Zone de chat */}
        <div
          ref={scrollRef}
          className="rounded-2xl bg-[#F3F6FA] border border-[#E8E2D5] h-[520px] overflow-y-auto px-3 py-3 flex flex-col"
        >
          {visibleTurns.map((turn) => (
            <ChatBubble
              key={turn.id}
              turn={turn}
              scenario={scenario}
              lang={lang}
              soundEnabled={soundEnabled}
              onTokenTap={(token) => setInspectToken(token)}
              showArabic={preferredNotation === 'arabic' || preferredNotation === 'duo'}
              preferArabizi={preferredNotation === 'arabizi' || preferredNotation === 'duo'}
            />
          ))}

          {isDone && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-lg font-semibold text-[#142943]">🎉</p>
              <p className="mt-1 font-semibold text-[#2E8B57]">{s?.done ?? 'Situation terminée !'}</p>
              <p className="text-xs text-[#7A7670]">{s?.doneDesc ?? 'Tu as tenu toute la conversation. Bravo !'}</p>
              <button
                type="button"
                onClick={restart}
                className="mt-3 px-4 py-2 rounded-full bg-[#C9A05C] text-[#142943] font-medium"
              >
                {s?.again ?? 'Rejouer'}
              </button>
            </div>
          )}
        </div>

        {/* Zone de réponse */}
        {atUserTurn && (
          <div className="rounded-2xl border border-[#E8E2D5] bg-[#FDFCF8] px-3 pt-2.5 pb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-[#7A7670]">
              {s?.chooseReply ?? 'Choisis ta réponse'}
            </p>
            <div className="grid gap-2 mt-1.5">
              {currentOptions.map((option, i) => {
                const chosen = feedbacks[currentTurn.id];
                const selected = chosen === option
                  ? (option.correct ? 'correct' : 'wrong')
                  : null;
                return (
                  <ReplyCard
                    key={i}
                    option={option}
                    lang={lang}
                    selected={selected}
                    onSelect={() => chooseReply(option)}
                  />
                );
              })}
            </div>
            {feedbacks[currentTurn.id] && (
              <div className={`mt-3 text-xs rounded-lg px-3 py-2 ${
                feedbacks[currentTurn.id].correct
                  ? 'bg-emerald-50 text-[#2E8B57]'
                  : 'bg-orange-50 text-[#B4690E]'
              }`}>
                <span className="font-bold">
                  {feedbacks[currentTurn.id].correct
                    ? (s?.correct ?? 'Parfait !')
                    : (s?.awkward ?? 'Maladroit…')}
                </span>{' '}
                {localize(feedbacks[currentTurn.id].feedback, lang)}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom-sheet d'inspection */}
      {inspectToken && (
        <InspectSheet
          token={inspectToken}
          lang={lang}
          onClose={() => setInspectToken(null)}
          onOpenPhonetic={detectArabiziDigit(inspectToken.arabizi)
            ? () => setPhoneticOpen(true)
            : null}
        />
      )}
    </div>
  );
}