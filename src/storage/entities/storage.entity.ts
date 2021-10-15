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
