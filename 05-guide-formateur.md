# Guide formateur — Séquence 1 révisée

## Cadrage

**Intitulé :** Comprendre pourquoi une messagerie utilise WebSocket.  
**Durée :** environ 45 minutes.  
**Objectif :** expliquer le choix de WebSocket et préparer l’environnement.  
**Validation :** schéma du trajet d’un message complété, frontend et backend démarrés.

Cette version suit la scénarisation transmise : sept séquences, puis une évaluation et une conclusion de 45 minutes. Total : 11 h 30. Elle remplace la proposition initiale d’une séance d’une heure centrée sur un front statique.

Le projet emploie Vue, l’API WebSocket native du navigateur, NestJS et `WsAdapter`/`ws`. Aucun paquet Socket.IO n’est utilisé. Le socle serveur est fourni ; l’apprenant ne configure pas NestJS dans S1.

## Préparation avant la séance

1. Fournir les consignes d’installation de Node 24, npm et Git avant l’ouverture du cours.
2. Vérifier le kit sur le système et le réseau des apprenants. Consulter `08-verifications.md` pour distinguer les vérifications réalisées de celles restant nécessaires selon le parc.
3. Distribuer le bundle Git ou publier les sources du dossier `projet` sur votre hébergement habituel ; aucun dépôt distant n’est créé par ce kit.
4. Préparer les vidéos à partir de `06-scripts-videos.md`. Les scripts sont livrés, pas les enregistrements.
5. Prévoir une démonstration de la messagerie cible issue de votre version complète. Le starter S1 ne contient pas encore ces fonctionnalités. À défaut, montrer un scénario illustré en l’annonçant explicitement ; ne pas faire passer la maquette pour un chat terminé.
6. Dans le LMS, placer le corrigé du QCM après la soumission et celui du schéma après la tentative.

## Déroulé de 45 minutes

| Temps | Support et animation | Activité / résultat |
|---|---|---|
| 00–05 | Capsules de présentation de l’équipe et du cours, puis démonstration cible ou scénario illustré | L’apprenant identifie les fonctions à construire |
| 05–12 | QCM de huit questions | Réponse individuelle sur JavaScript, JSON, événements et HTTP |
| 12–15 | Correction écrite | Lecture des erreurs et choix d’une priorité de révision |
| 15–25 | Cours écrit illustré, parties 2 à 6 | Compréhension de HTTP, polling, canal bidirectionnel et relais serveur |
| 25–27 | Courte vidéo explicative | Reprise visuelle de la différence polling/WebSocket |
| 27–30 | Schéma à compléter et autocorrection | Identification des deux connexions et du rôle du serveur |
| 30–32 | Vérification des outils | Node 24, npm et Git disponibles |
| 32–34 | Récupération du projet | Dépôt cloné ou dossier de secours identifié |
| 34–38 | Installation des dépendances | `npm ci` terminé |
| 38–42 | Démarrage des deux services | Deux terminaux actifs |
| 42–45 | Vérifications et checklist | Frontend visible, `/health` accessible, preuves conservées |

Le bloc théorique principal représente environ 1 400 mots, avec des schémas. Les dix minutes sont une estimation de lecture, à ajuster aux retours du groupe. Le complément approfondi reste consultable après la séance ; il n’allonge pas les activités obligatoires. Si les bases réseau sont fragiles, prévoir du temps de remédiation identifié plutôt que présenter 45 minutes comme une durée garantie.

## Ce qu’il faut approfondir oralement

**Le besoin d’Alex.** L’émetteur sait quand il veut parler ; le destinataire ignore quand un message va arriver. Commencer par cette asymétrie donne une raison concrète au choix technique.

**Le serveur comme relais.** Faire tracer deux connexions séparées avant de dessiner le trajet du message. Vérifier que l’apprenant ne suppose pas un lien direct entre navigateurs ni une connexion commune à toute la classe.

**La bidirectionnalité.** Une flèche dans un schéma de message indique le sens de cet envoi, pas une restriction du canal. Le même canal sert à envoyer et recevoir. Il n’impose pas une alternance demande/réponse.

**Le partage des responsabilités.** À la question « Qui choisit les destinataires ? », la réponse attendue est « le code serveur », pas « WebSocket ». Cette distinction prépare les registres de clients et les salons.

**Les garanties.** Faire distinguer l’envoi, le traitement serveur et la lecture par une personne. Ne pas annoncer qu’un clic ou une connexion ouverte garantit la livraison et la lecture.

