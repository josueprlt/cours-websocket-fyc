# Vérifications de la version révisée

**Date : 3 octobre 2026.**

## Environnement effectivement utilisé

- macOS, architecture ARM64.
- Node.js **24.14.0** pour l’installation reproductible, la compilation, les lancements et le client de contrôle natif.
- npm 11.19.0.
- Navigateur intégré pour vérifier le rendu du frontend et l’interaction locale du formulaire.

## Résultats

| Contrôle | Résultat |
|---|---|
| `npm ci` sous Node 24, depuis le verrouillage | Réussi |
| `npm run build` | Réussi pour les workspaces frontend et backend |
| `npm run dev:back` | Backend démarré sur 127.0.0.1:3000 |
| `npm run dev:front` | Frontend démarré sur 127.0.0.1:5173 |
| Requête HTTP `/health` par le script de contrôle | Statut 200 et texte attendu |
| Requête HTTP du frontend | Statut 200 et point d’entrée attendu |
| Frontend dans le navigateur | Interface et trois messages fictifs présents |
| Formulaire local | Saisie « Bonjour » puis clic : information de non-envoi affichée |
| Connexion au point `/chat` | Deux clients utilisant l’API WebSocket native de Node 24 acceptés |
| Fermeture des deux connexions | Fermetures normales, code 1000 |
| Bundle Git | Vérification d’intégrité réussie et clonage réussi |

Le contrôle des connexions confirme la compatibilité protocolaire du serveur natif. Il ne remplace pas le futur exercice S2 de connexion depuis le frontend du navigateur : aucun client métier n’est encore branché dans ce starter.

Le navigateur intégré a bloqué l’ouverture directe de la page de diagnostic textuelle ; sa réponse HTTP a été vérifiée par le script. Le chargement de l’interface et son formulaire ont bien été contrôlés dans le navigateur.

## Cohérence pédagogique vérifiée

- Quatre blocs : 5 + 10 + 15 + 15 = 45 minutes.
- QCM : 8 questions à réponse unique, corrigé expliqué et orientation.
- Schéma : deux connexions distinctes, serveur relais, affichage côté destinataire.
- Aucun enseignement pratique de Socket.IO ni de conversion JSON dans S1.
- Frontend et backend réellement fournis ; les connexions métier restent à programmer dans S2.
- Sept séquences puis évaluation/conclusion : 45 + 90 + 90 + 90 + 120 + 120 + 90 + 45 = 690 minutes, soit 11 h 30.

## Avant diffusion à un groupe

Le système exact des apprenants n’a pas été fourni. La vérification couvre macOS ARM64 et Node 24 ; elle ne vaut pas validation sur Windows ou Linux. Tester le même `npm ci` et les mêmes commandes sur le parc et le réseau de formation avant de promettre un démarrage en quinze minutes.

Les scripts vidéo doivent être enregistrés, chronométrés et sous-titrés. La démonstration cible nécessite une version complète ou le scénario illustré explicitement annoncé. Aucun déploiement, dépôt distant ou import LMS n’a été réalisé.
