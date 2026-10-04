# Vidéos S2 — Scripts et déroulés de capture

Scripts à enregistrer et sous-titrer ; aucun fichier vidéo n’est livré. Les durées ci-dessous sont des cibles comprenant les manipulations et les pauses. Les capsules n’ajoutent pas de temps aux 90 minutes : elles occupent les créneaux du guide.

## Vidéo 1 — Observer une ouverture · 5 minutes

**Préparation :** backend démarré, projet corrigé affiché sans connexion, outils Réseau ouverts. Ne pas enregistrer de compte personnel ni de données étrangères au projet.

| Temps | Action | Texte à prononcer / intention |
|---|---|---|
| 00:00–00:40 | Montrer l’adresse, sans cliquer | « En S1, nous avons expliqué le choix du protocole. Ici, notre question est précise : comment vérifier que le navigateur a obtenu sa connexion ? L’adresse vise le backend sur 3000 et le chemin /chat. » |
| 00:40–01:30 | Cliquer Connecter et sélectionner la bonne entrée réseau | « Le constructeur déclenche une tentative. Le journal montre ensuite open. Dans Réseau, je sélectionne la connexion métier, pas celle de Vite. » |
| 01:30–02:40 | Montrer URL, Upgrade et 101 | « Le navigateur demande le changement de protocole. Dans notre ouverture HTTP/1.1, le serveur l’accepte avec 101. Une réponse 200 sur /health aurait seulement validé la route de diagnostic. » |
| 02:40–03:30 | Pointer Key et Accept | « Le navigateur et le serveur vérifient l’ouverture à l’aide de ces éléments. Ce ne sont pas des identifiants utilisateur. Nous ne les construisons pas dans Vue. » |
| 03:30–04:20 | Montrer ws local, puis une carte avec wss | « En local, notre serveur utilise ws. Wss nécessite TLS côté serveur ; changer les lettres de l’adresse ne suffit pas. Nous n’installons pas de certificat dans cet exercice. » |
| 04:20–05:00 | Revenir au journal | « Votre preuve combinera la bonne entrée réseau et open. Trois minutes d’observation dans le TP suffiront : notre travail principal est le code qui fait évoluer l’interface. » |

## Vidéo 2 — Repérer le code · 4 minutes

Montrer le squelette apprenant, puis une courte démonstration séparée du constructeur. Ne pas remplir les six TODO à la place de l’apprenant.

**00:00–01:00 — Les fichiers.**

« Le backend est celui de S1. La gateway attend déjà les connexions. L’interface est fournie dans App.vue. Le travail se concentre dans useConnection.js : une fonction fournit les données et les actions nécessaires à cet écran. »

**01:00–02:00 — L’objet technique et l’affichage.**

Montrer `socket`, `url`, `readyState`, `information`. « Socket conserve l’objet réseau ; readyState est la copie réactive qui pilote le badge. Le navigateur peut faire évoluer son objet sans modifier automatiquement notre ref Vue. »

**02:00–03:00 — La tentative.**

Montrer un exemple isolé `new WebSocket(adresse)` puis le `try/catch`. « Le constructeur reçoit l’adresse et retourne immédiatement un objet. Le résultat réseau arrivera ensuite. Le catch est déjà prévu pour une adresse que le constructeur refuse. »

**03:00–04:00 — Les zones de travail.**

Montrer les trois fonctions vides et le câblage des écouteurs. « Vous compléterez les gestionnaires existants. Ne rajoutez pas un deuxième abonnement. Le journal et les garde-fous sont fournis. Commencez par remplacer les deux lignes temporaires de TODO 1, puis traitez l’état initial et open. »

## Vidéo 3 — Corriger les trois erreurs fréquentes · 3 minutes

À consulter après la matrice de tests, dans le créneau de correction de cinq minutes. Garder les deux dernières minutes pour la comparaison écrite.

**00:00–01:00 — Le faux succès.** Montrer l’erreur « Connecté » écrit après le constructeur, puis le déplacement dans `onOpen`. « Un serveur indisponible ne doit pas produire de badge de réussite. Le test serveur arrêté révèle ce placement incorrect. »

**01:00–02:00 — La fermeture anticipée.** Montrer `readyState.value = 3` au clic comme erreur, puis remplacer par la lecture de l’état après `close()`. « Nous demandons une fermeture, nous ne décidons pas qu’elle est terminée. Le gestionnaire close constate le résultat. »

**02:00–03:00 — Le diagnostic inventé.** Comparer un mauvais chemin et un serveur arrêté. « Ces deux causes peuvent conduire au même signal error. Le texte utilisateur doit rester prudent. Le journal et les observations du testeur permettent d’aller plus loin. Consultez maintenant le corrigé écrit, puis justifiez une correction dans votre propre fichier. »
