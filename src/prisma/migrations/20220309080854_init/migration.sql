/*
  Warnings:

  - You are about to drop the column `category` on the `article` table. All the data in the column will be lost.
  - You are about to drop the `author` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `about` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publication_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `article` DROP COLUMN `category`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `about` VARCHAR(191) NOT NULL,
    ADD COLUMN `publication_category` VARCHAR(191) NULL,
    ADD COLUMN `publication_name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `author`;

-- CreateTable
CREATE TABLE `Subscriber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubscribingTo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subscriber` ADD CONSTRAINT `Subscriber_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscribingTo` ADD CONSTRAINT `SubscribingTo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
