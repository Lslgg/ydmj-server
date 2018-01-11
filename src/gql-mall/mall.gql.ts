var requireText = require('require-text');
var Business = requireText('./business/business.gql', require);
var Goods = requireText('./goods/goods.gql', require);
var GoodsType = requireText('./goodsType/goodsType.gql', require);
var Score = requireText('./score/score.gql', require);
var Answer = requireText('./answer/answer.gql', require);
var Advertm = requireText('./advertm/advertm.gql', require);

export const MallSchema = [
    Business,
    GoodsType,
    Goods,   
    Score, 
    Answer,
    Advertm,
];