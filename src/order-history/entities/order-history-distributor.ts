import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Order,
  OrderStatus,
  OrderStatusName,
} from '../../order/entities/order.entity';

@Entity()
export class OrderHistoryDistributor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.id, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  order: Order;

  @Column({ type: 'json', nullable: true })
  statuses: OrderStatus[];

  @Column({ nullable: true })
  currentStatus: OrderStatusName;

  @Column({ type: 'timestamp with time zone', nullable: true, unique: true })
  deliveryDate: Date;

  @Column({ default: 0 })
  cycle: number;

  @Column()
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdDate: Date;

  @Column()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  modifiedDate: Date;
}
