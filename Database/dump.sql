-- MariaDB dump 10.19  Distrib 10.4.25-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: sportsbook
-- ------------------------------------------------------
-- Server version	10.4.25-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('131b1fa3-6d44-4ec8-8347-47133c5038f0','9fccbe2bf76b8198673651eb8dd821863a5d40a77cc4ff66548748c6296843f5','2024-06-05 15:14:58.001','20240605151457_init',NULL,NULL,'2024-06-05 15:14:57.551',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bankaccounts`
--

DROP TABLE IF EXISTS `bankaccounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bankaccounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `account_number` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(19,4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BankAccounts_user_id_key` (`user_id`),
  UNIQUE KEY `BankAccounts_account_number_key` (`account_number`),
  CONSTRAINT `BankAccounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bankaccounts`
--

LOCK TABLES `bankaccounts` WRITE;
/*!40000 ALTER TABLE `bankaccounts` DISABLE KEYS */;
INSERT INTO `bankaccounts` VALUES (1,3,'81407234570',55120.0000),(5,4,'81432154632',56800.0000);
/*!40000 ALTER TABLE `bankaccounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bets`
--

DROP TABLE IF EXISTS `bets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bet_option` int(11) NOT NULL,
  `odd` decimal(5,2) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `result` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Bets_bet_option_key` (`bet_option`),
  KEY `Bets_event_id_fkey` (`event_id`),
  KEY `Bets_team_id_fkey` (`team_id`),
  CONSTRAINT `Bets_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Bets_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bets`
--

LOCK TABLES `bets` WRITE;
/*!40000 ALTER TABLE `bets` DISABLE KEYS */;
INSERT INTO `bets` VALUES (1,1,2.40,'active','WON',1,1,'2024-06-08 11:00:11.000','2024-06-10 00:30:38.995'),(2,2,2.60,'active',NULL,1,2,'2024-06-08 11:00:57.000','2024-06-08 11:00:57.000'),(4,3,4.00,'active',NULL,1,1,'2024-06-10 00:51:17.656','2024-06-10 00:51:17.656');
/*!40000 ALTER TABLE `bets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'WITHDRAW'),(2,'DEPOSIT'),(3,'BET'),(4,'WIN');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Countries_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'COLOMBIA'),(2,'UNITED STATES');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_place` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` datetime(3) NOT NULL,
  `sport_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Events_sport_id_fkey` (`sport_id`),
  CONSTRAINT `Events_sport_id_fkey` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Supercl├ísico','Santiago Bernab├®u','2024-06-10 15:00:00.000',1);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permissions_type_key` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (17,'BALANCE-READ'),(11,'BANK-ACCOUNT-CREATE'),(14,'BANK-ACCOUNT-DELETE'),(12,'BANK-ACCOUNT-READ'),(13,'BANK-ACCOUNT-UPDATE'),(6,'BET-CREATE'),(9,'BET-DELETE'),(7,'BET-READ'),(8,'BET-UPDATE'),(10,'MAKE-BET'),(15,'MAKE-DEPOSIT'),(16,'MAKE-WITHDRAW'),(5,'PROFILE-UPDATE'),(1,'USER-CREATE'),(4,'USER-DELETE'),(2,'USER-READ'),(3,'USER-UPDATE');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rol_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Roles_rol_name_key` (`rol_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','2024-06-05 14:22:31.000','2024-06-05 14:22:31.000'),(2,'User','2024-06-05 14:22:31.000','2024-06-05 14:22:31.000');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolespermissions`
--

DROP TABLE IF EXISTS `rolespermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rolespermissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `RolesPermissions_role_id_permission_id_key` (`role_id`,`permission_id`),
  KEY `RolesPermissions_permission_id_fkey` (`permission_id`),
  CONSTRAINT `RolesPermissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `RolesPermissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolespermissions`
--

LOCK TABLES `rolespermissions` WRITE;
/*!40000 ALTER TABLE `rolespermissions` DISABLE KEYS */;
INSERT INTO `rolespermissions` VALUES (1,1,1,'2024-06-05 11:07:22.000','2024-06-05 11:07:22.000'),(2,1,2,'2024-06-05 11:07:22.000','2024-06-05 11:07:22.000'),(3,1,3,'2024-06-05 11:07:22.000','2024-06-05 11:07:22.000'),(4,1,5,'2024-06-05 11:07:22.000','2024-06-05 11:07:22.000'),(5,1,7,'2024-06-05 11:07:22.000','2024-06-05 11:07:22.000'),(6,1,9,'2024-06-05 11:07:22.000','2024-06-05 11:07:22.000'),(11,1,10,'2024-06-05 19:05:38.000','2024-06-05 19:05:38.000'),(12,2,17,'2024-06-08 13:18:18.000','2024-06-08 13:18:18.000'),(13,2,10,'2024-06-08 13:18:18.000','2024-06-08 13:18:18.000'),(14,2,15,'2024-06-08 13:18:50.000','2024-06-08 13:18:50.000'),(15,2,16,'2024-06-08 13:19:57.000','2024-06-08 13:19:57.000'),(16,2,7,'2024-06-08 16:47:55.000','2024-06-08 16:47:55.000'),(17,1,8,'2024-06-09 16:08:28.000','2024-06-09 16:08:28.000'),(19,2,5,'2024-06-09 20:13:33.000','2024-06-09 20:13:33.000');
/*!40000 ALTER TABLE `rolespermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sports`
--

DROP TABLE IF EXISTS `sports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Sports_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sports`
--

LOCK TABLES `sports` WRITE;
/*!40000 ALTER TABLE `sports` DISABLE KEYS */;
INSERT INTO `sports` VALUES (2,'Basketball'),(1,'Football');
/*!40000 ALTER TABLE `sports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Teams_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'Barcelona'),(2,'Real Madrid');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `documentId` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cellphone` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthDate` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Users_email_key` (`email`),
  UNIQUE KEY `Users_username_key` (`username`),
  UNIQUE KEY `Users_remember_token_key` (`remember_token`),
  KEY `Users_role_id_fkey` (`role_id`),
  KEY `Users_country_id_fkey` (`country_id`),
  CONSTRAINT `Users_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'1232589088','Welker','Jose','3213655354','welkerperez97@gmail.com','Calle 63d','M','1997-12-12','Bucaramanga','chorizo007','6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d',NULL,1,1,'2024-06-05 16:32:31.037','2024-06-05 16:32:31.037',0,NULL),(2,'1232589088','Anggie','Castellanos','3118365945','anggie@gmail.com','Calle 63d','F','1997-12-12','Bucaramanga','pandefruta@gmail.com','6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d',NULL,1,1,'2024-06-05 19:37:01.317','2024-06-05 19:37:01.317',0,NULL),(3,'1232589055','Player','Jose','3213655355','player@gmail.com','Calle 63d','M','1997-12-12','Bucaramanga','tiburonzin','6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d',NULL,2,1,'2024-06-06 00:12:03.360','2024-06-06 00:12:03.360',0,NULL),(4,'1123456789','edited name','edited lastname','3212565254','editedemail@gmail.com','Calle 63D #30 - 67','M','1997/03/13','Bucaramanga','loquillo321','6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d',NULL,2,1,'2024-06-09 16:17:17.000','2024-06-10 01:48:14.363',0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userstransactions`
--

DROP TABLE IF EXISTS `userstransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userstransactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount_money` decimal(19,4) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `bet_id` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UsersTransactions_user_id_fkey` (`user_id`),
  KEY `UsersTransactions_category_id_fkey` (`category_id`),
  KEY `UsersTransactions_bet_id_fkey` (`bet_id`),
  CONSTRAINT `UsersTransactions_bet_id_fkey` FOREIGN KEY (`bet_id`) REFERENCES `bets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `UsersTransactions_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `UsersTransactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userstransactions`
--

LOCK TABLES `userstransactions` WRITE;
/*!40000 ALTER TABLE `userstransactions` DISABLE KEYS */;
INSERT INTO `userstransactions` VALUES (39,1000.0000,3,1,NULL,'2024-06-07 21:50:21.948','2024-06-07 21:50:21.948'),(40,1000.0000,3,1,NULL,'2024-06-07 21:53:29.886','2024-06-07 21:53:29.886'),(41,1000.0000,3,1,NULL,'2024-06-07 21:54:43.729','2024-06-07 21:54:43.729'),(42,1000.0000,3,1,NULL,'2024-06-07 21:54:45.935','2024-06-07 21:54:45.935'),(43,1000.0000,3,1,NULL,'2024-06-07 21:54:47.392','2024-06-07 21:54:47.392'),(44,1000.0000,3,1,NULL,'2024-06-07 21:54:48.868','2024-06-07 21:54:48.868'),(45,1000.0000,3,1,NULL,'2024-06-07 21:54:50.597','2024-06-07 21:54:50.597'),(46,40000.0000,3,1,NULL,'2024-06-07 21:55:18.379','2024-06-07 21:55:18.379'),(47,13501.2070,3,1,NULL,'2024-06-07 21:55:38.710','2024-06-07 21:55:38.710'),(48,15000.0000,3,2,NULL,'2024-06-07 21:56:04.193','2024-06-07 21:56:04.193'),(52,5000.0000,3,2,NULL,'2024-06-08 20:17:58.307','2024-06-08 20:17:58.307'),(55,50000.0000,3,2,NULL,'2024-06-08 20:36:36.596','2024-06-08 20:36:36.596'),(56,6300.0000,3,3,1,'2024-06-08 20:39:04.561','2024-06-08 20:39:04.561'),(57,3700.0000,3,3,2,'2024-06-08 20:39:04.592','2024-06-08 20:39:04.592'),(58,50000.0000,4,2,NULL,'2024-06-09 21:23:08.440','2024-06-09 21:23:08.440'),(59,7000.0000,4,3,1,'2024-06-09 21:26:23.576','2024-06-09 21:26:23.576'),(60,3000.0000,4,3,2,'2024-06-09 21:26:23.588','2024-06-09 21:26:23.588'),(63,15120.0000,3,4,1,'2024-06-10 00:30:39.063','2024-06-10 00:30:39.063'),(64,16800.0000,4,4,1,'2024-06-10 00:30:39.070','2024-06-10 00:30:39.070');
/*!40000 ALTER TABLE `userstransactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-10 12:04:01
