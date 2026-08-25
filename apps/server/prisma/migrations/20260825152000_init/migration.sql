-- CreateTable
CREATE TABLE "World" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TileState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AgentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Appearance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "importance" REAL NOT NULL,
    "text" TEXT NOT NULL,
    "metadata" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Belief" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "updatedTick" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Motivation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "strength" REAL NOT NULL,
    "text" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdTick" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "participants" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "speakerId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "tick" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ObjectRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StructureRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EventRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ActionRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NamedConceptRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ReflectionRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "trigger" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ExperimentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "outcome" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ExperienceDataset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "context" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "worldResult" TEXT NOT NULL,
    "reflection" TEXT,
    "laterOutcome" TEXT
);

-- CreateTable
CREATE TABLE "SimulationSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "parentSnapshotId" TEXT,
    "tick" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "TileState_worldId_type_idx" ON "TileState"("worldId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "TileState_worldId_x_y_key" ON "TileState"("worldId", "x", "y");

-- CreateIndex
CREATE INDEX "AgentRecord_worldId_name_idx" ON "AgentRecord"("worldId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Appearance_agentId_key" ON "Appearance"("agentId");

-- CreateIndex
CREATE INDEX "Memory_agentId_type_tick_idx" ON "Memory"("agentId", "type", "tick");

-- CreateIndex
CREATE INDEX "Belief_agentId_status_idx" ON "Belief"("agentId", "status");

-- CreateIndex
CREATE INDEX "Skill_agentId_name_idx" ON "Skill"("agentId", "name");

-- CreateIndex
CREATE INDEX "Motivation_agentId_strength_idx" ON "Motivation"("agentId", "strength");

-- CreateIndex
CREATE INDEX "Conversation_worldId_tick_idx" ON "Conversation"("worldId", "tick");

-- CreateIndex
CREATE INDEX "Message_conversationId_tick_idx" ON "Message"("conversationId", "tick");

-- CreateIndex
CREATE INDEX "Inventory_agentId_kind_idx" ON "Inventory"("agentId", "kind");

-- CreateIndex
CREATE INDEX "ObjectRecord_worldId_kind_idx" ON "ObjectRecord"("worldId", "kind");

-- CreateIndex
CREATE INDEX "StructureRecord_worldId_creatorId_idx" ON "StructureRecord"("worldId", "creatorId");

-- CreateIndex
CREATE INDEX "EventRecord_worldId_category_tick_idx" ON "EventRecord"("worldId", "category", "tick");

-- CreateIndex
CREATE INDEX "ActionRecord_agentId_tick_idx" ON "ActionRecord"("agentId", "tick");

-- CreateIndex
CREATE INDEX "NamedConceptRecord_worldId_name_idx" ON "NamedConceptRecord"("worldId", "name");

-- CreateIndex
CREATE INDEX "ReflectionRecord_agentId_tick_idx" ON "ReflectionRecord"("agentId", "tick");

-- CreateIndex
CREATE INDEX "ExperimentRecord_worldId_outcome_idx" ON "ExperimentRecord"("worldId", "outcome");

-- CreateIndex
CREATE INDEX "ExperienceDataset_worldId_agentId_tick_idx" ON "ExperienceDataset"("worldId", "agentId", "tick");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationSettings_worldId_key" ON "SimulationSettings"("worldId");

-- CreateIndex
CREATE INDEX "Snapshot_worldId_createdAt_idx" ON "Snapshot"("worldId", "createdAt");
