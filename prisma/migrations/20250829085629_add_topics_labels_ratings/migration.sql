-- CreateTable
CREATE TABLE "public"."Topic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "aliases" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoadmapTopic" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "versionId" TEXT,
    "topicId" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'ai',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "public"."Topic"("slug");

-- CreateIndex
CREATE INDEX "Topic_parentId_idx" ON "public"."Topic"("parentId");

-- CreateIndex
CREATE INDEX "RoadmapTopic_roadmapId_idx" ON "public"."RoadmapTopic"("roadmapId");

-- CreateIndex
CREATE INDEX "RoadmapTopic_topicId_idx" ON "public"."RoadmapTopic"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapTopic_roadmapId_versionId_topicId_key" ON "public"."RoadmapTopic"("roadmapId", "versionId", "topicId");

-- AddForeignKey
ALTER TABLE "public"."RoadmapTopic" ADD CONSTRAINT "RoadmapTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
