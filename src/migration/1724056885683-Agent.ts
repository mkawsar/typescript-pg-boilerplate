import { MigrationInterface, QueryRunner } from "typeorm";

export class Agent1724056885683 implements MigrationInterface {
    name = 'Agent1724056885683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "status" "public"."users_status_enum" NOT NULL DEFAULT 'inactive', "online" boolean NOT NULL DEFAULT false, "is_email_verified" boolean NOT NULL DEFAULT false, "is_profile_completed" boolean NOT NULL DEFAULT false, "last_login" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otps_status_enum" AS ENUM('forget', 'verification')`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "otp" character varying NOT NULL, "status" "public"."otps_status_enum", "expiration" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_3938bb24b38ad395af30230bde" UNIQUE ("user_id"), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."agents_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "agents" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "name" character varying NOT NULL, "status" "public"."agents_status_enum" NOT NULL DEFAULT 'inactive', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_57ee94c84a8e570e362af59dce" UNIQUE ("user_id"), CONSTRAINT "PK_9c653f28ae19c5884d5baf6a1d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otps" ADD CONSTRAINT "FK_3938bb24b38ad395af30230bded" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agents" ADD CONSTRAINT "FK_57ee94c84a8e570e362af59dcea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agents" DROP CONSTRAINT "FK_57ee94c84a8e570e362af59dcea"`);
        await queryRunner.query(`ALTER TABLE "otps" DROP CONSTRAINT "FK_3938bb24b38ad395af30230bded"`);
        await queryRunner.query(`DROP TABLE "agents"`);
        await queryRunner.query(`DROP TYPE "public"."agents_status_enum"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TYPE "public"."otps_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    }

}
