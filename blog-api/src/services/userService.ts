import UserModel from '../models/user.model';

export async function findPaginated(page: number = 1, limit: number = 2) {
  const offset = (page - 1) * limit;
  
  // Get paginated users
  const users = await UserModel.findAllPaginated(offset, limit);
  
  // Get total count
  const total = await UserModel.count();
  
  return {
    rows: users,
    count: total
  };
}