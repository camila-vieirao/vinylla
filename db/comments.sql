CREATE TABLE `vinylla`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `commentText` VARCHAR(200) NOT NULL,
  `createdAt` DATETIME NULL,
  `userid` INT NOT NULL,
  `postid` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `postid_idx` (`postid` ASC) VISIBLE,
  INDEX `commentUserid_idx` (`userid` ASC) VISIBLE,
  CONSTRAINT `commentUserid`
    FOREIGN KEY (`userid`)
    REFERENCES `vinylla`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `postid`
    FOREIGN KEY (`postid`)
    REFERENCES `vinylla`.`posts` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
