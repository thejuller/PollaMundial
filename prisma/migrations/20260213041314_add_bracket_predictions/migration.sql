-- CreateTable
CREATE TABLE "BracketPrediction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "homeTeamId" INTEGER,
    "awayTeamId" INTEGER,
    "homeTeamName" TEXT,
    "awayTeamName" TEXT,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "actualMatchId" INTEGER,
    "points" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BracketPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BracketPrediction_userId_stage_position_key" ON "BracketPrediction"("userId", "stage", "position");
