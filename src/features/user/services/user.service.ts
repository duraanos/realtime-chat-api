import { UserModel } from '../models/user.model';
import { User } from '../types/user';

export const userService = {
  async getAllUsers() {
    return UserModel.find();
  },

  async getUserById(userId: string) {
    const user = UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    return user;
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const user = UserModel.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) throw new Error('User not found');

    return user;
  },

  async deleteUser(userId: string) {
    const user = UserModel.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');

    return { message: 'User deleted successfully' };
  },
};
