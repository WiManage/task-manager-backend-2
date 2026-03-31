# Résolution des correctifs — Task Manager

## 1. Crash MongoDB au démarrage

Fichier `.env` manquant à la racine du projet.

**Correction :** Créer le fichier `.env` avec la variable suivante :

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority
```

---

## 2. Erreur 403 Forbidden

Le guard `IpGuard` comparait une seule IP hardcodée (`192.168.1.255`), bloquant toutes les autres requêtes.

**Correction :** Création de `src/shared/constants/allowed-ips.ts` avec un tableau d'IPs autorisées :

```ts
export const ALLOWED_IPS = ["127.0.0.1", "::1", "192.168.1.1"];
```

Le guard utilise désormais `ALLOWED_IPS.includes(request.ip)`.

> ⚠️ **Solution temporaire** : la liste des IPs est hardcodée dans un fichier de constantes. Pour une solution robuste, les IPs autorisées devraient être stockées en base de données ou en cache (ex: Redis) afin de pouvoir les gérer dynamiquement sans redéploiement.

---

## 3. Drag-and-drop vers "Archivé" impossible

Une condition dans le composant Angular bloquait explicitement le drop sur la colonne `ARCHIVED`.

**Correction :** Commenter la condition dans le fichier de gestion du drag-and-drop :

```ts
// if (targetStatus === 'ARCHIVED') {
//   return;
// }
```

---

## 4. Silent failures sur commentaires

Deux problèmes combinés :

- L'identifiant utilisé était `task.id` au lieu de `task._id` (MongoDB expose `_id`)
- Aucun retour visuel en cas d'erreur

**Correction :**

```ts
// ❌ Avant
this.taskService.createComment(task.id, this.newCommentText);

// ✅ Après
this.taskService.createComment(task._id, this.newCommentText);
```

Ajout d'un dialogue d'erreur dans le `handleRequest` pour afficher un message à l'utilisateur en cas d'échec.

---

## 5. Erreur d'injection de dépendance

`CommentsService` n'était pas déclaré dans les `providers` du module.

**Correction :** Ajout de `CommentsService` dans `providers` de `CommentsModule` :

```ts
@Module({
  providers: [CommentsService],
  ...
})
export class CommentsModule {}
```
