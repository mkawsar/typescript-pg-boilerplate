import { Status } from '../enums';
import { User } from './User.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'agents' })
export class Agent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    uuid: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: Status, default: Status.INACTIVE })
    status: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
