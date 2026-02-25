-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: paragrein
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKdwk6cx0afu8bs9o4t536v1j5v` (`email`),
  UNIQUE KEY `UKj7ja2xvrxudhvssosd4nu1o92` (`user_id`),
  CONSTRAINT `FKra1cb3fu95r1a0m7aksow0nk4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_feedback`
--

DROP TABLE IF EXISTS `customer_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_feedback` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8kjg2xji0003uwavw0691kos4` (`order_id`),
  CONSTRAINT `FK66c0me29w0iw99lkjk2gb5lf6` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_history`
--

DROP TABLE IF EXISTS `delivery_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `notes` text,
  `status` enum('ARRIVED','DELIVERED','FAILED','OUT_FOR_DELIVERY','PENDING','RESCHEDULED') NOT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `tracking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfpd4elvcxqk1mnwjvnjh9uoor` (`tracking_id`),
  CONSTRAINT `FKfpd4elvcxqk1mnwjvnjh9uoor` FOREIGN KEY (`tracking_id`) REFERENCES `delivery_tracking` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_tracking`
--

DROP TABLE IF EXISTS `delivery_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_tracking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actual_delivery_time` datetime(6) DEFAULT NULL,
  `current_latitude` double DEFAULT NULL,
  `current_longitude` double DEFAULT NULL,
  `estimated_delivery_time` datetime(6) DEFAULT NULL,
  `last_updated` datetime(6) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `proof_of_delivery` varchar(255) DEFAULT NULL,
  `status` enum('ARRIVED','DELIVERED','FAILED','OUT_FOR_DELIVERY','PENDING','RESCHEDULED') DEFAULT NULL,
  `driver_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `vehicle_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8fj62epuoo54oh4er1xjkq7k5` (`order_id`),
  KEY `FKp3ta10pvsc1qe076wagna7rd6` (`driver_id`),
  KEY `FK90u8fjlmxnktxvbrieqhopj1p` (`vehicle_id`),
  CONSTRAINT `FK90u8fjlmxnktxvbrieqhopj1p` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `FKj94c0yp9a0j4w50d37vdfcup6` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKp3ta10pvsc1qe076wagna7rd6` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `driver`
--

DROP TABLE IF EXISTS `driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `availability_status` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `license_expiry_date` date DEFAULT NULL,
  `on_time_delivery_pct` double DEFAULT NULL,
  `current_vehicle_id` bigint DEFAULT NULL,
  `warehouse_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg3oju5uudgl1cct873m6f2bfy` (`user_id`),
  UNIQUE KEY `UKslpt124153g6nxqb1kq8v3q4f` (`current_vehicle_id`),
  KEY `FKh06cvjfhaj4mj3fjbu6wvyo2b` (`warehouse_id`),
  CONSTRAINT `FKcmqtox7705hqk8hahof0ikmba` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKh06cvjfhaj4mj3fjbu6wvyo2b` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `FKjhesfwymfbyacxxhuj8thrdol` FOREIGN KEY (`current_vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `escalations`
--

DROP TABLE IF EXISTS `escalations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `escalations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `resolution_notes` text,
  `resolved_at` datetime(6) DEFAULT NULL,
  `severity` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3cdd59udg2hh8dbywgy8uqfh` (`order_id`),
  CONSTRAINT `FK3cdd59udg2hh8dbywgy8uqfh` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_updated` datetime(6) DEFAULT NULL,
  `quantity` int NOT NULL,
  `reorder_level` int DEFAULT NULL,
  `product_id` bigint NOT NULL,
  `warehouse_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKq2yge7ebtfuvwufr6lwfwqy9l` (`product_id`),
  KEY `FK52wtagl8u69w0vduys8nsyi0x` (`warehouse_id`),
  CONSTRAINT `FK52wtagl8u69w0vduys8nsyi0x` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `FKq2yge7ebtfuvwufr6lwfwqy9l` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory_movements`
--

DROP TABLE IF EXISTS `inventory_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_movements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `warehouse_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `delivery_fee` decimal(38,2) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `invoice_number` varchar(255) NOT NULL,
  `issued_at` datetime(6) DEFAULT NULL,
  `paid_date` date DEFAULT NULL,
  `status` enum('COMPLETED','FAILED','PENDING','REFUNDED') DEFAULT NULL,
  `subtotal` decimal(38,2) DEFAULT NULL,
  `tax` decimal(38,2) DEFAULT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKl1x55mfsay7co0r3m9ynvipd5` (`invoice_number`),
  UNIQUE KEY `UKe718q5klx5pempy28p2nx88a6` (`order_id`),
  KEY `FKbhmf1js3tn5kc4h3vv1lsl04s` (`customer_id`),
  CONSTRAINT `FK4ko3y00tkkk2ya3p6wnefjj2f` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKbhmf1js3tn5kc4h3vv1lsl04s` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_assignments`
--

