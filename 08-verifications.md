# Vérifications — Séquence 2

**Finalisées le 4 octobre 2026.** Environnement : macOS ARM64, Node.js 24.14.0, npm 11.19.0 ; navigateur intégré pour les interactions du corrigé.

## Résultats techniques

| Contrôle | Résultat |
|---|---|
| Installation reproductible des deux projets avec `npm ci` | Réussie |
| Compilation du frontend et du backend du squelette | Réussie ; TODO conservés |
| Compilation du frontend et du backend corrigés | Réussie |
| Ouverture native depuis le navigateur | `construction` état 0, `open` état 1, badge Connecté |
| Fermeture volontaire dans le navigateur | `close demandé` état 2, puis `close` état 3 ; code 1000, raison attendue et `wasClean=true` |
| Mauvais chemin `/absent` | `error` puis `close`, code 1006, état final 3, aucun faux succès |
| URL avec fragment | Exception capturée, indication Adresse invalide, aucun nouvel objet créé |
| Backend arrêté avant tentative | `error` puis `close`, code 1006, état final 3 |
| Redémarrage du backend | L’écran reste fermé jusqu’au clic ; nouvelle ouverture manuelle réussie |
| Contrôle du handshake par un client de test distinct | HTTP 101 et en-tête Upgrade websocket ; fermeture normale 1000 |
| Bundles apprenant et corrigé | Intégrité vérifiée et clonage réussi séparément |

L’observation du cycle de vie et des boutons a été effectuée dans le navigateur. Les en-têtes du handshake ont été contrôlés par un client de test distinct ; la manipulation manuelle de l’onglet Réseau décrite pour les apprenants n’a pas fait l’objet d’une capture livrée.

## Correspondance avec le cours

Les scénarios T1 à T5 ont été exercés sur le corrigé. Les erreurs ne créent pas un état natif fictif ; le résultat final est synchronisé avec la fermeture. Aucun message métier ni temporisateur de reconnexion n’est ajouté.

Le backend et les dépendances de S1 sont conservés. La progression de S2 porte sur le nouveau fichier `useConnection.js` et l’écran fourni. Le squelette compile avant réalisation ; il n’est pas censé se connecter tant que le premier TODO reste incomplet.

Le déroulé totalise 15 + 10 + 25 + 20 + 20 = 90 minutes. Les vérifications réseau sont intégrées au TP. La comparaison au polling, le traitement JSON, la diffusion, les confirmations et les salons ne sont pas repris comme activités S2.

## Conditions et limites

Des délais de lecture de fichiers dans le répertoire initial ont perturbé certains lancements. Les vérifications d’exécution ont été terminées sur une copie locale temporaire des sources, avec le même backend. Les sources distribuées sont comparées aux copies utilisées lors de l’assemblage.

Le système des apprenants n’étant pas précisé, la validation ne couvre pas Windows ou Linux. Avant diffusion, vérifier les commandes sur le parc et le réseau de formation. Le serveur reste local et sans TLS : la distinction ws/wss est enseignée, mais aucun test TLS ni certificat n’est livré dans S2.

Les vidéos sont des scripts à enregistrer et chronométrer. Les bundles sont des dépôts locaux ; aucun hébergement distant n’a été créé.
