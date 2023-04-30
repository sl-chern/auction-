/*
  Warnings:

  - Added the required column `value` to the `FeatureValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `featurevalue` ADD COLUMN `value` TEXT NOT NULL;
