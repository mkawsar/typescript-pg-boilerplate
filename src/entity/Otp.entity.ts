import { OtpType } from '../enums';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "otps" })
export class Otp {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    otp: string;

    @Column({ type: 'enum', enum: OtpType, nullable: true })
    status: string

    @Column({ nullable: true })
    expiration: Date

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
