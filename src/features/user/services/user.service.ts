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

  async addFCMTokenToUser(userId: string, token: string) {
    if (!userId || !token) throw new Error('User ID or Token is missing');

    const result = await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { fcmTokens: token },
      },
      { new: true }
    );

    if (!result) throw new Error('User not found');
    return result;
  },

  async getUserFCMTokens(userId: string): Promise<string[]> {
    const user = await UserModel.findById(userId).select('fcmTokens');
    return user ? user.fcmTokens : [];
  },

  async removeStaleFCMTokens(userId: string, tokensRemove: string[]) {
    if (tokensRemove.length === 0) return;

    console.log(
      `Cleaning up ${tokensRemove.length} invalid tokens for user ${userId}...`
    );

    const result = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { fcmTokens: { $in: tokensRemove } },
      },
      { new: true }
    );

    if (!result)
      console.warn(
        `User ${userId} not found, but a token refresh request was made`
      );

    return result;
  },
};
