/*
  Warnings:

  - You are about to drop the column `value` on the `featurevalue` table. All the data in the column will be lost.
  - Added the required column `featureOptionId` to the `FeatureValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `featurevalue` DROP COLUMN `value`,
    ADD COLUMN `featureOptionId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `FeatureOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `featureId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FeatureOption` ADD CONSTRAINT `FeatureOption_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `Feature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureValue` ADD CONSTRAINT `FeatureValue_featureOptionId_fkey` FOREIGN KEY (`featureOptionId`) REFERENCES `FeatureOption`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
