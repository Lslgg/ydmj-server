var { makeExecutableSchema } = require('graphql-tools');
var requireText = require('require-text');
import resolvers from './resolvers'

var Base = requireText('./base.gql', require);
var User = requireText('./gql-system/user/user.gql', require);
var Role = requireText('./gql-system/role/role.gql', require);
var Menu = requireText('./gql-system/menu/menu.gql', require);
var Power = requireText('./gql-system/power/power.gql', require);
var Profile = requireText('./gql-system/profile/profile.gql', require);
var Advert = requireText('./gql-game/advert/advert.gql', require);
var Player = requireText('./gql-game/player/player.gql', require);
var CardLog = requireText('./gql-game/cardLog/cardLog.gql', require);
var Dealer = requireText('./gql-game/dealer/dealer.gql', require);
var Setting = requireText('./gql-game/setting/setting.gql', require);
var Order = requireText('./gql-game/order/order.gql', require);
var CardRecord = requireText('./gql-game/cardRecord/cardRecord.gql', require);

var typeDefs = [
  Base, User, Role, 
  Menu,Power,Advert,
  Profile,Player,CardLog,
  Dealer,Setting,Order,
  CardRecord
];

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
  logger: { log: e => console.log(e) }
})


export default schema;