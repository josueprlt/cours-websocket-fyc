# S3 — Envoyer et recevoir les messages du chat

Séquence de **90 minutes**, dans la continuité de `sequence-2` : Vue 3, API WebSocket native, NestJS avec `WsAdapter`, Node 24.x. La branche `sequence-3` remplace les supports S2 par ceux de S3 ; les supports précédents restent sur `sequence-2`.

## Parcours

1. [Cours et contrat JSON](cours.md) — 15 min, capsule comprise.
2. [TP guidé](tp-guide.md) — envoi (20 min), serveur avec capsule (20 min), réception (20 min).
3. [Fiche de référence](fiche-reference.md) — aide pendant le TP.
4. [Tests et validation](tests-et-validation.md) — 15 min avec correction et bilan.
5. [Corrigé commenté](corriges.md) — à consulter après l’essai.

[Scripts et transcriptions vidéo](videos.md) : deux capsules de 4 et 5 minutes prêtes à enregistrer, sans fichiers vidéo produits.

## Projets

- [Projet apprenant](projet/README.md) : connexion S2 fonctionnelle, interface et garde-fous fournis, sept TODO.
- [Projet corrigé](projet-corrige/README.md) : solution complète avec tests automatisés.

**Validation :** un message fait un aller-retour réseau, reçoit un identifiant et une date serveur et apparaît sans rechargement. Plusieurs envois fonctionnent ; une réponse mal formée n’interrompt pas la suite. Le binaire est mentionné sans exercice obligatoire. La diffusion reste pour S4.