DROP TABLE IF EXISTS `order_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `estimated_delivery_date` date DEFAULT NULL,
  `scheduled_date` date DEFAULT NULL,
  `status` enum('ASSIGNED','CANCELLED','DELIVERED','FAILED','IN_PROGRESS','PENDING') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `driver_id` bigint DEFAULT NULL,
  `order_id` bigint NOT NULL,
  `vehicle_id` bigint DEFAULT NULL,
  `warehouse_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7u7va8cxuigkcbldjiufwjhjq` (`order_id`),
  KEY `FKb1ctpxljymonno2lp9dw5pb25` (`driver_id`),
  KEY `FKfn0vrkvnrbaa581av2l17o4x5` (`vehicle_id`),
  KEY `FKdn5cnf1ee8uqlncnollj0vten` (`warehouse_id`),
  CONSTRAINT `FKb1ctpxljymonno2lp9dw5pb25` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`),
  CONSTRAINT `FKdn5cnf1ee8uqlncnollj0vten` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `FKfn0vrkvnrbaa581av2l17o4x5` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `FKhhu5nv7c14yxx28s4fotonkkk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `total_price` decimal(38,2) NOT NULL,
  `unit_price` decimal(38,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `delivery_address` varchar(255) NOT NULL,
  `delivery_city` varchar(255) NOT NULL,
  `delivery_fee` decimal(38,2) NOT NULL,
  `estimated_delivery_date` date DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `order_number` varchar(255) NOT NULL,
  `order_type` enum('BULK','EXPRESS','STANDARD') NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `special_instructions` text,
  `status` enum('CANCELLED','CONFIRMED','DELIVERED','FAILED','IN_TRANSIT','PACKED','PENDING','PICKING','RETURNED') NOT NULL,
  `subtotal` decimal(38,2) NOT NULL,
  `tax` decimal(38,2) DEFAULT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnthkiu7pgmnqnu86i2jyoe2v7` (`order_number`),
  KEY `FK624gtjin3po807j3vix093tlf` (`customer_id`),
  CONSTRAINT `FK624gtjin3po807j3vix093tlf` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg0guo4k8krgpwuagos61oc06j` (`token`),
  KEY `FK83nsrttkwkb6ym0anu051mtxn` (`user_id`),
  CONSTRAINT `FK83nsrttkwkb6ym0anu051mtxn` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(38,2) NOT NULL,
  `collected_by` varchar(255) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `notes` text,
  `payment_method` enum('CASH_ON_DELIVERY','CHEQUE','CREDIT_CARD','DEBIT_CARD','ONLINE_BANKING') NOT NULL,
  `payment_status` enum('COMPLETED','FAILED','PENDING','REFUNDED') NOT NULL,
  `transaction_ref` varchar(255) DEFAULT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8vo36cen604as7etdfwmyjsxt` (`order_id`),
  CONSTRAINT `FK81gagumt0r8y3rmudcgpbk42l` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `return_inspections`
--

DROP TABLE IF EXISTS `return_inspections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `return_inspections` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `item_condition` varchar(255) DEFAULT NULL,
  `inspection_date` datetime(6) DEFAULT NULL,
  `notes` text,
  `inspector_id` bigint DEFAULT NULL,
  `return_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKa3fm7edq0lklmwlrocm0ce1kl` (`return_id`),
  KEY `FKpmqjuc4m885wr4pvgnkxibyuj` (`inspector_id`),
  CONSTRAINT `FKm55q1ea76k0yd7s53p9kobs3v` FOREIGN KEY (`return_id`) REFERENCES `returns` (`id`),
  CONSTRAINT `FKpmqjuc4m885wr4pvgnkxibyuj` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `returns`
--

DROP TABLE IF EXISTS `returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `returns` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `approved_at` datetime(6) DEFAULT NULL,
  `description` text,
  `photo_url` varchar(255) DEFAULT NULL,
  `refund_amount` decimal(38,2) DEFAULT NULL,
  `refund_status` enum('FAILED','PENDING','PROCESSED') DEFAULT NULL,
  `requested_at` datetime(6) DEFAULT NULL,
  `return_reason` enum('CHANGED_MIND','DAMAGED','DEFECTIVE','WRONG_ITEM') NOT NULL,
  `status` enum('APPROVED','IN_TRANSIT','RECEIVED','REFUNDED','REJECTED','REQUESTED') NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtge2tys80xohjn8v3wtiy21yi` (`order_id`),
  CONSTRAINT `FKtge2tys80xohjn8v3wtiy21yi` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8sewwnpamngi6b1dwaa88askk` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` enum('ROLE_ADMIN','ROLE_DRIVER','ROLE_FINANCE','ROLE_OPERATIONS','ROLE_USER','ROLE_WAREHOUSE') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) DEFAULT NULL,
  `supply_type` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKafxol104prrysgdv6xe8nmt56` (`user_id`),
  CONSTRAINT `FKs1dd5csqciyb73tm0vep2slsy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrhfovtciq1l558cw6udg0h0d3` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `capacity_kg` int DEFAULT NULL,
  `last_service_date` date DEFAULT NULL,
  `registration_number` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `warehouse_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKf6xfxoc4kprkjkst07tq63y6` (`registration_number`),
  KEY `FKiwlwycapecq864j245s48rx9v` (`warehouse_id`),
  CONSTRAINT `FKiwlwycapecq864j245s48rx9v` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouses`
--

DROP TABLE IF EXISTS `warehouses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `capacity` int DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK2qm0l82n5ivhyqwmgejxxefm1` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-24 19:51:02
