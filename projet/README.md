# Séquence 4 — Projet apprenant

Cinq TODO backend à compléter dans `backend/src/chat.gateway.ts`, puis diagnostic TODO 6 décrit dans le TP. Le squelette compile, mais ne diffuse pas encore. Le client S3 est fonctionnel et adapté au contrat S4.

Prérequis : Node 24.x. Depuis ce dossier :

```sh
npm ci
npm run dev:back
```

Dans un second terminal :

```sh
npm run dev:front
```

Ouvrir trois fenêtres à `http://127.0.0.1:5173`. Connexion automatique à `ws://127.0.0.1:3000/chat`. Diagnostic HTTP : `http://127.0.0.1:3000/health`. Après modification backend, arrêter et relancer `npm run dev:back`, puis reconnecter les fenêtres avec Réessayer ou Atelier → Connecter. La reconnexion reste manuelle.

Le serveur attribue les identifiants de connexion. Le nom « Vous » en bas à gauche est un champ éditable discret (32 caractères maximum). Le nom choisi accompagne les prochains messages ; les anciens conservent leur nom au moment de l’envoi. Vos messages apparaissent à gauche en vert, ceux des autres à droite en gris. Le serveur annonce votre identifiant avec un accueil privé `chat:welcome` ; cette identité détermine l’alignement, même en cas de noms identiques. Sans nom dans le message, l’interface affiche « Client » et le préfixe d’identifiant ; les valeurs complètes sont visibles au survol de la mention sous la bulle et dans les trames. Chaque liste reçoit seulement les messages diffusés pendant sa connexion. Un rechargement efface l’historique local.

`npm run build` compile les deux workspaces. Les deux projets partagent les ports : ne pas les lancer simultanément. Arrêter les services avec Ctrl+C.

Suivre le [cours](../cours.md), le [TP](../tp-guide.md) et la [recette](../tests-et-validation.md). Les scripts et transcriptions des capsules sont dans [videos.md](../videos.md). Aucun laboratoire d’accumulation n’est requis.
