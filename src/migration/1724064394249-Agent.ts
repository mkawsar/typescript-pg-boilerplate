import { MigrationInterface, QueryRunner } from "typeorm";

export class Agent1724064394249 implements MigrationInterface {
    name = 'Agent1724064394249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."agents_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "agents" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "name" character varying NOT NULL, "status" "public"."agents_status_enum" NOT NULL DEFAULT 'inactive', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_57ee94c84a8e570e362af59dce" UNIQUE ("user_id"), CONSTRAINT "PK_9c653f28ae19c5884d5baf6a1d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "agents" ADD CONSTRAINT "FK_57ee94c84a8e570e362af59dcea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agents" DROP CONSTRAINT "FK_57ee94c84a8e570e362af59dcea"`);
        await queryRunner.query(`DROP TABLE "agents"`);
        await queryRunner.query(`DROP TYPE "public"."agents_status_enum"`);
    }

}
