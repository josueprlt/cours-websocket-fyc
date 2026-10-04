# Séquence 2 — Projet corrigé

Node 24.x. Depuis la racine : `npm ci`, puis `npm run dev:back` et `npm run dev:front` dans deux terminaux.

Frontend : http://127.0.0.1:5173 — backend : http://127.0.0.1:3000/health.
Point natif : ws://127.0.0.1:3000/chat.

Le backend est celui de S1. Le travail S2 porte sur les six TODO de `frontend/src/useConnection.js`. L’interface de connexion et son journal sont fournis. Le formulaire de messages reviendra en S3 ; le présent écran isole l’exercice de connexion.

`npm run build` compile les deux workspaces. Arrêter les services avec Ctrl+C. Ne pas lancer en même temps ce projet et celui de S1 : ils utilisent les mêmes ports.

Solution complète de S2, sans envoi de message ni reconnexion automatique.
