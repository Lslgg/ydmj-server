import { Advert } from './advert/resolver';
import { Player } from './Player/resolver';
import { CardLog } from './cardLog/resolver';
import { Dealer } from './dealer/resolver';
import { Setting } from './setting/resolver';
import { Order } from './order/resolver';
import { CardRecord } from './cardRecord/resolver';

export class GameResolver{
    constructor(){

    }
    
    static Game:any={
        Advert: Advert.Advert,
    }

    static Query:any={
        ...Advert.Query,
        ...Player.Query,
        ...CardLog.Query,
        ...Dealer.Query,
        ...Setting.Query,
        ...Order.Query,
        ...CardRecord.Query,
    }

    static Mutation:any={
        ...Advert.Mutation,
        ...Player.Mutation,
        ...CardLog.Mutation,
        ...Dealer.Mutation,
        ...Setting.Mutation,
        ...Order.Mutation,
        ...CardRecord.Mutation,
    }
}