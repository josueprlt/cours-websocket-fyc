# Vérifications du kit

Vérifications réalisées le 30 septembre 2026.

| Élément | Résultat |
|---|---|
| Installation des dépendances du starter | Réussie ; `package-lock.json` généré et inclus |
| Compilation `npm run build` | Réussie avec Vite 7.1.7 ; 10 modules transformés |
| Sortie de compilation | HTML, CSS et JavaScript générés |
| Intégrité du bundle Git | `git bundle verify` réussi |
| Clonage depuis le bundle | Réussi dans un dossier de contrôle |
| Déroulé pédagogique | 3 + 5 + 10 + 5 + 12 + 18 + 5 + 2 = 60 minutes |
| QCM | 12 questions à réponse unique, corrigé séparé, score JS sur 8 et HTTP sur 4 |
| Script vidéo | 337 mots ; durée cible inférieure à 3 minutes, à confirmer lors de l’enregistrement |

## Limites de vérification

La compilation a été exécutée sur macOS avec Node.js 26.8.1 et npm 11.19.0. Le poste pédagogique cible Node.js 24 LTS ; cette version n’a pas été exécutée ici. Un avertissement de dépréciation `module.register()` est apparu sur Node 26, sans empêcher la compilation.

L’affichage et les interactions n’ont pas été vérifiés manuellement dans un navigateur. Le front est volontairement limité à la démonstration statique ; aucun serveur métier ni échange Socket.IO n’est livré dans cette séquence.

Les premières tentatives de compilation sont restées silencieuses un moment, puis ont abouti. Cela ne justifie pas de modifier les consignes de lancement du projet.

Le clonage du bundle a été testé. Aucun hébergement Git distant, enregistrement vidéo ou import LMS n’a été effectué.
