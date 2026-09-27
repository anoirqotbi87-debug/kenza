#!/bin/bash
echo "=== TEST DU CONTROLE D'ORIGINE ==="
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/roleplay/chat \
  -H "sec-fetch-site: cross-site" \
  -H "Content-Type: application/json" \
  -d '{"messages": [], "personaId": "garsoun"}'
echo " (Attendu: 403)"

echo -e "\n=== TEST DE VALIDATION DU PAYLOAD (Messages > 15) ==="
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/roleplay/chat \
  -H "sec-fetch-site: same-origin" \
  -H "Content-Type: application/json" \
  -d '{"messages": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], "personaId": "garsoun"}'
echo " (Attendu: 400)"

echo -e "\n=== TEST DE VALIDATION DU PAYLOAD (Message trop long) ==="
LONG_MSG=$(printf 'A%.0s' {1..501})
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/roleplay/chat \
  -H "sec-fetch-site: same-origin" \
  -H "Content-Type: application/json" \
  -d "{\"messages\": [{\"role\":\"user\", \"content\":\"$LONG_MSG\"}], \"personaId\": \"garsoun\"}"
echo " (Attendu: 400)"

echo -e "\n=== TEST DE RATE LIMITING (11 requêtes) ==="
for i in {1..11}; do
  RES=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/roleplay/chat \
    -H "sec-fetch-site: same-origin" \
    -H "x-forwarded-for: 192.168.1.100" \
    -H "Content-Type: application/json" \
    -d '{"messages": [{"role":"user", "content":"hello"}], "personaId": "garsoun"}')
  echo "Req $i: $RES"
done
echo "(La 11ème requête doit retourner 429)"
