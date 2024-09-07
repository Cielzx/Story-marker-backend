-- CreateTable
CREATE TABLE "icons" (
    "id" TEXT NOT NULL,
    "icon_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "icons_pkey" PRIMARY KEY ("id")
);
