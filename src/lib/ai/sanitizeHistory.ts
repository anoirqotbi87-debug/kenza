export function sanitizeHistory(messages: unknown): Array<{ role: 'user' | 'assistant'; content: string }> | null {
  const rawMessages = Array.isArray(messages) ? messages : [];
  const cleanedMessages = rawMessages
    .filter((m: unknown) => {
      const item = m as { content?: unknown };
      return item && typeof item.content === 'string' && item.content.trim().length > 0;
    })
    .map((m: unknown) => {
      const item = m as { role?: unknown; content: string };
      return {
        role: item.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: item.content.trim(),
      };
    });

  // Garantir que l'historique commence obligatoirement par un message 'user'
  while (cleanedMessages.length > 0 && cleanedMessages[0].role !== 'user') {
    cleanedMessages.shift();
  }

  // Fusionner les messages consécutifs ayant le même rôle (alternance stricte)
  const normalizedHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const msg of cleanedMessages) {
    if (normalizedHistory.length === 0) {
      normalizedHistory.push(msg);
    } else {
      const lastMsg = normalizedHistory[normalizedHistory.length - 1];
      if (lastMsg.role === msg.role) {
        lastMsg.content += '\n' + msg.content;
      } else {
        normalizedHistory.push(msg);
      }
    }
  }

  // Vérifier que le dernier message provient bien de l'utilisateur
  if (normalizedHistory.length === 0 || normalizedHistory[normalizedHistory.length - 1].role !== 'user') {
    return null;
  }

  return normalizedHistory;
}
