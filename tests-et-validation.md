# Recette S4 — Trois clients, une copie par fenêtre

**10 minutes dans l’étape Nettoyer et vérifier**, après les TODO 1–6. Les 10 dernières minutes de la séance servent ensuite à la correction et au bilan. Lancez un seul backend et un seul frontend, puis trois fenêtres A, B, C. Attendez leur état Connecté et un registre de taille 3. Ne laissez pas de quatrième onglet de test ouvert.

Dans chaque fenêtre, ouvrez Réseau → WebSocket → `:3000/chat` → Messages. Le frontend utilise une connexion par page. L’accueil privé `chat:welcome` à chaque ouverture ne crée pas de bulle : comptez uniquement les trames `chat:message` pour les diffusions. Les messages du canal Vite et les simulations de réponses invalides ne comptent pas comme messages de chat.

## Matrice à remplir

Comptez les **ajouts** par rapport à l’état avant chaque ligne. Comparez les UUID complets dans les trames. Attendez le résultat d’une ligne avant de commencer la suivante.

| Test | Action | A : ajout attendu | B : ajout attendu | C : ajout attendu | Autre preuve attendue | Observé / acquis ? |
|---|---|---:|---:|---:|---|---|
| T1 | A envoie `A-1` | +1 | +1 | +1 | Une trame reçue par fenêtre ; mêmes id, auteur et date | |
| T2 | B envoie `B-1`, puis C envoie `C-1` | +2 | +2 | +2 | Deux id distincts ; auteurs B et C distincts de A | |
| T3 | A envoie deux fois `Encore` | +2 | +2 | +2 | Deux id distincts, même senderId ; ne pas supprimer le second texte | |
| T4 | C clique Déconnecter ; attendre sa fermeture ; A envoie `Sans C` | +1 | +1 | 0 | Registre 3 → 2 ; aucun envoi vers C | |
| T5 | C clique Connecter ; attend Connecté ; envoie `C revient` | +1 | +1 | +1 | Registre 2 → 3 ; nouveau senderId pour C ; aucun rejeu de `Sans C` | |
| T6 | Dans C, effectuer encore deux cycles Déconnecter/Connecter en attendant les états, puis B envoie `Après les cycles` | +1 | +1 | +1 | Registre alterne 2/3 sans croissance ; une trame et un ajout par fenêtre | |
| T7 | Fermer les trois fenêtres | — | — | — | Après observation des fermetures, registre 3 → 2 → 1 → 0 | |

T4 utilise le bouton Déconnecter pour conserver visuellement l’historique de C. T7 ferme réellement les fenêtres. Après T1–T6, si les listes étaient initialement vides et si aucun autre message n’a été envoyé, A et B ont 8 entrées ; C en a 7. Un rechargement efface sa liste, une simple déconnexion manuelle la conserve.

## Relevé du diagnostic obligatoire

| État de l’exercice TODO 6 | Trames entrantes pour un envoi | Appels à receiveMessage | Nouvelles entrées |
|---|---:|---:|---:|
| Avec la fonction anonyme ajoutée | 1 | 2 | 2 |
| Après retrait et rechargement complet | 1 | 1 | 1 |

Joignez une courte explication de la cause et de la correction. Un avertissement de clés Vue dupliquées peut accompagner le défaut : ce n’est pas la liste Vue qui doit supprimer les doublons, c’est l’enregistrement des écouteurs qui doit être corrigé.

## Aide au diagnostic

| Symptôme | Piste |
|---|---|
| Aucun message n’arrive | Vérifier `set`, `get(sender)`, la boucle, `OPEN`, et le redémarrage backend |
| Les autres reçoivent mais l’émetteur reste vide | Retirer une exclusion de `sender` ; conserver l’affichage seulement à réception |
| Deux trames uniquement chez l’émetteur | Retirer le retour `chat:message` après la diffusion |
| Une trame, deux appels du gestionnaire | Chercher le deuxième callback `message` |
| Même envoi mais id différents selon la fenêtre | Construire le message avant la boucle |
| Une trame, aucun affichage | Vérifier le contrat S4, notamment `senderId` et le diagnostic frontend |
| Le compteur grandit après les reconnexions | Vérifier `delete(client)` dans le hook de déconnexion |
| Nouveau client sans anciens messages | Normal : aucune persistance ni rediffusion de l’historique |

## Vérifications complémentaires, hors chronométrage obligatoire

Le corrigé teste automatiquement le refus privé : un contenu vide, numérique ou trop long produit `chat:error` seulement pour le demandeur. Vous pouvez aussi vérifier les espaces, les accents et les balises affichées comme texte, acquis de S3. Aucun test d’accumulation de données n’est requis.

Depuis `projet-corrige` : `npm ci`, puis `npm test` (backend sur port éphémère, aucun serveur manuel nécessaire) et `npm run build` (compilation des deux workspaces). Ces tests automatisés complètent la recette ; ils ne remplacent pas l’observation des trois interfaces par l’apprenant.

## Bilan et remise · pendant les 10 dernières minutes

1. Racontez le trajet de `B-1`, du formulaire de B aux listes A, B et C.
2. Distinguez `id` et `senderId`. Que change la reconnexion de C ?
3. Pourquoi la garde `OPEN` ne remplace-t-elle pas `delete` ?
4. Comment distinguer le double écouteur d’un retour serveur en trop ?
5. Pourquoi une valeur nulle de `bufferedAmount` ne prouve-t-elle pas l’affichage distant ?

Remettez les fichiers indiqués dans le TP, la matrice, les preuves réseau et de nettoyage, et le relevé du diagnostic. **Validation :** chacun des trois clients peut écrire ; chaque envoi accepté apparaît une seule fois chez tous les clients ouverts, y compris l’émetteur ; les connexions fermées quittent le registre ; une reconnexion manuelle n’ajoute pas de traitement en double. L’application ne promet pas une livraison « exactement une fois » après panne ou retransmission : la recette valide ce parcours connecté et maîtrisé.

## Vérification de l’interface personnalisée

Dans A, cliquez sur « Vous » en bas à gauche et saisissez Alice ; dans B, saisissez Bob. Envoyez depuis chaque fenêtre : son propre message apparaît à gauche en vert avec « (vous) », celui de l’autre à droite en gris. Les noms apparaissent au-dessus des bulles. Changez ensuite le nom de B en Alice : ses messages restent ceux d’un autre client dans A. Les nouveaux messages portent le nouveau nom, les précédents gardent leur nom d’origine. Vérifiez aussi que le champ est accessible au clavier, qu’Entrée quitte l’édition et qu’un nom vide redevient « Vous » en quittant le champ.
