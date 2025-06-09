-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2025 at 03:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `financial_records`
--

CREATE TABLE `financial_records` (
  `id` varchar(191) NOT NULL,
  `amount` decimal(65,30) NOT NULL,
  `type` enum('INCOME','EXPENSE') NOT NULL,
  `description` text DEFAULT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `financial_records`
--

INSERT INTO `financial_records` (`id`, `amount`, `type`, `description`, `userId`, `createdAt`, `updatedAt`) VALUES
('fr_001', 1200.000000000000000000000000000000, 'INCOME', 'รายรับตัวอย่าง', 'usr_001', '2025-06-05 08:26:29.812', '2025-06-05 08:26:29.812'),
('fr_002', 5000.000000000000000000000000000000, 'EXPENSE', 'รายจ่ายตัวอย่าง', 'usr_001', '2025-06-05 08:26:29.812', '2025-06-05 08:26:29.812');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `fullName`, `createdAt`, `updatedAt`) VALUES
('usr_001', 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'Admin User', '2025-06-05 08:26:29.782', '2025-06-05 08:26:29.782');

-- --------------------------------------------------------

--
-- Table structure for table `work_orders`
--

CREATE TABLE `work_orders` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  `assignedToId` varchar(191) NOT NULL,
  `createdById` varchar(191) NOT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_orders`
--

INSERT INTO `work_orders` (`id`, `title`, `description`, `status`, `assignedToId`, `createdById`, `startDate`, `endDate`, `createdAt`, `updatedAt`) VALUES
('wo_001', 'ตัวอย่างงาน', 'รายละเอียดงานตัวอย่าง', 'PENDING', 'usr_001', 'usr_001', '2025-06-05 08:26:29.799', '2025-06-12 08:26:29.799', '2025-06-05 08:26:29.799', '2025-06-05 08:26:29.799');

-- --------------------------------------------------------

--
-- Table structure for table `work_statuses`
--

CREATE TABLE `work_statuses` (
  `id` varchar(191) NOT NULL,
  `workOrderId` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `financial_records`
--
ALTER TABLE `financial_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `work_orders`
--
ALTER TABLE `work_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignedToId` (`assignedToId`),
  ADD KEY `createdById` (`createdById`);

--
-- Indexes for table `work_statuses`
--
ALTER TABLE `work_statuses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workOrderId` (`workOrderId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `financial_records`
--
ALTER TABLE `financial_records`
  ADD CONSTRAINT `financial_records_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `work_orders`
--
ALTER TABLE `work_orders`
  ADD CONSTRAINT `work_orders_ibfk_1` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `work_orders_ibfk_2` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`);

--
-- Constraints for table `work_statuses`
--
ALTER TABLE `work_statuses`
  ADD CONSTRAINT `work_statuses_ibfk_1` FOREIGN KEY (`workOrderId`) REFERENCES `work_orders` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
