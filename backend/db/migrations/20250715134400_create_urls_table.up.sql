CREATE TABLE IF NOT EXISTS `urls` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `url` text NOT NULL,
  `title` text,
  `html_version` varchar(255) DEFAULT NULL,
  `headings_count` json DEFAULT NULL,
  `internal_links` bigint DEFAULT NULL,
  `external_links` bigint DEFAULT NULL,
  `inaccessible_links` bigint DEFAULT NULL,
  `has_login_form` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_urls_deleted_at` (`deleted_at`)
);
