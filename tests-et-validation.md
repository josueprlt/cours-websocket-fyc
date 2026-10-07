# Recette de S2 — Ouvrir, diagnostiquer, fermer

**Bloc final : 20 minutes.** Prévoir environ 12 minutes pour les cinq scénarios, 5 minutes pour comparer à la correction, puis 3 minutes pour le bilan et la remise des preuves. Tester la solution après les six TODO.

## Matrice à renseigner

| Test | Manipulation | Attendu | Résultat observé / acquis ? |
|---|---|---|---|
| T1 · Ouverture | Backend démarré. URL `ws://127.0.0.1:3000/chat`. Cliquer sur Connecter. | `construction` à 0 puis `open` à 1 ; badge Connecté. URL métier et statut 101 repérés dans le réseau HTTP/1.1. | |
| T2 · Fermeture volontaire | Depuis T1, cliquer sur Déconnecter. Attendre 5 s après `close`. | Journal de demande puis `close` ; état final 3. Code 1000 et fermeture propre dans le scénario nominal local. Aucun nouvel `open` spontané. | |
| T3 · Serveur arrêté avant tentative | D’abord fermer la connexion. Arrêter le backend avec Ctrl+C. Recliquer sur Connecter avec l’URL correcte. | Pas de `open` ; `error` puis `close`, état final 3. Texte prudent. Redémarrer ensuite le backend ; il faut cliquer pour retenter. | |
| T4 · Mauvais chemin | Backend démarré, connexion précédente fermée. Remplacer `/chat` par `/absent`, puis Connecter. | Échec d’ouverture, diagnostic et retour à l’état fermé. Ne pas imposer un statut HTTP ou un texte d’erreur identique dans tous les navigateurs. | |
| T5 · URL invalide | Connexion fermée. Utiliser `ws://127.0.0.1:3000/chat#fragment`. | Exception de construction capturée, indication Adresse invalide, pas de faux succès ; aucune nouvelle socket créée. Restaurer l’URL correcte. | |

Pour T3, arrêter le serveur **avant** la tentative. Le test d’une perte réseau au milieu d’un échange, la détection de connexions inactives et la reprise automatique appartiennent à S5.

## Comment interpréter les écarts ?

- **T1 reste en cours, mais le réseau indique 101 :** vérifier TODO 3 et la copie réactive d’état.
- **T1 affiche Connecté avec serveur arrêté :** le succès a probablement été affiché au mauvais endroit.
- **T2 affiche Fermé dès le clic sans journal `close` :** vérifier que l’état final n’a pas été forcé avant l’événement.
- **T3 ou T4 reste bloqué visuellement :** vérifier TODO 5 ; l’état doit être mis à jour à la fermeture.
- **T5 reste en cours :** vérifier le `try/catch` fourni et le retrait du `return` provisoire de TODO 1.
- **Une fermeture donne 1006 :** cela décrit une fermeture sans négociation normale ; ce nombre ne prouve pas à lui seul un mauvais chemin ou un serveur arrêté.

Le panneau réseau peut conserver une entrée d’une tentative précédente. Distinguez-la de la nouvelle par son URL et l’ordre d’apparition. Une erreur de connexion peut être affichée dans la console par le navigateur même si votre gestionnaire a correctement traité son effet dans l’interface.

## Bilan individuel

Répondez en une ou deux phrases :

1. Pourquoi faut-il attendre `open` pour afficher Connecté ?
2. Quelle différence faites-vous entre appeler `close()` et recevoir `close` ?
3. Pourquoi un événement `error` ne permet-il pas d’affirmer « le serveur est éteint » ?
4. Quelle preuve distingue la connexion du chat de celle de Vite ?

## Livrables apprenant

- `frontend/src/useConnection.js` complété ;
- matrice T1–T5 renseignée, y compris les observations inattendues ;
- relevé ou capture de l’URL `:3000/chat` et de l’ouverture ;
- réponses au bilan.

## Critère de passage

La connexion native s’ouvre, son état est visible, une fermeture volontaire aboutit et les trois échecs demandés ne produisent pas de faux succès. L’apprenant explique ses observations. Une difficulté isolée de l’outil réseau peut être accompagnée par le formateur ; elle ne doit pas occuper toute la séance.
