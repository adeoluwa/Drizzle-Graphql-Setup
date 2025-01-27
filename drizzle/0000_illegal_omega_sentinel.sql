CREATE TYPE "public"."roles" AS ENUM('artist', 'dj');--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar,
	"last_name" varchar,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" "roles" DEFAULT 'artist',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");