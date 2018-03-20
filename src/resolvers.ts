
import { Scalar } from "./common/scalar/scalar";
import { SystemResolver } from './gql-system';
import { GameResolver } from './gql-game';
import { MallResolver } from './gql-mall';
import { Business } from "./gql-mall/business/resolver";


export default {
	Query:{
		...GameResolver.Query,
		...SystemResolver.Query,
		...MallResolver.Query,
	},
	Mutation:{
		...GameResolver.Mutation,
		...SystemResolver.Mutation,
		...MallResolver.Mutation,
	},
	...SystemResolver.System,
	...GameResolver.Game,
	...MallResolver.Mall,
	...Scalar.Scalar
};
