/*
  Warnings:

  - A unique constraint covering the columns `[courseId,topic]` on the table `weak_topics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "weak_topics_courseId_topic_key" ON "weak_topics"("courseId", "topic");
