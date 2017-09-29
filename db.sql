-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql.ares.uy
-- Generation Time: Sep 29, 2017 at 07:35 AM
-- Server version: 5.6.34-log
-- PHP Version: 7.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartlife`
--
CREATE DATABASE IF NOT EXISTS `smartlife` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `smartlife`;

-- --------------------------------------------------------

--
-- Table structure for table `datos`
--

DROP TABLE IF EXISTS `datos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datos` (
  `iddatos` int(11) NOT NULL AUTO_INCREMENT,
  `lugar` varchar(255) NOT NULL,
  `factura` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `ci` varchar(45) NOT NULL,
  `celular` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `chances` int(11) NOT NULL,
  PRIMARY KEY (`iddatos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

-- --------------------------------------------------------
--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `idproductos` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `codigo` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `chances` int(11) NOT NULL,
  `iddatos` int(11) NOT NULL,
  PRIMARY KEY (`idproductos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

-- --------------------------------------------------------
--
-- Table structure for table `sorteo`
--

DROP TABLE IF EXISTS `sorteo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sorteo` (
  `idsorteo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `ci` varchar(45) NOT NULL,
  `celular` varchar(45) NOT NULL,
  `iddatos` int(11) NOT NULL,
  PRIMARY KEY (`idsorteo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `datos_productos` FOREIGN KEY (`iddatos`) REFERENCES `datos` (`iddatos`);
COMMIT;

--
-- Constraints for table `sorteo`
--
ALTER TABLE `sorteo`
  ADD CONSTRAINT `datos_sorteo` FOREIGN KEY (`iddatos`) REFERENCES `datos` (`iddatos`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
