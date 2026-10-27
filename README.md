# S4 — Diffuser les messages à plusieurs utilisateurs

Séquence de **90 minutes**, dans la continuité de S3 : Vue 3, API WebSocket native, NestJS avec `WsAdapter` et bibliothèque `ws`, Node 24.x. Sur la branche `sequence-4`, ces supports remplacent ceux de S3 ; le point de départ fonctionnel de S3 est intégré au projet apprenant.

**Objectif :** passer d’un échange individuel à une conversation collective. **Validation :** trois clients discutent ; chaque message apparaît une seule fois par fenêtre et les connexions fermées sont retirées du registre.

| Étape | Durée | Support |
|---|---:|---|
| Comprendre la diffusion | 15 min | [Cours illustré](cours.md), [capsule 1](videos.md#capsule-1--du-retour-individuel-à-la-diffusion--4-min) |
| Enregistrer les clients connectés | 20 min | [TP A](tp-guide.md#a--enregistrer-les-clients-connectés--20-min), TODO 1–2 |
| Diffuser les messages | 25 min | [TP B](tp-guide.md#b--diffuser-les-messages--25-min), capsule 2 et TODO 3–4 |
| Nettoyer et vérifier | 20 min | [TP C](tp-guide.md#c--nettoyer-et-vérifier--20-min), TODO 5–6 et [matrice à trois clients](tests-et-validation.md) |
| Corriger et expliquer | 10 min | [Corrigé](corriges.md), [fiche de synthèse](fiche-reference.md) et bilan |
| **Total** | **90 min** | Vidéos, installation et vérifications comprises |

## Contenu livré

- [Projet apprenant](projet/README.md) : client S3 fonctionnel adapté au contrat S4 ; registre et diffusion à compléter, diagnostic guidé d’un double écouteur.
- [Projet corrigé](projet-corrige/README.md) : solution complète et tests automatisés avec trois connexions réelles.
- [Scripts et transcriptions vidéo](videos.md) : une explication de 4 minutes et un live coding de 5 minutes, prêts à enregistrer. Aucun fichier vidéo enregistré n’est inclus ; les transcriptions permettent de suivre le cours en autonomie.

`bufferedAmount` figure uniquement dans un encadré explicatif. Aucun laboratoire d’accumulation n’est demandé ni évalué. Les reconnexions restent manuelles ; ni authentification, ni stockage, ni reprise automatique ne sont requis.
