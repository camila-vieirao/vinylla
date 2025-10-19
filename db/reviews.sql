CREATE TABLE `vinylla`.`reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reviewText` VARCHAR(45) NULL,
  `reviewRating` INT NOT NULL,
  `reviewAlbum` VARCHAR(200) NOT NULL,
  `userid` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `reviewUserid_idx` (`userid` ASC) VISIBLE,
  CONSTRAINT `reviewUserid`
    FOREIGN KEY (`userid`)
    REFERENCES `vinylla`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
