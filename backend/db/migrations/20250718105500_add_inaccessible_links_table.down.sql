-- Add the old integer count column back to the urls table.
ALTER TABLE `urls` ADD COLUMN `inaccessible_links` bigint DEFAULT NULL;

-- Drop the table for inaccessible links.
DROP TABLE IF EXISTS `inaccessible_links`;
