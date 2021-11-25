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

  @Column()
  @CreateDateColumn()
  createdDate: Date;

  @Column({ nullable: true })
  createdBy: string;
}
