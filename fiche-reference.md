# Fiche de référence — Le cycle de vie dans le TP S2

Cette fiche sert d’aide pendant le code. Les explications détaillées sont dans le cours ; elle n’est pas un second chapitre à lire intégralement.

## Où placer chaque action ?

| Moment | Action du TP | Piège à éviter |
|---|---|---|
| Construction | Créer `new WebSocket(url.value)` et recopier `current.readyState` | Afficher un succès trop tôt |
| `open` | Copier l’état et annoncer l’ouverture | Confondre objet créé et connexion ouverte |
| `error` | Afficher un diagnostic prudent | Inventer un état natif `ERROR` ou une cause précise |
| Clic Déconnecter | `close(1000, raison)` puis copie d’état | Forcer `CLOSED` avant sa confirmation |
| `close` | Copier l’état et relever code/raison/`wasClean` | Considérer toute fermeture comme une erreur |
| Nouveau clic après fermeture | Créer un nouvel objet | Vouloir rouvrir l’objet fermé |

## Aide syntaxique

```js
// Une ref Vue s’écrit avec .value dans le script.
readyState.value = current.readyState;

// Un écouteur reçoit l’événement en argument.
current.addEventListener('close', (event) => {
  console.log(event.code, event.reason, event.wasClean);
});
```

Dans le projet, les écouteurs sont déjà enregistrés : **compléter leur fonction, sans ajouter une deuxième inscription**.

## Lecture rapide

- 0 : tentative en cours ; 1 : ouverte ; 2 : fermeture en cours ; 3 : fermée.
- `null` : choix d’interface avant toute tentative, sans équivalent natif.
- 1000 : fermeture normale ; 1006 : fermeture anormale rapportée localement, pas un code à envoyer.
- `reason` vide : raison non fournie, pas raison devinée.
- `wasClean` : propreté de la fermeture, pas lecture d’un message de chat.

## Ce qui est fourni

Le garde-fou contre les ouvertures concurrentes, le câblage des boutons, le journal, la suppression des écouteurs précédents et le nettoyage au démontage. Le nettoyage est branché sur le cycle de vie Vue ; sa présence évite de conserver inutilement une connexion quand le composant disparaît. [Cycle de vie Vue](https://vuejs.org/api/composition-api-lifecycle.html#onbeforeunmount).

## En cas de panne

1. Vérifier l’adresse exacte : `ws://127.0.0.1:3000/chat`.
2. Vérifier que le backend tourne et répond sur `/health`.
3. Lire le journal et le réseau ; noter les observations avant de conclure.
4. Corriger puis refaire une tentative manuelle.

Les autres fonctionnalités du parcours restent pour les séquences suivantes : `message` et `send()` en S3, diffusion en S4, reprise automatique en S5.
