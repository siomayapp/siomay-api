import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Variant {
  SIOMAY = 'siomay',
  TAHU = 'tahu',
}

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'box_name' })
  boxName: string;

  @Column({
    type: 'enum',
    enum: Variant,
  })
  variant: Variant;

  @Column()
  amount: number;

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
