CREATE TABLE `vinylla`.`relationships` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `followerUserid` INT NOT NULL,
  `followedUserid` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `followerUser_idx` (`followerUserid` ASC) VISIBLE,
  INDEX `followedUser_idx` (`followedUserid` ASC) VISIBLE,
  CONSTRAINT `followerUser`
    FOREIGN KEY (`followerUserid`)
    REFERENCES `vinylla`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `followedUser`
    FOREIGN KEY (`followedUserid`)
    REFERENCES `vinylla`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
