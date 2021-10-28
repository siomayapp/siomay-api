import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Variant } from '../../variant/entities/variant.entity';

export enum OrderType {
  PERIODIC = 'periodic',
  DIRECT = 'direct',
}

// export interface OrderVariantDetail {
//   id: number;
//   name: string;
// }

// export interface OrderVariant {
//   variant: OrderVariantDetail;
//   amount: number;
// }

export interface OrderVariant {
  variant: Variant;
  amount: number;
}

export interface OrderStatus {
  status: string;
  statusDate: Date;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  orderType: OrderType;

  // when orderType = direct
  @Column({ type: 'date', nullable: true })
  deliveryDate: Date;

  // when orderType = periodic
  @Column({ nullable: true })
  deliveryFreq: number; //in days

  @Column()
  customer: string;

  @Column()
  address: string;

  @Column({ type: 'json' })
  variants: OrderVariant[];

  @Column({ type: 'json', nullable: true })
  statuses: OrderStatus[];

  // when orderType = periodic
  @Column({ nullable: true })
  repeated: number; //number of repetition

  @Column({ nullable: true })
  lastRepeat: Date;

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
