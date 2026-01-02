/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 100427 (10.4.27-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : revobank

 Target Server Type    : MySQL
 Target Server Version : 100427 (10.4.27-MariaDB)
 File Encoding         : 65001

 Date: 03/01/2026 02:29:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) NULL DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `rolled_back_at` datetime(3) NULL DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of _prisma_migrations
-- ----------------------------
INSERT INTO `_prisma_migrations` VALUES ('4c788675-ca1f-4516-95e3-2e337e8fce7a', '932c505f8b8a79e5087eb66d1f31e2f1953f02ab9d0c2089fbd8fd1fb3c51c1b', '2025-12-07 13:46:21.120', '20251207134620_mileston4', NULL, NULL, '2025-12-07 13:46:20.279', 1);

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `accountNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `balance` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `accounts_accountNumber_key`(`accountNumber` ASC) USING BTREE,
  INDEX `accounts_userId_idx`(`userId` ASC) USING BTREE,
  INDEX `accounts_accountNumber_idx`(`accountNumber` ASC) USING BTREE,
  CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of accounts
-- ----------------------------
INSERT INTO `accounts` VALUES ('02b601e1-3763-44ab-8108-f5673b383f57', 'REVO5004311396', 3000.00, 'SAVINGS', 'bf3aee5c-faca-4dbc-8826-28cc644d820e', '2025-12-07 14:05:53.004', '2025-12-07 14:05:53.004');
INSERT INTO `accounts` VALUES ('494dfae0-3b0d-40fd-8454-003b7485b26c', 'REVO1552568723', 3000.00, 'SAVINGS', 'bf3aee5c-faca-4dbc-8826-28cc644d820e', '2025-12-07 13:46:25.285', '2025-12-07 13:46:25.285');
INSERT INTO `accounts` VALUES ('58a60c94-2b13-4da1-b66a-e17dc759e006', 'REVO2625869626', 1300.00, 'SAVINGS', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-29 07:40:58.484', '2025-12-29 07:47:51.132');
INSERT INTO `accounts` VALUES ('6ae640ca-6143-4f91-8930-370504138ee1', 'REVO0814587989', 5000.00, 'SAVINGS', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 14:05:52.960', '2025-12-07 14:05:52.960');
INSERT INTO `accounts` VALUES ('79785367-8c63-4322-993d-598033458795', 'REVO2404271685', 2000.00, 'CHECKING', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 14:05:52.985', '2025-12-07 14:05:52.985');
INSERT INTO `accounts` VALUES ('8c1cdae4-a186-484f-a0ee-50147b8a4312', 'REVO3869797212', 5000.00, 'SAVINGS', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 13:46:25.258', '2025-12-07 13:46:25.258');
INSERT INTO `accounts` VALUES ('a898dc46-ccad-4f8f-916b-57243c7db5de', 'REVO3055477637', 1700.00, 'CHECKING', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 13:46:25.269', '2025-12-29 07:58:00.516');
INSERT INTO `accounts` VALUES ('f92334d2-1ddc-4211-a6eb-0d3a1f925cb6', 'REVO1118130724', 800.00, 'CHECKING', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-29 07:55:48.852', '2025-12-29 08:02:42.916');

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('DEPOSIT','WITHDRAW','TRANSFER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COMPLETED',
  `amount` decimal(15, 2) NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `fromAccountId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `toAccountId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `transactions_userId_idx`(`userId` ASC) USING BTREE,
  INDEX `transactions_fromAccountId_idx`(`fromAccountId` ASC) USING BTREE,
  INDEX `transactions_toAccountId_idx`(`toAccountId` ASC) USING BTREE,
  INDEX `transactions_createdAt_idx`(`createdAt` ASC) USING BTREE,
  CONSTRAINT `transactions_fromAccountId_fkey` FOREIGN KEY (`fromAccountId`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `transactions_toAccountId_fkey` FOREIGN KEY (`toAccountId`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of transactions
-- ----------------------------
INSERT INTO `transactions` VALUES ('050f1ec3-133b-4bca-84a5-3163fd8209a6', 'DEPOSIT', 'COMPLETED', 5000.00, 'Initial deposit', NULL, '8c1cdae4-a186-484f-a0ee-50147b8a4312', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 13:46:25.293', '2025-12-07 13:46:25.293');
INSERT INTO `transactions` VALUES ('1c1c93e6-8622-4cf1-a429-6240cfa6d64e', 'TRANSFER', 'COMPLETED', 500.00, 'Transfer to savings', '79785367-8c63-4322-993d-598033458795', '6ae640ca-6143-4f91-8930-370504138ee1', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 14:05:53.036', '2025-12-07 14:05:53.036');
INSERT INTO `transactions` VALUES ('3b64bce0-f053-4aa8-b198-ce628dd27fc6', 'TRANSFER', 'COMPLETED', 300.00, 'Test transfer', 'a898dc46-ccad-4f8f-916b-57243c7db5de', 'f92334d2-1ddc-4211-a6eb-0d3a1f925cb6', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-29 07:58:00.533', '2025-12-29 07:58:00.533');
INSERT INTO `transactions` VALUES ('493e4dea-6d41-4199-a263-cf1818b3642a', 'WITHDRAW', 'COMPLETED', 200.00, 'Cash withdrawal', '58a60c94-2b13-4da1-b66a-e17dc759e006', NULL, 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-29 07:47:51.146', '2025-12-29 07:47:51.146');
INSERT INTO `transactions` VALUES ('8b05f4d7-09a3-4b3b-9291-ad5526ebcc2b', 'DEPOSIT', 'COMPLETED', 500.00, 'Test deposit', NULL, '58a60c94-2b13-4da1-b66a-e17dc759e006', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-29 07:46:27.272', '2025-12-29 07:46:27.272');
INSERT INTO `transactions` VALUES ('a09d717d-afae-4965-86ec-7f7b08ebfa2b', 'DEPOSIT', 'COMPLETED', 2000.00, 'Initial deposit', NULL, 'a898dc46-ccad-4f8f-916b-57243c7db5de', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 13:46:25.306', '2025-12-07 13:46:25.306');
INSERT INTO `transactions` VALUES ('a3a5e594-d614-41d3-b99e-df23c21e50f7', 'DEPOSIT', 'COMPLETED', 5000.00, 'Initial deposit', NULL, '6ae640ca-6143-4f91-8930-370504138ee1', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 14:05:53.013', '2025-12-07 14:05:53.013');
INSERT INTO `transactions` VALUES ('a45f271c-5532-4b92-88d3-80ca00564a47', 'TRANSFER', 'COMPLETED', 500.00, 'Transfer to savings', 'a898dc46-ccad-4f8f-916b-57243c7db5de', '8c1cdae4-a186-484f-a0ee-50147b8a4312', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 13:46:25.329', '2025-12-07 13:46:25.329');
INSERT INTO `transactions` VALUES ('d33fb6b3-a56f-414d-8dca-b162c7963876', 'DEPOSIT', 'COMPLETED', 2000.00, 'Initial deposit', NULL, '79785367-8c63-4322-993d-598033458795', 'e294770a-fa15-464f-91f4-1710b937e153', '2025-12-07 14:05:53.024', '2025-12-07 14:05:53.024');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('CUSTOMER','ADMIN') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `users_email_key`(`email` ASC) USING BTREE,
  INDEX `users_email_idx`(`email` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('04109773-5ef0-4258-91f6-ad97953fefef', 'testuser@example.com', '$2b$10$e7nTqBQ1BcOrfvK7FWpf2Oowi3za1zS3p1SyxG62aPSmIjifAkQb2', 'Test User', 'CUSTOMER', '2025-12-07 16:06:19.303', '2025-12-07 16:06:19.303');
INSERT INTO `users` VALUES ('6d25d81e-7aeb-4317-9f8f-fc822a59846c', 'john1.doe@example.com', '$2b$10$EfaXmkcuyVqi.R.uNvxBouR4nyixmqTc/8sfBMoVN9MTQPzyZInIe', 'John Do1e', 'CUSTOMER', '2025-12-30 13:50:58.949', '2025-12-30 13:50:58.949');
INSERT INTO `users` VALUES ('7997d072-113c-4663-a1a7-321cace7c2a1', 'john2.doe@example.com', '$2b$10$Rl1yQ0ZIonVNMUmSPmvxXurNu2NyrHOw11ODihWK/3ibFk85BR5v2', 'John Do1e2', 'CUSTOMER', '2025-12-30 13:55:40.347', '2025-12-30 13:55:40.347');
INSERT INTO `users` VALUES ('90508985-11b0-402c-8e91-35f5675f6df3', 'admin@revobank.com', '$2b$10$AeuZs5pVhsD4vKVR69GuY.AsBwqMsqvWnTtPR0YJ6Ho.DtmqwMTsu', 'Admin User', 'ADMIN', '2025-12-07 13:46:24.849', '2025-12-07 13:46:24.849');
INSERT INTO `users` VALUES ('bf3aee5c-faca-4dbc-8826-28cc644d820e', 'jane.smith@example.com', '$2b$10$icw4gVEqxUcm.5IBuldk9ebyCVfrk1nxfW4bg11GPM9QwLCLOFVpG', 'Jane Smith', 'CUSTOMER', '2025-12-07 13:46:25.248', '2025-12-07 13:46:25.248');
INSERT INTO `users` VALUES ('e294770a-fa15-464f-91f4-1710b937e153', 'john.doe@example.com', '$2b$10$7aEVArYrCDdKoAFOfrJyEO1WW/EVbfysGglgTMrsOiX3LeRguRbuW', 'John Doe Updated', 'CUSTOMER', '2025-12-07 13:46:25.046', '2025-12-29 07:39:16.440');
INSERT INTO `users` VALUES ('e57764b3-7031-4ba3-8e54-862dcbc3b7ee', 'testuser1@example.com', '$2b$10$NZ4NbuMkE0Q37/sHdigThu9g0dPIWWjsuIzl2zO/kTF7VbCDACNEG', 'Test User', 'CUSTOMER', '2025-12-29 07:34:18.885', '2025-12-29 07:34:18.885');

SET FOREIGN_KEY_CHECKS = 1;
