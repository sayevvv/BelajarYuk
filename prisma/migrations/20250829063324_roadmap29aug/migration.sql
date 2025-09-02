-- CreateTable
CREATE TABLE "public"."RoadmapRating" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "versionId" TEXT,
    "userId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "review" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoadmapAggregates" (
    "roadmapId" TEXT NOT NULL,
    "versionId" TEXT,
    "avgStars" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingsCount" INTEGER NOT NULL DEFAULT 0,
    "h1" INTEGER NOT NULL DEFAULT 0,
    "h2" INTEGER NOT NULL DEFAULT 0,
    "h3" INTEGER NOT NULL DEFAULT 0,
    "h4" INTEGER NOT NULL DEFAULT 0,
    "h5" INTEGER NOT NULL DEFAULT 0,
    "savesCount" INTEGER NOT NULL DEFAULT 0,
    "forksCount" INTEGER NOT NULL DEFAULT 0,
    "wilsonScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bayesianScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapAggregates_pkey" PRIMARY KEY ("roadmapId")
);

-- CreateTable
CREATE TABLE "public"."RoadmapSave" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapSave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoadmapMetricsDaily" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViewers" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "uniqueSavers" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RoadmapMetricsDaily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoadmapRating_roadmapId_versionId_idx" ON "public"."RoadmapRating"("roadmapId", "versionId");

-- CreateIndex
CREATE INDEX "RoadmapRating_userId_idx" ON "public"."RoadmapRating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapRating_roadmapId_versionId_userId_key" ON "public"."RoadmapRating"("roadmapId", "versionId", "userId");

-- CreateIndex
CREATE INDEX "RoadmapSave_roadmapId_idx" ON "public"."RoadmapSave"("roadmapId");

-- CreateIndex
CREATE INDEX "RoadmapSave_userId_idx" ON "public"."RoadmapSave"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapSave_roadmapId_userId_key" ON "public"."RoadmapSave"("roadmapId", "userId");

-- CreateIndex
CREATE INDEX "RoadmapMetricsDaily_roadmapId_idx" ON "public"."RoadmapMetricsDaily"("roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapMetricsDaily_roadmapId_date_key" ON "public"."RoadmapMetricsDaily"("roadmapId", "date");
