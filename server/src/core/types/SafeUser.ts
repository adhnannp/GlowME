import { IUser } from '../../models/User';
export type SafeUser = Omit<IUser,'password'>;