-- Relação N:M entre users e music_tags
DROP TABLE IF EXISTS `user_music_tags`;
CREATE TABLE `user_music_tags` (
  `userid` INT NOT NULL,
  `tagid`  INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`, `tagid`),
  KEY `umt_tag_idx` (`tagid`),
  CONSTRAINT `umt_user_fk`
    FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `umt_tag_fk`
    FOREIGN KEY (`tagid`) REFERENCES `music_tags` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
