import { User } from '../modals/User';
import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';

export class UserService {

  // Auth
  async create(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new Error('Password is required');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    
    return UserRepository.createUser(userData);
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await UserRepository.findOneByEmail(email);
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return null;

    return user;
  }

  // User Management
  async findAll(): Promise<User[]> {
    return UserRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return UserRepository.findOneById(id);
  }

  async findByName(name: string): Promise<User[]> {
    return UserRepository.findByName(name);
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserRepository.findOneByEmail(email);
  }

  async update(id: number, updatedData: Partial<User>): Promise<User | null> {
    return UserRepository.updateUser(id, updatedData);
  }

  async delete(id: number): Promise<boolean> {
    return UserRepository.deleteUser(id);
  }
}