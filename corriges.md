# Corrigés — Séquence 1

Consultez chaque partie après avoir tenté l’activité correspondante. Dans un LMS, le corrigé du QCM peut être révélé dès sa soumission et celui du schéma après sa validation.

## 1. QCM de positionnement

| Nº | Réponse | Explication |
|---|---|---|
| 1 | B | On accède à une propriété avec le nom de l’objet, un point et le nom de la propriété. `message.content` vaut ici `Bonjour`. |
| 2 | A | `const` empêche de réaffecter la variable à un autre tableau ; les éléments du tableau existant peuvent être modifiés. |
| 3 | C | Ce texte décrit des données avec des propriétés et leurs valeurs. JSON est un format d’échange, pas une instruction d’envoi. |
| 4 | B | La fonction est enregistrée pour être appelée lorsque l’événement arrive. Elle n’est pas appelée à cette ligne. |
| 5 | A | A et C sont exécutés dans la partie synchrone. Le callback du temporisateur est exécuté ensuite, même avec un délai demandé de zéro. |
| 6 | C | GET demande la ressource désignée. Cette requête ne crée pas automatiquement une conversation collective. |
| 7 | B | 404 signale une ressource non trouvée. Il s’agit d’une réponse reçue : le statut ne signifie pas que le serveur est éteint. |
| 8 | A | Vue met à jour l’affichage dans le navigateur de l’utilisateur. Le serveur lui transmettra les données nécessaires. |

**Orientation proposée :**

- **7 ou 8 / 8 :** poursuivre ; lire l’explication d’une éventuelle erreur.
- **5 ou 6 / 8 :** poursuivre avec une révision ciblée.
- **0 à 4 / 8 :** prévoir un accompagnement sur les bases avant les exercices de code réseau.

Regardez aussi les familles d’erreurs : objets/tableaux (1–2), reconnaissance JSON (3), événements/asynchronisme (4–5), HTTP et rôles (6–8). Une erreur sur les événements est particulièrement utile à travailler avant S2.

**Micro-révisions, hors temps obligatoire :**

| Notion | Travail de 5 minutes |
|---|---|
| Objets | Créer un objet avec `author` et `content`, puis lire les deux valeurs. |
| Événements | Expliquer la différence entre passer `envoyer` comme callback et appeler `envoyer()`. |
| Asynchronisme | Exécuter l’extrait A/B/C, modifier le délai, puis expliquer pourquoi C ne patiente pas. |
| HTTP | Dessiner une requête du navigateur et une réponse du serveur, puis distinguer réponse 404 et absence de réponse. |

## 2. Schéma du trajet d’un message

1. Le navigateur de Camille **envoie le message**.
2. Il utilise la **connexion de Camille**.
3. Le serveur **reçoit et choisit les destinataires**.
4. Il transmet sur la **connexion d’Alex**.
5. Le navigateur d’Alex **affiche le message**.

```text
Camille                    Serveur                      Alex
   |── connexion A ──────────>|                            |
   |                          | reçoit, traite, choisit    |
   |                          |── connexion B ────────────>|
   |                          |                            | affiche
```

Les flèches indiquent le trajet de ce message précis. Les connexions A et B permettent chacune des échanges dans les deux sens.

**Réponses complémentaires :**

1. Non. Après ouverture du canal, le serveur peut envoyer les nouvelles données sans attendre une nouvelle requête HTTP d’Alex pour chaque message.
2. Deux : une par navigateur dans ce scénario.
3. Non. Le code serveur définit les destinataires ; S4 construira la diffusion et S7 la limitera au salon actif.
4. Non, le handshake initial vient toujours du client

**Validation :** les deux connexions sont identifiées, le serveur est sur le trajet, l’affichage est attribué au navigateur destinataire et l’apprenant explique l’absence de sondage périodique. Une inversion « le serveur modifie directement le DOM d’Alex » doit être corrigée.

## 3. Vérification de l’environnement

La réponse HTTP `Backend prêt — séquence 1. Point WebSocket : /chat` et l’interface sur le port 5173 prouvent le démarrage des deux services. Elles ne prouvent pas que le chat échange déjà des messages.

Le backend possède un point de connexion préparé. Le frontend ne l’utilise pas encore : le code client sera ajouté en S2. Les trois bulles actuelles sont des données locales de démonstration.
