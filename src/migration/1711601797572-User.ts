import { MigrationInterface, QueryRunner } from "typeorm";

export class User1711601797572 implements MigrationInterface {
    name = 'User1711601797572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_profile_completed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_profile_completed"`);
    }

}
