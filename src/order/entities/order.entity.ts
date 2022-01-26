import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';
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

export interface OrderVariantStorage {
  storage: string; //boxName
  pickedAmount: number;
}

export interface OrderVariant {
  variant: Variant;
  amount: number;
  isPicked: boolean;
  pickedFrom: OrderVariantStorage[];
  pickedAmount: number;
}

export type OrderStatusName = 'incoming' | 'processing' | 'sending' | 'finish';

export interface OrderStatus {
  status: OrderStatusName;
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

  @Column({ nullable: true })
  customer: string;

  // @Column({ nullable: true })
  @ManyToOne(() => Users, (user) => user.username, {
    nullable: true,
    onDelete: 'NO ACTION',
    eager: true,
  })
  distributor: Users;

  @Column({ default: null, nullable: true })
  phone: string;

  @Column({ default: null, nullable: true })
  address: string;

  @Column({ type: 'json' })
  variants: OrderVariant[];

  @Column({ type: 'json', nullable: true })
  statuses: OrderStatus[];

  @Column({ nullable: true })
  currentStatus: OrderStatusName;

  // when orderType = periodic
  @Column({ default: 0 })
  cycle: number; //

  @Column()
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdDate: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  modifiedDate: Date;

  @Column({ nullable: true })
  modifiedBy: string;
}
