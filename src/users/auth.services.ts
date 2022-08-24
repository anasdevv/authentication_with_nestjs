import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(email: string, password: string): Promise<any> {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException(
        'Already a user is registered with this email',
      );
    }
    //Hash users password
    // generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //  join the hashed result and the salt togehter
    const result = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    const user = await this.usersService.create(email, result);
    // return the user
    return user;
  }
  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new BadRequestException('User not found with that email');
    }
    const [salt, storedHash] = user.password.split('.');
    console.log('salt', salt);
    console.log('hash', storedHash);
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new NotFoundException('Incorrect email or passwords');
    }
    return user;
  }
}
