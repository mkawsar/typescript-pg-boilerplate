import { MigrationInterface, QueryRunner } from "typeorm";

export class Otp1711619733401 implements MigrationInterface {
    name = 'Otp1711619733401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "expiration"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "expiration" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "expiration"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "expiration" TIMESTAMP`);
    }

}
