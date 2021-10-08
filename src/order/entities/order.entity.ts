import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderType {
  PERIODIC = 'periodic',
  DIRECT = 'direct',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderType,
    name: 'order_type',
  })
  orderType: OrderType;

  // when orderType = direct
  @Column({ type: 'date', nullable: true })
  deliveryDate: Date;

  @Column()
  customer: string;

  @Column()
  address: string;

  @Column()
  @CreateDateColumn()
  createdDate: Date;

  @Column()
  createdBy: string;

  @Column()
  @UpdateDateColumn()
  modifiedDate: Date;

  @Column({ nullable: true })
  modifiedBy: string;
}
