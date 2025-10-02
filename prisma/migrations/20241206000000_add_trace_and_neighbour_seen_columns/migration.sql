ALTER TABLE `nodes`
    ADD COLUMN `neighbours_first_seen_at` DATETIME(3) NULL,
    ADD COLUMN `traceroutes_first_seen_at` DATETIME(3) NULL,
    ADD COLUMN `traceroutes_updated_at` DATETIME(3) NULL;
