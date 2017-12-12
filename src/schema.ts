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
var Play = requireText('./play/play.gql', require);

var typeDefs = [Base, User, Role, Menu,Power,Advert,Profile,Play];

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
  logger: { log: e => console.log(e) }
})


export default schema;