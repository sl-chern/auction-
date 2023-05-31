/*
  Warnings:

  - You are about to drop the `featurelist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isOptions` to the `Feature` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `featurelist` DROP FOREIGN KEY `FeatureList_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `featurelist` DROP FOREIGN KEY `FeatureList_featureId_fkey`;

-- DropForeignKey
ALTER TABLE `featurevalue` DROP FOREIGN KEY `FeatureValue_featureOptionId_fkey`;

-- AlterTable
ALTER TABLE `feature` ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `isOptions` BOOLEAN NOT NULL,
    ADD COLUMN `unit` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `featurevalue` ADD COLUMN `value` DECIMAL(12, 3) NULL,
    MODIFY `featureOptionId` INTEGER NULL;

-- DropTable
DROP TABLE `featurelist`;

-- CreateTable
CREATE TABLE `FeatureRange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `min` DECIMAL(12, 3) NULL,
    `max` DECIMAL(12, 3) NULL,
    `featureId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Feature` ADD CONSTRAINT `Feature_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureRange` ADD CONSTRAINT `FeatureRange_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `Feature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureValue` ADD CONSTRAINT `FeatureValue_featureOptionId_fkey` FOREIGN KEY (`featureOptionId`) REFERENCES `FeatureOption`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
