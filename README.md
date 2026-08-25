# NOVUS

NOVUS is a serious vertical-slice prototype of a persistent autonomous civilization simulation. The browser is an observer, not a controller. Ten inhabitants wake in an empty procedural world and continue living when no browser is open: they move, perceive locally, gather, talk, experiment, build primitive arrangements, remember outcomes, form beliefs, consolidate lessons, and develop distinct life histories.

The prototype deliberately supplies physics and capabilities rather than a civilization script. There are no professions, jobs, governments, currencies, technology trees, quests, or player work orders. Higher-level meaning exists only when an inhabitant creates or communicates it.

## Run locally

Requirements: Node.js 22 or newer and npm.

```bash
npm install
cp apps/server/.env.example apps/server/.env
npm run db:migrate
npm run dev
```

Open:

- Observer: http://localhost:3000
- World service: http://localhost:3001
- Health check: http://localhost:3001/health

The first start generates the Prisma client and creates the local SQLite database. No AI key is needed; Mock AI is the default and is intentionally described as a systems-testing intelligence rather than a substitute for a language model.

Useful commands:

```bash
npm test
npm run build
npm run db:generate
npm run db:migrate
```

## What is implemented

- A deterministic 100×100 world with a winding river, deep and shallow water, sand banks, fertile soil, open grassland, rock formations, forest patches, bushes, berries, loose stones, and fallen branches.
- Ten default inhabitants, configurable from 1–25 through `NOVUS_POPULATION`, with natural-language temperaments, distinct appearances, biographies, inventories, questions, motivations, memories, beliefs, skills, relationships, reflections, conversations, action histories, and chronological life records.
- Server-authoritative deterministic ticks independent of render FPS, plus pause and 1×/2×/5×/10× speed controls.
- A fast movement/action loop, medium decision loop, and slow reflection/consolidation loop.
- Local perception with a 12-tile radius. No agent receives global world state.
- A* pathfinding that avoids deep water, rock terrain, trees, and completed blocking walls.
- Natural physical sensations for hunger, thirst, fatigue, temperature, weather, and health. The cognitive layer never receives raw UI statistics as its lived sensation.
- Working, episodic, semantic, and social memory with relevance scoring for keywords, recency, importance, participants, and location.
- Personal beliefs with evidence, confidence, and `KNOWN`, `LIKELY`, `UNCERTAIN`, `HYPOTHESIS`, `DISPUTED`, and `DISPROVED` states.
- Contextual curiosity and repetition detection that resurfaces unresolved questions rather than assigning random jobs.
- Actor/critic review for meaningful decisions, concise observer-facing thought summaries, reflection after important outcomes, memory consolidation, skill extraction, and identity evolution.
- Experimental material combinations with hidden physical tendencies and success, partial, failure, or unexpected outcomes.
- Primitive construction stored as physical descriptions and safe primitives, never executable AI code.
- Physical knowledge transfer through nearby speech. Heard beliefs arrive as uncertain testimony, not global unlocks.
- Named concepts with creator, first usage, description, and individual `knownBy` lists.
- Durable notes as world objects and research markers for interesting first events.
- A real experience dataset containing context, relevant memories, beliefs, decision, action, outcome, reflection, and room for later outcomes. It is intended for future offline SFT, LoRA, preference learning, or offline RL—not runtime weight rewriting.
- A PixiJS world renderer with chunked 16×16 terrain drawing, animated rain, day/night darkening, distinct inhabitants, vegetation, resources, structures, pan, wheel zoom, selection, and observer overlays.
- Event filters, inhabitant inspection, life history, research metrics, timelines, concepts, and a debug individuality diagnostic.
- Named snapshots and `parentSnapshotId` in the data model and API, preparing future DAY 100 experiment branches.

## Architecture

```text
app/                         React observer UI (Vinext/Vite + Tailwind)
apps/server/                 Fastify, WebSocket, Prisma, SQLite
packages/shared/             transport-safe domain types
packages/world-generator/    deterministic procedural generation
packages/simulation-core/    ticks, actions, A*, consequences, world rules
packages/cognitive-core/     perception, retrieval, motivation, actor/critic
packages/learning-engine/    beliefs, skills, patterns, consolidation, dataset
packages/ai/                 provider abstraction and neutral prompt
```

