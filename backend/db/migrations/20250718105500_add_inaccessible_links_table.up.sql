-- Create the new table to store detailed information about each inaccessible link.
CREATE TABLE IF NOT EXISTS `inaccessible_links` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `url_id` bigint unsigned NOT NULL,
  `link` text NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_inaccessible_links_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_urls_inaccessible_links` FOREIGN KEY (`url_id`) REFERENCES `urls`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Remove the old, now-redundant integer count column from the main urls table.
ALTER TABLE `urls` DROP COLUMN `inaccessible_links`;
