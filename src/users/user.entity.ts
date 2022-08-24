/* disable-eslint*/
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @AfterInsert()
  logInsert(): void {
    console.log(`Inserted user with id : ${this.id}`);
  }
  @AfterUpdate()
  logUpdate(): void {
    console.log(`Updated user with id ${this.id}`);
  }
  @AfterRemove()
  logRemove(): void {
    console.log(`Removed user with id : ${this.id}`);
  }
}
