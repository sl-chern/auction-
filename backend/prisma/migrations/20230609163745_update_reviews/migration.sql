/*
  Warnings:

  - Added the required column `createdDate` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `review` ADD COLUMN `createdDate` DATETIME(3) NOT NULL;
