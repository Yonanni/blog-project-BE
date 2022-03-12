/*
  Warnings:

  - Made the column `comment` on table `comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `comment` MODIFY `comment` VARCHAR(191) NOT NULL;
