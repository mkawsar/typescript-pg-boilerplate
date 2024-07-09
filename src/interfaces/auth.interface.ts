import { IUser } from './user.interface';

export interface IAuth {
    user: IUser,
    token: string
};
