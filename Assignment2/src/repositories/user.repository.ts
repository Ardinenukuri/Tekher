import { AppDataSource } from '../config/database';
import { User } from '../modals/User';

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findByName(name: string): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('LOWER(user.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .getMany();
  },
  
  async findOneById(id: number): Promise<User | null> {
    return this.findOneBy({ id });
  },
  
  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.create(userData);
    return this.save(user);
  },
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.findOneById(id);
    if (!user) return null;
    
    Object.assign(user, userData);
    return this.save(user);
  },
  
  async deleteUser(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected ? result.affected > 0 : false;
  },

  async findOneByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  },
});