import { User } from './user/resolvers';
import { Role } from './role/resolvers';
import { Menu } from './menu/resolvers';
import { Power } from './power/resolvers';
import { Advert } from './advert/resolvers';
import { Profile } from './profile/resolvers';
import { Play } from './Play/resolvers';

import Date from './scalar/Date';
import RegExp from './scalar/RegExp';
import JsonObject from './scalar/JsonObject';

export default {
	Query: {
		...User.Query,
		...Role.Query,
		...Menu.Query,
		...Power.Query,
		...Advert.Query,
		...Profile.Query,
		...Play.Query,
	},
	Mutation: {
		...User.Mutation,
		...Role.Mutation,
		...Menu.Mutation,
		...Power.Mutation,
		...Advert.Mutation,
		...Profile.Mutation,
		...Play.Mutation,
	},
	User: User.User,
	Role: Role.Role,
	Advert: Advert.Advert,
	Date,RegExp,JsonObject
};
