CREATE TABLE `vinylla`.`topfavorites` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstAlbum` VARCHAR(200) NULL,
  `secondAlbum` VARCHAR(200) NULL,
  `thirdAlbum` VARCHAR(200) NULL,
  `userid` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `topFavoritesUserid_idx` (`userid` ASC) VISIBLE,
  CONSTRAINT `topFavoritesUserid`
    FOREIGN KEY (`userid`)
    REFERENCES `vinylla`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
