
import { Goods } from './goods/resolver';
import { Business } from './business/resolver';
import { GoodsType } from './goodsType/resolver';
import { Answer } from './answer/resolver';
import { Advertm } from './advertm/resolver';
import { Transaction } from './transaction/resolver';
import { UserBusiness } from './userBusiness/resolver';

export class MallResolver {

    constructor() {

    }
    static Mall: any = {
        Business: Business.Business,
        GoodsType: GoodsType.GoodsType,
        Goods: Goods.Goods,
        Advertm: Advertm.Advertm,
        Transaction: Transaction.Transaction,
        UserBusiness: UserBusiness.UserBusiness,
    }

    static Query: any = {
        ...Business.Query,
        ...GoodsType.Query,
        ...Goods.Query,
        ...Answer.Query,
        ...Advertm.Query,
        ...Transaction.Query,
        ...UserBusiness.Query,
    }

    static Mutation: any = {
        ...Business.Mutation,
        ...GoodsType.Mutation,
        ...Goods.Mutation,
        ...Answer.Mutation,
        ...Advertm.Mutation,
        ...Transaction.Mutation,
        ...UserBusiness.Mutation,
    }
}