import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order, OrderStatus } from '../../order/entities/order.entity';

@Entity()
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.id, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  order: Order;

  @Column('simple-json')
  orderStatus: OrderStatus;

  // when orderType = periodic
  @Column({ default: 0 })
  cycle: number; //

  @Column()
  @CreateDateColumn()
  createdDate: Date;

  @Column({ nullable: true })
  createdBy: string;
}
