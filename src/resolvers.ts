
import { Scalar } from "./common/scalar/scalar";
import { SystemResolver } from './gql-system';
import { GameResolver } from './gql-game';


export default {
	Query:{
		...GameResolver.Query,
		...SystemResolver.Query,
	},
	Mutation:{
		...GameResolver.Mutation,
		...SystemResolver.Mutation,
	},
	...SystemResolver.System,
	...GameResolver.Game,
	...Scalar.Scalar
};
