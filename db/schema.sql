-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema simpleforum
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema simpleforum
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `simpleforum` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `simpleforum` ;

-- -----------------------------------------------------
-- Table `simpleforum`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simpleforum`.`user` (
  `username` VARCHAR(45) NOT NULL COMMENT '',
  `password` VARCHAR(45) NOT NULL COMMENT '',
  `firstname` VARCHAR(45) NULL COMMENT '',
  `lastname` VARCHAR(45) NULL COMMENT '',
  PRIMARY KEY (`username`)  COMMENT '')
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `simpleforum`.`thread`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simpleforum`.`thread` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `owner` VARCHAR(45) NOT NULL COMMENT '',
  `title` VARCHAR(255) NOT NULL COMMENT '',
  `ts_create` TIMESTAMP NOT NULL COMMENT '',
  `ts_last_message` DATETIME NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  INDEX `fk_thread_user_idx` (`owner` ASC)  COMMENT '',
  CONSTRAINT `fk_thread_user`
    FOREIGN KEY (`owner`)
    REFERENCES `simpleforum`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `simpleforum`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simpleforum`.`message` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '',
  `owner` VARCHAR(45) NOT NULL COMMENT '',
  `thread_id` INT UNSIGNED NOT NULL COMMENT '',
  `content` TEXT NOT NULL COMMENT '',
  `ts_create` TIMESTAMP NOT NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  INDEX `fk_message_user1_idx` (`owner` ASC)  COMMENT '',
  INDEX `fk_message_thread1_idx` (`thread_id` ASC)  COMMENT '',
  CONSTRAINT `fk_message_user1`
    FOREIGN KEY (`owner`)
    REFERENCES `simpleforum`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_thread1`
    FOREIGN KEY (`thread_id`)
    REFERENCES `simpleforum`.`thread` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `simpleforum`.`session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simpleforum`.`session` (
  `token` VARCHAR(45) NOT NULL COMMENT '',
  `user_username` VARCHAR(45) NOT NULL COMMENT '',
  `ts_to` TIMESTAMP NOT NULL COMMENT '',
  PRIMARY KEY (`token`, `user_username`)  COMMENT '',
  INDEX `fk_session_user1_idx` (`user_username` ASC)  COMMENT '',
  CONSTRAINT `fk_session_user1`
    FOREIGN KEY (`user_username`)
    REFERENCES `simpleforum`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `simpleforum`.`threadMember`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simpleforum`.`threadMember` (
  `thread_id` INT UNSIGNED NOT NULL COMMENT '',
  `member` VARCHAR(45) NOT NULL COMMENT '',
  `ts_create` TIMESTAMP NOT NULL COMMENT '',
  INDEX `fk_threadMember_user1_idx` (`member` ASC)  COMMENT '',
  INDEX `fk_threadMember_thread1_idx` (`thread_id` ASC)  COMMENT '',
  PRIMARY KEY (`member`, `thread_id`)  COMMENT '',
  CONSTRAINT `fk_threadMember_user1`
    FOREIGN KEY (`member`)
    REFERENCES `simpleforum`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_threadMember_thread1`
    FOREIGN KEY (`thread_id`)
    REFERENCES `simpleforum`.`thread` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
