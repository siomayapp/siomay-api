import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Storage } from '../../storage/entities/storage.entity';

export type StorageTransactionType = 'in' | 'out';

@Entity()
export class StorageTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', type: 'enum', enum: ['in', 'out'] })
  transactionType: StorageTransactionType;

  @ManyToOne(() => Storage, (box) => box.boxName, { onDelete: 'NO ACTION' })
  box: Storage;

  @Column()
  variant: string;

  @Column()
  amount: number;

  @Column()
  @CreateDateColumn()
  createdDate: Date;

  @Column({ nullable: true })
  createdBy: string;
}