`simulation-core`, `cognitive-core`, and `learning-engine` have no React or PixiJS dependency. The backend owns the world. The renderer can disappear without stopping it, which keeps the architecture open to a desktop client or a headless long-running server.

The browser receives live state over WebSocket and uses HTTP only for controls and snapshot operations. All actions are validated in the service. Agent descriptions are data; they cannot execute JavaScript, shell commands, database queries, paths, or source code.

## Cognitive cycle

At a decision boundary, NOVUS builds a local perception, retrieves relevant personal memory and beliefs, updates fluid motivations, checks novelty and repeated behavior, proposes an action, optionally critiques meaningful decisions, validates the structured action, applies physical consequences, records the observation, and runs learning/reflection when warranted.

Agents do not need to be productive. `WAIT`, wandering, observing, revisiting, resting, and abandoned plans are valid outcomes. Decisions are triggered after actions finish or by scheduled cognitive boundaries; no model is queried every simulation tick.

## Memory and personal knowledge

Memory retrieval ranks a bounded set by semantic keyword overlap, recency, importance, nearby participants, and location. This deliberately leaves a clean seam for embeddings later. Consolidation turns several working memories into a higher-level semantic pattern during slower processing. Relationships are stored as qualitative impressions plus remembered interactions, never a single friendship score.

If Nara discovers a technique, only Nara knows it. Another inhabitant may observe it or hear about it; testimony creates an uncertain belief and can be misunderstood or tested later. Named concepts likewise list the inhabitants who actually know them.

## AI providers

`packages/ai` defines:

- `AIProvider.generateDecision()`
- `AIProvider.generateReflection()`
- `AIProvider.generateMemoryConsolidation()`
- `MockAIProvider`
- `OpenAICompatibleProvider`

To configure an OpenAI-compatible server, add values to `apps/server/.env`:

```dotenv
AI_BASE_URL=https://example.com/v1
AI_API_KEY=your-server-side-key
AI_MODEL=your-model
```

Keys never enter browser code. Responses are parsed with a bounded Zod schema. Invalid output falls back to a safe `WAIT`; requests retry with exponential backoff. The neutral system prompt avoids priming institutions or familiar social structures. The current autonomous scheduler uses the deterministic cognitive core by default, while the provider layer is ready for asynchronous decision replacement in the next iteration.

## Persistence and snapshots

SQLite stores the authoritative serialized world through Prisma. The service saves periodically and again during a graceful shutdown. The Prisma schema also defines normalized tables for tiles, inhabitants, appearances, memories, beliefs, skills, motivations, conversations, messages, inventory, objects, structures, events, actions, concepts, reflections, experiments, experience records, settings, and snapshots so later versions can migrate hot query paths away from the aggregate snapshot. Indexes reflect the intended agent/tick, world/category, and snapshot-history queries.

Snapshot API:

```text
GET  /api/snapshots
POST /api/snapshots  { "name": "Day 100", "parentSnapshotId": null }
```

## Testing

The automated suite covers deterministic generation, population/world invariants, server-independent ticking, pathfinding, action boundary validation, and repetition detection. The build separately compiles the observer and the server. Persistence verification should compare `/health` ticks before and after a graceful service restart.

## Research use

The Research layer reports observations rather than scores: conversations, experiments, structures, regions visited, personal beliefs, active questions, concepts, important historical events, and Research Markers. Debug mode shows the selected inhabitant’s action, path, concise thought summary, retrieved memories, beliefs, AI status, dataset size, and a cross-inhabitant behavior-variation signal. Debug mode does not change simulation behavior.

## Prototype boundaries and roadmap

This is a strong first vertical slice, not a finished centuries-long civilization model. Aging, birth, death, inheritance, generations, roof fading, remote written communication, branch-comparison UI, embeddings, PostgreSQL migration, performance work for 25 simultaneous external-model agents, and offline training pipelines remain future work. The data model avoids global inherited knowledge and includes branch ancestry so those additions do not require redefining the core premise.

The next serious milestone is asynchronous external-model scheduling: inhabitants continue current actions while provider requests are pending, important events trigger decisions, token/latency accounting becomes durable, and later outcomes are attached to experience rows for offline evaluation.

The guiding test remains simple: are inhabitants following a game-design progression, or are they accumulating their own histories? NOVUS is built to prefer the latter.
