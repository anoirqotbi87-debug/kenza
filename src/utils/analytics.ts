/**
 * Basic telemetry tracker for new features.
 * Logs events to console (or could send to an analytics provider) without blocking execution.
 */

export const trackEvent = (eventName: string, payload?: Record<string, any>) => {
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
