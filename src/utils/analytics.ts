/**
 * Basic telemetry tracker for new features.
 * Logs events to console (or could send to an analytics provider) without blocking execution.
 */

export interface AnalyticsPayloads {
  pricing_modal_opened: { source: string };
  currency_toggled: { currency: 'EUR' | 'MAD' };
  plan_selected: { plan: 'monthly' | 'yearly'; currency: 'EUR' | 'MAD'; price: number };
  pricing_modal_dismissed: undefined;
  audio_walk_started: { moduleName: string; itemCount: number };
  [key: string]: any; // Fallback for other events
}

export const trackEvent = <K extends keyof AnalyticsPayloads>(
  eventName: K,
  payload?: AnalyticsPayloads[K]
) => {
  try {
    // In a real production app, this would send data to Google Analytics, Mixpanel, etc.
    // Ensure this never throws or blocks the main thread.
    console.debug(`[Telemetry] ${eventName}`, payload || {});
    
    // Example format for sending to an imaginary endpoint:
    /*
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ event: eventName, ...payload, timestamp: new Date().toISOString() }),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    }).catch(() => {});
    */
  } catch (e) {
    // Silent fail
  }
};
