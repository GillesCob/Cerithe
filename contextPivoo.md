# Programme préparation — Entretien technique Piivo CTO

---

## Contexte

Entretien d'1h avec le CTO. Plus technique que le premier échange avec le CEO.
Objectif : montrer que tu comprends vraiment les concepts, pas juste la démarche.
Base déjà solide : Labelr construit, article publié, parallèles Express/ASP.NET vus ensemble.

---

## Ce qui peut sortir en entretien technique

### Niveau 1 — Très probable (concepts de base)

**Vue.js**

- Différence entre `ref()` et `reactive()`
- Comment fonctionne `computed()` vs `watch()`
- C'est quoi la Composition API vs Options API
- Comment Vue gère la réactivité

**ASP.NET Core**

- C'est quoi l'injection de dépendances et pourquoi
- Comment fonctionne le pipeline de middleware
- Différence entre `AddScoped`, `AddSingleton`, `AddTransient`
- C'est quoi un DTO et pourquoi ne pas exposer les entités directement

**Entity Framework**

- Comment fonctionne le Change Tracking
- Différence avec Prisma
- C'est quoi une migration et comment ça marche
- Eager loading vs Lazy loading

**C# général**

- C'est quoi un `record`
- Différence `string` vs `string?`
- C'est quoi LINQ et à quoi ça sert
- Async/await en C# vs TypeScript

### Niveau 2 — Possible (concepts intermédiaires)

- Les interfaces en C# et pourquoi les préfixer par I
- C'est quoi le pattern Repository et pourquoi
- Comment fonctionne l'auth JWT en ASP.NET Core
- C'est quoi `[ApiController]` et ce qu'il fait automatiquement
- Soft delete et HasQueryFilter EF Core
- Azure : quels services pour quel usage

### Niveau 3 — Moins probable sur un premier entretien technique

- LINQ avancé
- Generics C#
- Tests unitaires avec xUnit et mocks
- Azure DevOps et CI/CD
- Performance et optimisation

---

## Programme de sessions

### Session 1 — Vue.js en profondeur

- `ref()` vs `reactive()` : quand utiliser l'un ou l'autre
- `computed()` vs `watch()` vs `watchEffect()`
- La réactivité Vue expliquée simplement
- Composition API vs Options API : pourquoi Composition API est le standard moderne
- Directives Vue : `v-if`, `v-for`, `v-model`, `v-bind`, `v-on`

### Session 2 — ASP.NET Core et C# en profondeur

- Pipeline middleware : ordre et pourquoi il est critique
- IoC container : AddScoped/Singleton/Transient avec des cas concrets
- Les attributs C# : `[Authorize]`, `[HttpGet]`, `[ApiController]`, `[FromBody]`
- LINQ : les méthodes les plus courantes avec des exemples
- Records C# et pourquoi c'est parfait pour les DTOs

### Session 3 — Entity Framework en profondeur

- Change Tracking : comment EF surveille les objets
- Eager loading (`Include`) vs Lazy loading
- HasQueryFilter : le soft delete global
- Migrations : comment ça marche sous le capot
- DbContext et le pattern Unit of Work

### Session 4 — Exercices pratiques

- Lire et expliquer le code de Labelr section par section
- Simuler des questions d'entretien : je réponds, tu corriges
- Exercice : écrire un endpoint simple en C# de tête
- Exercice : écrire un composant Vue simple de tête

### Session 5 — Préparation questions/réponses

- Simulation d'entretien complet 1h
- Questions pièges classiques d'un CTO
- Tes questions à poser au CTO

---

## Ce que tu peux déjà dire avec confiance

- L'architecture en couches Controller/Service/Repository et pourquoi
- Les parallèles avec ta stack Node/Express
- L'injection de dépendances et l'IoC : concept compris
- Entity Framework vs Prisma : big picture
- Vue.js vs React : parallèles et différences de syntaxe
- JWT en ASP.NET Core vs Express : même concept

## Ce qu'il faut absolument travailler

- `ref()` vs `reactive()` en Vue : flou pour toi
- LINQ : pas encore pratiqué
- Change Tracking EF : compris mais pas ancré
- Les directives Vue : jamais pratiquées
- Écrire du C# de tête : jamais fait

---

## Règle pour les sessions

Même méthode que pour Cerithe : tu essaies d'abord, je corrige.
On fait des parallèles systématiques avec ce que tu connais déjà.
On simule des vraies questions d'entretien à la fin de chaque session.
