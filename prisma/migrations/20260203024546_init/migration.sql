-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "summary" TEXT NOT NULL,
    "keyPoints" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);
