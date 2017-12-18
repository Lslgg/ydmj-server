var { makeExecutableSchema } = require('graphql-tools');
var requireText = require('require-text');
import resolvers from './resolvers'

var Base = requireText('./base.gql', require);
var User = requireText('./user/user.gql', require);
var Role = requireText('./role/role.gql', require);
var Menu = requireText('./menu/menu.gql', require);
var Power = requireText('./power/power.gql', require);
var Advert = requireText('./advert/advert.gql', require);
var Profile = requireText('./profile/profile.gql', require);
var Player = requireText('./player/player.gql', require);
var CardLog = requireText('./cardLog/cardLog.gql', require);
var Dealer = requireText('./dealer/dealer.gql', require);
var Setting = requireText('./setting/setting.gql', require);


var typeDefs = [
  Base, User, Role, 
  Menu,Power,Advert,
  Profile,Player,CardLog,
  Dealer,Setting
];

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
  logger: { log: e => console.log(e) }
})


export default schema;