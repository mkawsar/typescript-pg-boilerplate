import { MigrationInterface, QueryRunner } from "typeorm";

export class User1711619459725 implements MigrationInterface {
    name = 'User1711619459725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "status" "public"."users_status_enum" NOT NULL DEFAULT 'inactive', "online" boolean NOT NULL DEFAULT false, "is_email_verified" boolean NOT NULL DEFAULT false, "is_profile_completed" boolean NOT NULL DEFAULT false, "last_login" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otps_status_enum" AS ENUM('forget', 'verification')`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "otp" character varying NOT NULL, "status" "public"."otps_status_enum", "expiration" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_3938bb24b38ad395af30230bde" UNIQUE ("user_id"), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otps" ADD CONSTRAINT "FK_3938bb24b38ad395af30230bded" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP CONSTRAINT "FK_3938bb24b38ad395af30230bded"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TYPE "public"."otps_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    }

}
