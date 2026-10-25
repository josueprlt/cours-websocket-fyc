# Recette de S3 — Envoyer, recevoir, continuer après une erreur

**15 minutes :** 9 min de tests, 4 min de comparaison avec le corrigé, 2 min de bilan. Terminez les sept TODO avant cette recette. Ouvrez le panneau Réseau de la connexion `:3000/chat` et la section Atelier de l’interface.

## Jeu de données et matrice à renseigner

| Test | Données / manipulation | Attendu | Observation / acquis ? |
|---|---|---|---|
| T1 · Aller-retour | Attendre la connexion automatique, envoyer `Bonjour le salon` | Une demande `chat:send`, une réponse `chat:message` avec id et date serveur ; une seule ligne ajoutée sans rechargement | |
| T2 · Plusieurs envois | Envoyer successivement `Un`, `Deux`, `Un` | Trois lignes supplémentaires dans cet ordre, trois identifiants distincts malgré le texte répété | |
| T3 · Texte et espaces | Envoyer `  Salut 👋 — café  ` puis `<b>Bonjour</b>` | Extrémités nettoyées, accents/emoji conservés ; balises visibles comme texte | |
| T4 · Entrée vide | Envoyer trois espaces | Diagnostic local, aucune trame de chat sortante, aucune ligne ajoutée, brouillon conservé | |
| T5 · Hors connexion | Dans Atelier, Déconnecter ; revenir dans général et observer le bouton puis faire le contrôle de fonction décrit dans TP A | Bouton désactivé ; même appelé directement, le gestionnaire refuse l’envoi sans vider le brouillon | |
| T6 · Réponses invalides | Reconnecter, noter le nombre de lignes ; cliquer chacun des cinq boutons Atelier | Chaque cas affiche un diagnostic ; nombre de lignes inchangé, connexion toujours ouverte | |
| T7 · Reprise du travail | Après T6, envoyer `Après l’erreur` | Réponse réelle affichée une seule fois, anciennes lignes conservées | |

Le jeu de réponses brutes est fourni dans `frontend/src/responseFixtures.js` dans les deux projets : JSON tronqué, champs manquants, contenu numérique, date invalide et `null`. Les boutons n’injectent aucune réponse valide et n’ajoutent donc pas de faux messages à votre preuve réseau.

### Vérifications complémentaires si vous avancez vite

- **Limite :** coller 500 lettres `a`, puis essayer une lettre supplémentaire. Le champ empêche le dépassement ; le serveur applique aussi sa limite. Pour vérifier le serveur indépendamment du champ, utilisez le client console ci-dessous.
- **Deux onglets :** ouvrir A et B et attendre leur connexion automatique, envoyer depuis A. Seul A reçoit une nouvelle ligne. La diffusion sera construite en S4.
- **Reconnexion manuelle :** déconnecter puis reconnecter trois fois, envoyer une fois : une seule réponse ajoutée. Cela contrôle le retrait des anciens écouteurs.

Client temporaire dans la console du navigateur pour vérifier le refus backend (facultatif) :

```js
const probe = new WebSocket('ws://127.0.0.1:3000/chat');
probe.addEventListener('message', (event) => {
  console.log(JSON.parse(event.data)); // attendu : chat:error
  probe.close(1000, 'Test terminé');
});
probe.addEventListener('open', () => {
  probe.send(JSON.stringify({ event: 'chat:send', data: { content: 'a'.repeat(501) } }));
});
```

Ce client a sa propre connexion : sa réponse ne doit pas apparaître dans la liste de l’application. Remplacer le contenu par `42` permet de vérifier le contrôle du type.

## Comprendre un écart

| Observation | À vérifier |
|---|---|
| La page recharge | `@submit.prevent` a-t-il été conservé ? |
| Trame sortante avec `[object Object]` | Avez-vous sérialisé l’objet ? |
| Aucune réponse à une demande | Nom exact `chat:send`, enveloppe `data`, retour du backend et redémarrage |
| Le serveur répond mais rien ne s’affiche | Décodage de `event.data`, validation, ajout de `response.data` |
| Une réponse apparaît deux fois | Ajout local à l’envoi ou écouteur supplémentaire |
| Les anciennes lignes disparaissent après T6 | Le `catch` ne doit modifier que le diagnostic |
| Une deuxième fenêtre reste vide | Résultat normal en S3 : réponse uniquement à l’émetteur |

## Bilan et remise

Répondre brièvement :

1. Pourquoi `send()` ne suffit-il pas à prouver l’aller-retour ?
2. Quelle différence entre `message` et `chat:message` ?
3. Pourquoi `JSON.parse` et `isChatMessage` sont-ils tous deux nécessaires ?
4. Qui attribue l’identifiant et la date, et pourquoi ?

Remettre les deux fichiers complétés, la matrice T1–T7 et une capture ou un relevé comportant la demande JSON, la réponse JSON et son entrée visible. Les injections locales ne remplacent pas T1.

**Critère de passage :** aller-retour réel visible sans rechargement, plusieurs envois distincts et poursuite normale après une réponse mal formée. La conservation après rechargement et l’échange entre utilisateurs ne sont pas évalués.
