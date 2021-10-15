import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  out: number;

  @Column()
  @CreateDateColumn()
  createdDate: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column()
  @UpdateDateColumn()
  modifiedDate: Date;

  @Column({ nullable: true })
  modifiedBy: string;
}
