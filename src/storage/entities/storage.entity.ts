import { Variant } from '../../variant/entities/variant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// export enum Variant {
//   SIOMAY = 'siomay',
//   TAHU = 'tahu',
// }

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'box_name', unique: true })
  boxName: string;

  // @Column({
  //   type: 'enum',
  //   enum: Variant,
  // })
  // variant: Variant;

  @ManyToOne(() => Variant, (variant) => variant.id, {
    onDelete: 'RESTRICT',
    cascade: true,
    eager: true,
  })
  variant: Variant;

  @Column()
  amount: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  filledDate: Date;

  @Column({ nullable: true })
  filledBy: string;

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
