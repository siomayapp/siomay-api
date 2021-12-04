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
  isPicked: boolean;
}

export interface OrderStatus {
  status: 'incoming' | 'processing' | 'sending' | 'finish';
  statusDate: Date;
  actor: string;
  note: string | null;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number; //order number

  @Column({ unique: true })
  orderNumber: string;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  orderType: OrderType;

  // when orderType = periodic
  @Column({ nullable: true })
  deliveryFreq: number; //in days

  @Column({ type: 'timestamp with time zone', nullable: true })
  deliveryDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  nextDeliveryDate: Date;

  @Column()
  customer: string;

  @Column()
  address: string;

  @Column({ type: 'json' })
  variants: OrderVariant[];

  @Column({ type: 'json', nullable: true })
  statuses: OrderStatus[];

  // when orderType = periodic
  @Column({ default: 0 })
  cycle: number; //

  @Column({ nullable: true })
  lastCycle: Date;

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
