import {Status} from '../enums';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'agents' })
export class Agent {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    uuid: string

    @Column()
    name: string

    @Column({ type: 'enum', enum: Status, default: Status.INACTIVE })
    status: string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
