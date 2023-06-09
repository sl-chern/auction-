/*
  Warnings:

  - You are about to drop the column `createdData` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `createdData`,
    ADD COLUMN `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
