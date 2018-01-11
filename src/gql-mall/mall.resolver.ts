import { Business } from './business/resolver';
import { GoodsType } from './goodsType/resolver';
import { Goods } from './goods/resolver';
import { Score } from './score/resolver';
import { Answer } from './answer/resolver';
import { Advertm } from './advertm/resolver';

export class MallResolver {
    constructor() {

    }
    static Mall: any = {
        Business: Business.Business,
        GoodsType: GoodsType.GoodsType,
        Goods: Goods.Goods,
        Score: Score.Score,
    }

    static Query: any = {
        ...Business.Query,
        ...GoodsType.Query,
        ...Goods.Query,
        ...Score.Query,
        ...Answer.Query,
        ...Advertm.Query,
    }

    static Mutation: any = {
        ...Business.Mutation,
        ...GoodsType.Mutation,
        ...Goods.Mutation,
        ...Score.Mutation,
        ...Answer.Mutation,
        ...Advertm.Mutation,
    }
}