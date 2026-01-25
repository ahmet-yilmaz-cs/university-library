CREATE TYPE "public"."borrow_status_enum" AS ENUM('BORROWED', 'RETURNED');--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"author" varchar(255) NOT NULL,
	"genre" varchar(255) NOT NULL,
	"rating" integer NOT NULL,
	"total_copies" integer NOT NULL,
	"available_copies" integer NOT NULL,
	"cover_url" text NOT NULL,
	"cover_color" varchar(255) NOT NULL,
	"video_url" text NOT NULL,
	"summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"university_id" integer NOT NULL,
	"password" text NOT NULL,
	"university_card" text NOT NULL,
	"status" "status_enum" DEFAULT 'PENDING' NOT NULL,
	"role" "role_enum" DEFAULT 'USER' NOT NULL,
	"last_activity_date" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_university_id_unique" UNIQUE("university_id"),
	CONSTRAINT "users_university_card_unique" UNIQUE("university_card")
);
