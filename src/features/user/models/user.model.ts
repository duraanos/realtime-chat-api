import mongoose from 'mongoose';
import validator from 'validator';
import { User as IUser } from '../types/user';

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: props => `${props.value} Invalid email address`,
      },
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function (v: string) {
          return validator.matches(v, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/);
        },
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      },
    },

    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },

    metadata: {
      type: Object,
      default: {},
    },
    refreshToken: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
