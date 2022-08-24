import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    /* without creating entity with create and saving direct object will not call hooks therefore its good practice to first create entity then call save or remove method rather then using insert delete */
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }
  async findOne(id: number) {
    if (!id) return null;
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Not found user');
    }
    return user;
  }
  find(email: string) {
    return this.repo.find({ where: { email } });
  }
  async update(id: number, attributes: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Can not find user with that id');
    }
    Object.assign(user, attributes);
    return this.repo.save(user);
  }
  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Can not find user with that id');
    }
    return this.repo.remove(user);
  }
}