## Frontières entre les séquences

| En S1 | Développement prévu ensuite |
|---|---|
| Expliquer le principe d’ouverture | S2 : handshake observé, adresses ws/wss, événements et états |
| Suivre le trajet d’une phrase sans code | S3 : structure des échanges, sérialisation et décodage |
| Identifier plusieurs connexions | S4 : registre, identifiants serveur et diffusion, émetteur inclus |
| Comprendre qu’une coupure est possible | S5 : temporisation de reprise, confirmations et états d’envoi |
| Situer la validation côté serveur | S6 : contrôles, limite de taille et cinq messages/s/connexion |
| Annoncer les salons | S7 : un salon actif par connexion et diffusion restreinte |

Le mini-cours sur les méthodes de conversion JSON a été retiré de S1. Une question de reconnaissance reste dans le diagnostic parce que la nouvelle scénarisation le prévoit. La pratique détaillée se situe en S3.

La reconnexion à intervalle fixe imposée par l’ancien plan ne fait plus partie du cadrage : la nouvelle S5 emploie des délais progressifs et des conditions d’arrêt. Le défaut de doublon de S4 vient maintenant d’un écouteur enregistré plusieurs fois ; la diffusion prévue inclut l’émetteur. Les anciennes commandes ludiques ne sont plus annoncées, car elles ne figurent pas dans la nouvelle S6.

## Notes techniques pour préparer S2 et S3

Le starter configure `app.useWebSocketAdapter(new WsAdapter(app))`. La gateway `/chat` n’a aucun gestionnaire métier ; elle fournit le point de connexion attendu pour S2. Le backend répond aussi à `/health` en HTTP. Le frontend ne crée volontairement pas de WebSocket métier en S1.

Pour S3, `WsAdapter` attend par défaut une enveloppe `{ event, data }` pour router les messages vers les gestionnaires NestJS. Prévoir, par exemple, un événement applicatif `chat:send` et son contenu dans `data`. Ce choix doit être documenté dans S3, pas présenté comme le format imposé par WebSocket. Un retour de gestionnaire peut ensuite être sérialisé par l’adaptateur. [Documentation NestJS, WsAdapter](https://docs.nestjs.com/websockets/adapter#ws-library).

Ne pas réintroduire `socket.id`, `socket.broadcast.emit()` ou `socket.join()` comme des méthodes natives. Les identifiants, le registre et le salon actif seront des données applicatives. Le serveur `ws` et le navigateur n’exposent pas exactement la même API ; les exemples devront préciser de quel côté ils s’exécutent.

## Grille de validation

| Critère | Preuve attendue | Suivi si manquant |
|---|---|---|
| Comprend le besoin | Explique pourquoi attendre le prochain sondage retarde l’affichage | Reprendre la chronologie 0 s / 1 s / 3 s |
| Identifie les connexions | Deux canaux distincts sur le schéma Camille/Alex | Refaire le schéma avec un troisième client |
| Situe le serveur | Le serveur reçoit et choisit les destinataires | Reprendre le trajet de bout en bout |
| Distingue affichage et transport | Alex met à jour son interface à réception | Faire identifier où s’exécute Vue |
| Démarre le frontend | Interface accessible sur 5173 | Conserver erreur et versions |
| Démarre le backend | Réponse attendue de `/health` sur 3000 | Examiner compilation et port |
| Comprend la limite de S1 | Ne confond pas disponibilité des services et chat connecté | Annoncer précisément l’exercice de S2 |

Le score du QCM oriente l’aide ; il n’est pas une condition d’exclusion. Le schéma et les deux vérifications techniques constituent les preuves de sortie.

## Questions fréquentes

**« Sans Socket.IO, doit-on réécrire TCP ? »** Non. L’API navigateur et `ws` gèrent le protocole. Les exercices portent sur la logique de la messagerie.

**« Peut-on faire un chat avec HTTP ? »** Oui, avec d’autres stratégies. Notre choix se justifie par des échanges fréquents dans les deux sens. Éviter d’enseigner que WebSocket serait obligatoire pour toute mise à jour dynamique.

**« Pourquoi `/health` utilise HTTP ? »** Pour vérifier simplement le démarrage du backend sans réaliser à la place de l’apprenant l’exercice de connexion de S2.

**« Pourquoi ne voit-on pas encore de vrais messages ? »** Le socle est démarré ; le branchement du navigateur, les échanges puis la diffusion sont précisément les travaux de S2, S3 et S4.
