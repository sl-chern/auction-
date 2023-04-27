/*
  Warnings:

  - Added the required column `endDate` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `refreshtoken` ADD COLUMN `endDate` DATETIME(3) NOT NULL;
