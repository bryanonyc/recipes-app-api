/*
  Warnings:

  - You are about to drop the `_RecipeToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recipe_id` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RecipeToTag" DROP CONSTRAINT "_RecipeToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeToTag" DROP CONSTRAINT "_RecipeToTag_B_fkey";

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "recipe_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_RecipeToTag";

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
