CREATE TABLE `vinylla`.`likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `postid` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `likePostid_idx` (`postid` ASC) VISIBLE,
  INDEX `likeUserid_idx` (`userid` ASC) VISIBLE,
  CONSTRAINT `likeUserid`
    FOREIGN KEY (`userid`)
    REFERENCES `vinylla`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `likePostid`
    FOREIGN KEY (`postid`)
    REFERENCES `vinylla`.`posts` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
