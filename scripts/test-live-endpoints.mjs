/**
 * Test direct en ligne des endpoints de production de Kenza
 * (https://kenza-dusky.vercel.app).
 */

const BASE_URL = 'https://kenza-dusky.vercel.app';

async function checkEndpoints() {
  console.log(`📡 Test des endpoints sur ${BASE_URL}...\n`);

  // 1. POST /api/stripe/webhook sans signature -> doit répondre HTTP 400
  try {
    const res = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
    });
    const status = res.status;
    const body = await res.json().catch(() => ({}));
    console.log(`1. POST /api/stripe/webhook (sans signature) : HTTP ${status} (Attendu: 400)`);
    if (status === 400) {
      console.log(`   ✅ Correctement rejeté (sécurité active, corps reçu: ${JSON.stringify(body)})`);
    } else {
      console.log(`   ⚠️ Inattendu : HTTP ${status}`);
    }
  } catch (err) {
    console.error('   ❌ Échec requête webhook:', err.message);
  }

  // 2. GET pages principales
  const pages = ['/', '/fr', '/fr/etudier', '/fr/parler', '/fr/revisions'];
  for (const page of pages) {
    try {
      const res = await fetch(`${BASE_URL}${page}`, {
        redirect: 'follow',
      });
      console.log(`2. GET ${page} : HTTP ${res.status} (Attendu: 200)`);
      if (res.status === 200) {
        console.log(`   ✅ Page accessible en direct`);
      } else {
        console.log(`   ⚠️ Statut HTTP: ${res.status}`);
      }
    } catch (err) {
      console.error(`   ❌ Échec GET ${page}:`, err.message);
    }
  }
}

checkEndpoints();
