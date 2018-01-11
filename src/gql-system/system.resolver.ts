import { User } from './user/resolver';
import { Role } from './role/resolver';
import { Menu } from './menu/resolver';
import { Power } from './power/resolver';
import { Profile } from './profile/resolver';
import { File } from './file/resolver';

export class SystemResolver {
    constructor() {

    }
    static System: any = {
        User: User.User,
        Role: Role.Role,
        Power: Power.Power,
    }

    static Query: any = {
        ...User.Query,
        ...Role.Query,
        ...Menu.Query,
        ...Power.Query,
        ...Profile.Query,
        ...File.Query,
    }

    static Mutation: any = {
        ...User.Mutation,
        ...Role.Mutation,
        ...Menu.Mutation,
        ...Power.Mutation,
        ...Profile.Mutation,
        ...File.Mutation,
    }
}