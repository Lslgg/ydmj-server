import { User } from './gql-system/user/resolver';
import { Role } from './gql-system/role/resolver';
import { Menu } from './gql-system/menu/resolver';
import { Power } from './gql-system/power/resolver';
import { Profile } from './gql-system/profile/resolver';
import { File } from './gql-system/file/resolver';

import { Advert } from './gql-game/advert/resolver';
import { Player } from './gql-game/Player/resolver';
import { CardLog } from './gql-game/cardLog/resolver';
import { Dealer } from './gql-game/dealer/resolver';
import { Setting } from './gql-game/setting/resolver';
import { Order } from './gql-game/order/resolver';
import { CardRecord } from './gql-game/cardRecord/resolver';

import { Business } from './gql-mall/business/resolver';


import Date from './common/scalar/Date';
import RegExp from './common/scalar/RegExp';
import JsonObject from './common/scalar/JsonObject';
import { GraphQLUpload } from 'apollo-upload-server'

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
		...Order.Query,
		...CardRecord.Query,
		...File.Query,
		...Business.Query
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
		...Order.Mutation,
		...CardRecord.Mutation,
		...File.Mutation,
		...Business.Mutation
	},
	User: User.User,
	Role: Role.Role,
	Advert: Advert.Advert,
	Power: Power.Power,
	Upload: GraphQLUpload,
	Date,
	RegExp,
	JsonObject,
};
