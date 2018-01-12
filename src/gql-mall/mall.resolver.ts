import { Business } from './business/resolver';
import { GoodsType } from './goodsType/resolver';
import { Goods } from './goods/resolver';
import { Transaction } from './transaction/resolver';
import { Answer } from './answer/resolver';
import { Advertm } from './advertm/resolver';

export class MallResolver {
    constructor() {

    }
    static Mall: any = {
        Business: Business.Business,
        GoodsType: GoodsType.GoodsType,
        Goods: Goods.Goods,
        // Transaction: Transaction.Transaction,
    }

    static Query: any = {
        ...Business.Query,
        ...GoodsType.Query,
        ...Goods.Query,
        ...Transaction.Query,
        ...Answer.Query,
        ...Advertm.Query,
    }

    static Mutation: any = {
        ...Business.Mutation,
        ...GoodsType.Mutation,
        ...Goods.Mutation,
        ...Transaction.Mutation,
        ...Answer.Mutation,
        ...Advertm.Mutation,
    }
}