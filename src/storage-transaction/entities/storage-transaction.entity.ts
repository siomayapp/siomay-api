import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { Storage } from '../../storage/entities/storage.entity';

export type StorageTransactionType = 'in' | 'out';

@Entity()
export class StorageTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', type: 'enum', enum: ['in', 'out'] })
  transactionType: StorageTransactionType;

  // @ManyToOne(() => Storage, (box) => box.boxName, { onDelete: 'SET NULL' })
  @Column()
  box: string;

  @Column()
  variant: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  orderId: number;

  @Column()
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdDate: Date;

  @Column({ nullable: true })
  createdBy: string;
}
