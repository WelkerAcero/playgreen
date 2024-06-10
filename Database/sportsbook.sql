-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2024 a las 13:59:33
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sportsbook`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bankaccounts`
--

CREATE TABLE `bankaccounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_number` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(19,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `bankaccounts`
--

INSERT INTO `bankaccounts` (`id`, `user_id`, `account_number`, `amount`) VALUES
(1, 3, '81407234570', '55120.0000'),
(5, 4, '81432154632', '56800.0000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bets`
--

CREATE TABLE `bets` (
  `id` int(11) NOT NULL,
  `bet_option` int(11) NOT NULL,
  `odd` decimal(5,2) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `result` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `bets`
--

INSERT INTO `bets` (`id`, `bet_option`, `odd`, `status`, `result`, `event_id`, `team_id`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2.40', 'active', 'WON', 1, 1, '2024-06-08 11:00:11.000', '2024-06-10 00:30:38.995'),
(2, 2, '2.60', 'active', NULL, 1, 2, '2024-06-08 11:00:57.000', '2024-06-08 11:00:57.000'),
(4, 3, '4.00', 'active', NULL, 1, 1, '2024-06-10 00:51:17.656', '2024-06-10 00:51:17.656');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'WITHDRAW'),
(2, 'DEPOSIT'),
(3, 'BET'),
(4, 'WIN');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `countries`
--

INSERT INTO `countries` (`id`, `name`) VALUES
(1, 'COLOMBIA'),
(2, 'UNITED STATES');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_place` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` datetime(3) NOT NULL,
  `sport_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `events`
--

INSERT INTO `events` (`id`, `name`, `event_place`, `event_date`, `sport_id`) VALUES
(1, 'Superclásico', 'Santiago Bernabéu', '2024-06-10 15:00:00.000', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `permissions`
--

INSERT INTO `permissions` (`id`, `type`) VALUES
(17, 'BALANCE-READ'),
(11, 'BANK-ACCOUNT-CREATE'),
(14, 'BANK-ACCOUNT-DELETE'),
(12, 'BANK-ACCOUNT-READ'),
(13, 'BANK-ACCOUNT-UPDATE'),
(6, 'BET-CREATE'),
(9, 'BET-DELETE'),
(7, 'BET-READ'),
(8, 'BET-UPDATE'),
(10, 'MAKE-BET'),
(15, 'MAKE-DEPOSIT'),
(16, 'MAKE-WITHDRAW'),
(5, 'PROFILE-UPDATE'),
(1, 'USER-CREATE'),
(4, 'USER-DELETE'),
(2, 'USER-READ'),
(3, 'USER-UPDATE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `rol_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `rol_name`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', '2024-06-05 14:22:31.000', '2024-06-05 14:22:31.000'),
(2, 'User', '2024-06-05 14:22:31.000', '2024-06-05 14:22:31.000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolespermissions`
--

CREATE TABLE `rolespermissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `rolespermissions`
--

INSERT INTO `rolespermissions` (`id`, `role_id`, `permission_id`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2024-06-05 11:07:22.000', '2024-06-05 11:07:22.000'),
(2, 1, 2, '2024-06-05 11:07:22.000', '2024-06-05 11:07:22.000'),
(3, 1, 3, '2024-06-05 11:07:22.000', '2024-06-05 11:07:22.000'),
(4, 1, 5, '2024-06-05 11:07:22.000', '2024-06-05 11:07:22.000'),
(5, 1, 7, '2024-06-05 11:07:22.000', '2024-06-05 11:07:22.000'),
(6, 1, 9, '2024-06-05 11:07:22.000', '2024-06-05 11:07:22.000'),
(11, 1, 10, '2024-06-05 19:05:38.000', '2024-06-05 19:05:38.000'),
(12, 2, 17, '2024-06-08 13:18:18.000', '2024-06-08 13:18:18.000'),
(13, 2, 10, '2024-06-08 13:18:18.000', '2024-06-08 13:18:18.000'),
(14, 2, 15, '2024-06-08 13:18:50.000', '2024-06-08 13:18:50.000'),
(15, 2, 16, '2024-06-08 13:19:57.000', '2024-06-08 13:19:57.000'),
(16, 2, 7, '2024-06-08 16:47:55.000', '2024-06-08 16:47:55.000'),
(17, 1, 8, '2024-06-09 16:08:28.000', '2024-06-09 16:08:28.000'),
(19, 2, 5, '2024-06-09 20:13:33.000', '2024-06-09 20:13:33.000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sports`
--

CREATE TABLE `sports` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sports`
--

INSERT INTO `sports` (`id`, `name`) VALUES
(2, 'Basketball'),
(1, 'Football');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `teams`
--

INSERT INTO `teams` (`id`, `name`) VALUES
(1, 'Barcelona'),
(2, 'Real Madrid');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
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
  `deletedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `documentId`, `name`, `lastname`, `cellphone`, `email`, `address`, `gender`, `birthDate`, `city`, `username`, `password`, `remember_token`, `role_id`, `country_id`, `createdAt`, `updatedAt`, `deleted`, `deletedAt`) VALUES
(1, '1232589088', 'Welker', 'Jose', '3213655354', 'welkerperez97@gmail.com', 'Calle 63d', 'M', '1997-12-12', 'Bucaramanga', 'chorizo007', '6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d', NULL, 1, 1, '2024-06-05 16:32:31.037', '2024-06-05 16:32:31.037', 0, NULL),
(2, '1232589088', 'Anggie', 'Castellanos', '3118365945', 'anggie@gmail.com', 'Calle 63d', 'F', '1997-12-12', 'Bucaramanga', 'pandefruta@gmail.com', '6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d', NULL, 1, 1, '2024-06-05 19:37:01.317', '2024-06-05 19:37:01.317', 0, NULL),
(3, '1232589055', 'Player', 'Jose', '3213655355', 'player@gmail.com', 'Calle 63d', 'M', '1997-12-12', 'Bucaramanga', 'tiburonzin', '6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d', NULL, 2, 1, '2024-06-06 00:12:03.360', '2024-06-06 00:12:03.360', 0, NULL),
(4, '1123456789', 'edited name', 'edited lastname', '3212565254', 'editedemail@gmail.com', 'Calle 63D #30 - 67', 'M', '1997/03/13', 'Bucaramanga', 'loquillo321', '6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d', NULL, 2, 1, '2024-06-09 16:17:17.000', '2024-06-10 01:48:14.363', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `userstransactions`
--

CREATE TABLE `userstransactions` (
  `id` int(11) NOT NULL,
  `amount_money` decimal(19,4) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `bet_id` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `userstransactions`
--

INSERT INTO `userstransactions` (`id`, `amount_money`, `user_id`, `category_id`, `bet_id`, `createdAt`, `updatedAt`) VALUES
(39, '1000.0000', 3, 1, NULL, '2024-06-07 21:50:21.948', '2024-06-07 21:50:21.948'),
(40, '1000.0000', 3, 1, NULL, '2024-06-07 21:53:29.886', '2024-06-07 21:53:29.886'),
(41, '1000.0000', 3, 1, NULL, '2024-06-07 21:54:43.729', '2024-06-07 21:54:43.729'),
(42, '1000.0000', 3, 1, NULL, '2024-06-07 21:54:45.935', '2024-06-07 21:54:45.935'),
(43, '1000.0000', 3, 1, NULL, '2024-06-07 21:54:47.392', '2024-06-07 21:54:47.392'),
(44, '1000.0000', 3, 1, NULL, '2024-06-07 21:54:48.868', '2024-06-07 21:54:48.868'),
(45, '1000.0000', 3, 1, NULL, '2024-06-07 21:54:50.597', '2024-06-07 21:54:50.597'),
(46, '40000.0000', 3, 1, NULL, '2024-06-07 21:55:18.379', '2024-06-07 21:55:18.379'),
(47, '13501.2070', 3, 1, NULL, '2024-06-07 21:55:38.710', '2024-06-07 21:55:38.710'),
(48, '15000.0000', 3, 2, NULL, '2024-06-07 21:56:04.193', '2024-06-07 21:56:04.193'),
(52, '5000.0000', 3, 2, NULL, '2024-06-08 20:17:58.307', '2024-06-08 20:17:58.307'),
(55, '50000.0000', 3, 2, NULL, '2024-06-08 20:36:36.596', '2024-06-08 20:36:36.596'),
(56, '6300.0000', 3, 3, 1, '2024-06-08 20:39:04.561', '2024-06-08 20:39:04.561'),
(57, '3700.0000', 3, 3, 2, '2024-06-08 20:39:04.592', '2024-06-08 20:39:04.592'),
(58, '50000.0000', 4, 2, NULL, '2024-06-09 21:23:08.440', '2024-06-09 21:23:08.440'),
(59, '7000.0000', 4, 3, 1, '2024-06-09 21:26:23.576', '2024-06-09 21:26:23.576'),
(60, '3000.0000', 4, 3, 2, '2024-06-09 21:26:23.588', '2024-06-09 21:26:23.588'),
(63, '15120.0000', 3, 4, 1, '2024-06-10 00:30:39.063', '2024-06-10 00:30:39.063'),
(64, '16800.0000', 4, 4, 1, '2024-06-10 00:30:39.070', '2024-06-10 00:30:39.070');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('131b1fa3-6d44-4ec8-8347-47133c5038f0', '9fccbe2bf76b8198673651eb8dd821863a5d40a77cc4ff66548748c6296843f5', '2024-06-05 15:14:58.001', '20240605151457_init', NULL, NULL, '2024-06-05 15:14:57.551', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bankaccounts`
--
ALTER TABLE `bankaccounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `BankAccounts_user_id_key` (`user_id`),
  ADD UNIQUE KEY `BankAccounts_account_number_key` (`account_number`);

--
-- Indices de la tabla `bets`
--
ALTER TABLE `bets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Bets_bet_option_key` (`bet_option`),
  ADD KEY `Bets_event_id_fkey` (`event_id`),
  ADD KEY `Bets_team_id_fkey` (`team_id`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Countries_name_key` (`name`);

--
-- Indices de la tabla `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Events_sport_id_fkey` (`sport_id`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Permissions_type_key` (`type`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Roles_rol_name_key` (`rol_name`);

--
-- Indices de la tabla `rolespermissions`
--
ALTER TABLE `rolespermissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `RolesPermissions_role_id_permission_id_key` (`role_id`,`permission_id`),
  ADD KEY `RolesPermissions_permission_id_fkey` (`permission_id`);

--
-- Indices de la tabla `sports`
--
ALTER TABLE `sports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Sports_name_key` (`name`);

--
-- Indices de la tabla `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Teams_name_key` (`name`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Users_email_key` (`email`),
  ADD UNIQUE KEY `Users_username_key` (`username`),
  ADD UNIQUE KEY `Users_remember_token_key` (`remember_token`),
  ADD KEY `Users_role_id_fkey` (`role_id`),
  ADD KEY `Users_country_id_fkey` (`country_id`);

--
-- Indices de la tabla `userstransactions`
--
ALTER TABLE `userstransactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UsersTransactions_user_id_fkey` (`user_id`),
  ADD KEY `UsersTransactions_category_id_fkey` (`category_id`),
  ADD KEY `UsersTransactions_bet_id_fkey` (`bet_id`);

--
-- Indices de la tabla `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bankaccounts`
--
ALTER TABLE `bankaccounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `bets`
--
ALTER TABLE `bets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `rolespermissions`
--
ALTER TABLE `rolespermissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `sports`
--
ALTER TABLE `sports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `userstransactions`
--
ALTER TABLE `userstransactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bankaccounts`
--
ALTER TABLE `bankaccounts`
  ADD CONSTRAINT `BankAccounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `bets`
--
ALTER TABLE `bets`
  ADD CONSTRAINT `Bets_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Bets_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `Events_sport_id_fkey` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `rolespermissions`
--
ALTER TABLE `rolespermissions`
  ADD CONSTRAINT `RolesPermissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `RolesPermissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `Users_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `userstransactions`
--
ALTER TABLE `userstransactions`
  ADD CONSTRAINT `UsersTransactions_bet_id_fkey` FOREIGN KEY (`bet_id`) REFERENCES `bets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `UsersTransactions_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `UsersTransactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
