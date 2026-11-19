'use client';

import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import KenzChatInterface from '@/components/chat/KenzChatInterface';
import BottomNav from '@/components/navigation/BottomNav';
import { useAppStore } from '@/store/useAppStore';

export default function ChatPage() {
  const { uiLanguage } = useAppStore();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  const badgeText = isAr
    ? 'المساعد الذكي · كنزبوت'
    : lang === 'es'
    ? 'Tutor IA · KenzBot'
    : lang === 'en'
    ? 'AI Tutor · KenzBot'
    : 'Assistant IA · KenzBot';

  const titleText = isAr
    ? 'محادثة حرّة بالدارجة'
    : lang === 'es'
    ? 'Conversación libre en darija'
    : lang === 'en'
    ? 'Free Darija conversation'
    : 'Conversation Libre en Darija';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FAF7F2] pb-24 md:pb-8 pb-safe">
      <PageHeader
        badge={badgeText}
        title={titleText}
        backHref="/"
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-3 sm:pt-5">
        <KenzChatInterface />
      </main>

      <BottomNav />
    </div>
  );
}
