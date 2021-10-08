import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderVariant {
  @PrimaryGeneratedColumn()
  id: number;
}
