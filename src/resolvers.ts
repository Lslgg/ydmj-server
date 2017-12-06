import { UserResolver } from './user/resolvers';
import { RoleResolver } from './role/resolvers';
import { MenuResolver } from './menu/resolvers';
import { PowerResolver } from './power/resolvers';
import { AdvertResolver } from './advert/resolvers';

import Date from './scalar/Date';
import RegExp from './scalar/RegExp';
import JsonObject from './scalar/JsonObject';


export default {
	Query: {
		...UserResolver.Query,
		...RoleResolver.Query,
		...MenuResolver.Query,
		...PowerResolver.Query,
		...AdvertResolver.Query
	},
	Mutation: {
		...UserResolver.Mutation,
		...RoleResolver.Mutation,
		...MenuResolver.Mutation,
		...PowerResolver.Mutation,
		...AdvertResolver.Mutation
	},
	User: UserResolver.User,
	Role: RoleResolver.Role,
	Advert: AdvertResolver.Advert,
	Date,RegExp,JsonObject
};
