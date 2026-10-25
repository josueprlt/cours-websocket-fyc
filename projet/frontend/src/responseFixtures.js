// Chaînes brutes : le premier cas est volontairement du JSON invalide.
export const responseFixtures = [
  { label: 'JSON cassé', raw: '{"event":' },
  { label: 'Champs manquants', raw: '{"event":"chat:message","data":{"content":"Incomplet"}}' },
  { label: 'Type incorrect', raw: '{"event":"chat:message","data":{"id":"x","content":42,"createdAt":"2026-10-21T10:00:00.000Z"}}' },
  { label: 'Date invalide', raw: '{"event":"chat:message","data":{"id":"x","content":"Bonjour","createdAt":"hier"}}' },
  { label: 'JSON null', raw: 'null' },
];
