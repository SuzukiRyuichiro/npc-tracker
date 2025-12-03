CREATE TABLE `rides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`started_at` integer NOT NULL,
	`ended_at` integer
);
