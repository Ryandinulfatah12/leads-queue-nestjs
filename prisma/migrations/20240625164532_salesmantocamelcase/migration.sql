/*
  Warnings:

  - You are about to drop the column `salesman_id` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Lead` DROP COLUMN `salesman_id`,
    ADD COLUMN `salesmanId` INTEGER NULL;
