import TransLogSchema, { ITransLogModel } from './transLog';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import GoodsSchema from '../goods/goods';
import UserSchema from '../../gql-system/user/user';
import UserBusinessSchema from '../userBusiness/userBusiness';
import { resolve, reject } from 'bluebird';
export class TransLog {
    constructor() {

    }

    static TransLog: any = {
        Business(model) {
            return BusinessSchema.findById(model.businessId);
        },
        Goods(model) {
            return GoodsSchema.findById(model.goodsId);
        },
        User(model) {
            return UserSchema.findById(model.userId);
        },
    }

    static Query: any = {
        getTransLog(parent, { }, context): Promise<Array<ITransLogModel>> {
            if (!context.user) return null;
            return new Promise<Array<ITransLogModel>>((resolve, reject) => {
                if (context.session.isManger) {
                    TransLogSchema.find().then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(null); return; });
                    return;
                }
                resolve(null);
                return;
            });
        },
        getTransLogCount(parent, { transLog }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                if (context.session.isManger) {
                    var count = TransLogSchema.count(transLog);
                    resolve(count);
                    return;
                }
                resolve(null);
                return;
            });
        },
    }

    static Mutation: any = {
        saveTransLog(parent, { userId, businessId, goodsId, info }, context): Promise<ITransLogModel> {
            if (!context.user) return null;
            return new Promise((resolve, reject) => {
                TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: info }).then((info) => {
                    resolve(info);
                    return;
                });
            });

        }
    }
}