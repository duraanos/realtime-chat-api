import { NewUser } from '../../user/models/user.model';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken } from '../utils/jwt';

export const authService = {
  async register(userName: string, email: string, password: string) {
    const existing = await NewUser.findOne({ email });

    if (existing) throw new Error('User already exists');

    const hashed = await hashPassword(password);
    const newUser = await NewUser.create({
      username: userName,
      email,
      password: hashed,
    });

    return { user: newUser };
  },

  async login(email: string, password: string) {
    const user = await NewUser.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Incorrect Password');

    const payload = { id: user._id.toString(), typ: 'access' };
    return { user: user, token: generateAccessToken(payload) };
  },
};
