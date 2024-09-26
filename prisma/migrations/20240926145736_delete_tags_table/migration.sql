/*
  Warnings:

  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_recipe_id_fkey";

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "tags" TEXT;

-- DropTable
DROP TABLE "tags";
