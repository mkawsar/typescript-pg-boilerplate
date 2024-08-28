import { OtpType } from '../enums';
import { User } from './User.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: "otps" })
export class Otp {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, {cascade: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: false })
    otp: string;

    @Column({ type: 'enum', enum: OtpType, nullable: true })
    status: string;

    @Column({ type: 'timestamptz', nullable: true })
    expiration: Date

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
