var requireText = require('require-text');
var Advert = requireText('./advert/advert.gql', require);
var Player = requireText('./player/player.gql', require);
var CardLog = requireText('./cardLog/cardLog.gql', require);
var Dealer = requireText('./dealer/dealer.gql', require);
var Setting = requireText('./setting/setting.gql', require);
var Order = requireText('./order/order.gql', require);
var CardRecord = requireText('./cardRecord/cardRecord.gql', require);

export const GameSchema= [
    Advert,
    Player,
    CardLog,
    Dealer,
    Setting,
    Order,
    CardRecord
];