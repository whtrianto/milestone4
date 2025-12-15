-- ============================================
-- Script SQL untuk Membuat Tabel RevoBank
-- Database: revobank
-- ============================================

-- Pastikan menggunakan database yang benar
USE revobank;

-- ============================================
-- 1. Tabel Users (Pengguna)
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_key` (`email`),
    INDEX `users_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Tabel Accounts (Rekening)
-- ============================================
CREATE TABLE IF NOT EXISTS `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `type` VARCHAR(191) NOT NULL COMMENT 'SAVINGS, CHECKING, etc.',
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `accounts_accountNumber_key` (`accountNumber`),
    INDEX `accounts_userId_idx` (`userId`),
    INDEX `accounts_accountNumber_idx` (`accountNumber`),
    CONSTRAINT `accounts_userId_fkey` 
        FOREIGN KEY (`userId`) 
        REFERENCES `users` (`id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Tabel Transactions (Transaksi)
-- ============================================
CREATE TABLE IF NOT EXISTS `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER') NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'COMPLETED',
    `amount` DECIMAL(15, 2) NOT NULL,
    `description` VARCHAR(191) NULL,
    `fromAccountId` VARCHAR(191) NULL COMMENT 'Untuk WITHDRAW dan TRANSFER',
    `toAccountId` VARCHAR(191) NULL COMMENT 'Untuk DEPOSIT dan TRANSFER',
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (`id`),
    INDEX `transactions_userId_idx` (`userId`),
    INDEX `transactions_fromAccountId_idx` (`fromAccountId`),
    INDEX `transactions_toAccountId_idx` (`toAccountId`),
    INDEX `transactions_createdAt_idx` (`createdAt`),
    CONSTRAINT `transactions_userId_fkey` 
        FOREIGN KEY (`userId`) 
        REFERENCES `users` (`id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT `transactions_fromAccountId_fkey` 
        FOREIGN KEY (`fromAccountId`) 
        REFERENCES `accounts` (`id`) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    CONSTRAINT `transactions_toAccountId_fkey` 
        FOREIGN KEY (`toAccountId`) 
        REFERENCES `accounts` (`id`) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Selesai
-- ============================================
-- Tabel berhasil dibuat!
-- 
-- Struktur Tabel:
-- 1. users - Menyimpan data pengguna (customer & admin)
-- 2. accounts - Menyimpan data rekening bank
-- 3. transactions - Menyimpan data transaksi (deposit, withdraw, transfer)
--
-- Relasi:
-- - users (1) -> accounts (many)
-- - users (1) -> transactions (many)
-- - accounts (1) -> transactions (many) [fromAccountId]
-- - accounts (1) -> transactions (many) [toAccountId]
-- ============================================

