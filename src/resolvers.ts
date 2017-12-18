import { User } from './user/resolver';
import { Role } from './role/resolver';
import { Menu } from './menu/resolver';
import { Power } from './power/resolver';
import { Advert } from './advert/resolver';
import { Profile } from './profile/resolver';
import { Player } from './Player/resolver';
import { CardLog } from './cardLog/resolver';
import { Dealer } from './dealer/resolver';
import { Setting } from './setting/resolver';


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
		...Player.Query,
		...CardLog.Query,
		...Dealer.Query,
		...Setting.Query,
	},
	Mutation: {
		...User.Mutation,
		...Role.Mutation,
		...Menu.Mutation,
		...Power.Mutation,
		...Advert.Mutation,
		...Profile.Mutation,
		...Player.Mutation,
		...CardLog.Mutation,
		...Dealer.Mutation,
		...Setting.Mutation,
		
	},
	User: User.User,
	Role: Role.Role,
	Advert: Advert.Advert,
	Date,RegExp,JsonObject
};
