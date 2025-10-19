CREATE TABLE `vinylla`.`posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `postText` VARCHAR(200) NULL,
  `postImg` VARCHAR(100) NULL,
  `userid` INT NOT NULL,
  `postMention` VARCHAR(200) NULL,
  `createdAt` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `userid_idx` (`userid` ASC) VISIBLE,
  CONSTRAINT `userid`
    FOREIGN KEY (`userid`)
    REFERENCES `vinylla`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
