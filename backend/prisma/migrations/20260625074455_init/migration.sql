-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userPseudoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inputText" TEXT NOT NULL,
    "inputMode" TEXT NOT NULL DEFAULT 'text',
    "predictedChallenge" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "reasoning" TEXT,
    "needsClarification" BOOLEAN NOT NULL DEFAULT false,
    "interventionId" TEXT NOT NULL,
    "interventionText" TEXT NOT NULL,
    "feedback" TEXT,
    "feedbackAt" DATETIME,
    "ctxHourOfDay" INTEGER,
    "ctxCalendarLoad" TEXT,
    "ctxCyclePhase" TEXT
);

-- CreateIndex
CREATE INDEX "Interaction_userPseudoId_idx" ON "Interaction"("userPseudoId");

-- CreateIndex
CREATE INDEX "Interaction_predictedChallenge_idx" ON "Interaction"("predictedChallenge");

-- CreateIndex
CREATE INDEX "Interaction_createdAt_idx" ON "Interaction"("createdAt");
