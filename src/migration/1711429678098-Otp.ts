import { MigrationInterface, QueryRunner } from "typeorm";

export class Otp1711429678098 implements MigrationInterface {
    name = 'Otp1711429678098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."otps_status_enum" AS ENUM('forget', 'verification')`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "otp" character varying NOT NULL, "status" "public"."otps_status_enum", "expiration" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TYPE "public"."otps_status_enum"`);
    }

}
