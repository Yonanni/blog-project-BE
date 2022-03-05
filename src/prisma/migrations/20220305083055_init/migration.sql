-- AlterTable
ALTER TABLE `article` ADD COLUMN `first_paragraph` VARCHAR(191) NULL,
    ADD COLUMN `free` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `cover` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `author` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatar` VARCHAR(191) NULL;
