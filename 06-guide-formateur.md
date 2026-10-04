# Guide formateur — Séquence 2

**Objectif :** établir une connexion native, afficher son état et gérer sa fermeture.  
**Durée :** 90 minutes.  
**Entrée :** S1 validée, environnement Node 24 disponible, frontend et backend déjà identifiés.

## Une progression sans répétition du cours précédent

| Notion | Décision pour S2 |
|---|---|
| Pourquoi WebSocket, comparaison au polling, trajet entre utilisateurs | Acquis S1 ; pas de nouvelle activité ni de cours à reprendre |
| Handshake annoncé en S1 | Nouvelle compétence : lire l’ouverture réelle et ses en-têtes utiles |
| ws/wss et états cités en complément S1 | Nouvelle compétence : choisir une adresse, exploiter les états dans le code et l’interface |
| Installation des outils | Acquise ; récupération du nouveau squelette seulement |
| JSON et messages | S3 ; aucun exercice ni gestionnaire `message` ici |
| Diffusion et registre des clients | S4 ; backend S1 conservé |
| Reconnexion, confirmations, ping/pong et coupure en cours d’échange | S5 ; aucune reprise automatique ici |
| Validation applicative et salons | S6 et S7 ; hors exercice |

Le TP progresse du concept vers une preuve observable. Les répétitions volontaires dans la fiche et le corrigé sont des aides de consultation, pas des activités supplémentaires à faire relire en bloc.

## Déroulé minute par minute

| Créneau | Animation | Preuve ou point de contrôle |
|---|---|---|
| 00–10 | Lecture du cours §1–3 | Distingue URL frontend, diagnostic HTTP et point WebSocket |
| 10–15 | Vidéo de handshake | Repère 101 et comprend que la clé n’est pas une identité utilisateur |
| 15–19 | Live coding de repérage | Identifie constructeur, référence de socket et écouteurs |
| 19–25 | Ouverture du projet, installation à partir du verrouillage, repérage des TODO | Écran apprenant visible, backend démarré |
| 25–30 | TODO 1 | Objet natif créé ; `return` temporaire supprimé |
| 30–34 | TODO 2 | Construction journalisée, état 0 |
| 34–40 | TODO 3 | Événement open, état 1, badge Connecté |
| 40–45 | TODO 4 | Diagnostic prudent prêt |
| 45–48 | Observation réseau ciblée | URL :3000/chat et statut de l’ouverture relevés |
| 48–50 | Point d’étape | Explique pourquoi un objet créé n’est pas encore connecté |
| 50–54 | Consultation de la fiche, lecture des états | Prévoit la fermeture demandée puis effective |
| 54–61 | TODO 5 | État fermé et informations de close |
| 61–67 | TODO 6 | Fermeture volontaire reliée au bouton |
| 67–70 | Parcours nominal | Trace 0 → 1 → 2 → 3 |
| 70–82 | Matrice T1–T5 | Succès, fermeture, serveur arrêté, mauvais chemin, URL invalide |
| 82–87 | Courte correction vidéo et comparaison écrite | Corrige les erreurs de placement et de diagnostic |
| 87–90 | Bilan et remise | Fichier, matrice, relevé et explication |

Les installations de dépendances doivent être anticipées sur les réseaux lents. Les 90 minutes supposent que les outils de S1 sont opérationnels. Aucun long atelier réseau distinct n’est ajouté.

## Démonstration et distribution

Utiliser `projet-corrige` pour enregistrer la démonstration, puis arrêter ses services avant de lancer `projet-apprenant`. Distribuer ce dernier au début du TP ; réserver le corrigé à l’après-tentative.

Le kit peut être diffusé comme dossiers ou via les bundles Git. Le bundle apprenant ne contient pas l’historique de la solution. L’archive globale, elle, contient les deux versions et tous les supports : c’est le kit formateur.

Le backend est identique à S1. L’interface S2 remplace provisoirement la zone de conversation par le panneau de connexion. Il s’agit d’une surface d’exercice ; les bulles et le formulaire de S1 seront réintégrés avec `useConnection` au démarrage de S3.

## Accompagner les difficultés

**Objet créé, indicateur trompeur.** Demander de montrer la ligne qui affiche le succès. Faire déplacer cette mise à jour dans le gestionnaire approprié plutôt que corriger le badge à l’aide d’un délai.

**État technique et affichage désynchronisés.** Faire relever `current.readyState` et la ref Vue. La donnée réactive doit être copiée aux points du cycle de vie ; aucun intervalle n’est nécessaire.

**Erreur sans cause connue.** Ne pas exiger un message « serveur arrêté » parce que le scénario a été préparé ainsi. L’interface n’a pas cette connaissance ; seul le testeur connaît la manipulation qu’il a faite.

**Fermeture trop rapide à voir.** Utiliser le journal. Ne pas imposer un état CLOSING visible pendant une seconde : ce serait une animation artificielle.

**Échec de T3.** Arrêter d’abord une connexion active, puis le backend, puis retenter. Une panne en cours d’échange est hors objectif S2. Cela évite de faire dériver la séance vers les délais de détection et le heartbeat.

**Réouverture imprévue.** Vérifier qu’aucun rappel à `connect()` n’a été placé dans `onClose`. S2 évalue une nouvelle ouverture manuelle ; S5 construira la reprise automatique et ses conditions d’arrêt.

## Évaluation formative

| Compétence | Acquis si… |
|---|---|
| Ouvrir nativement | Constructeur correct, bonne URL, open constaté |
| Lire une ouverture | Distingue 101 du diagnostic HTTP et du WebSocket de Vite |
| Synchroniser l’interface | Badge et boutons cohérents avec les étapes |
| Gérer l’erreur | Pas de faux succès, information prudente, fermeture prise en compte |
| Fermer volontairement | close() appelé, résultat observé et journalisé |
| Expliquer | Distingue création/ouverture et demande/fin de fermeture |

Validation attendue : toutes les compétences principales démontrées. Un relevé réseau accompagné est acceptable si le fonctionnement est prouvé et expliqué. Conserver les écarts dans la matrice pour préparer l’accompagnement, sans créer un nouveau QCM de prérequis qui répéterait S1.

## Passage à S3

Conserver la version validée de `useConnection.js`. S3 ajoutera l’envoi et la réception sur une connexion ouverte et reprendra le formulaire de chat. La gateway commencera alors à traiter les messages. Aucun code métier n’est à ajouter à la fin de S2 pour « prendre de l’avance ».
