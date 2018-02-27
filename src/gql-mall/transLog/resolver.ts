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
            return new Promise<Array<ITransLogModel>>((resolve, reject) => {
                if (!context.user) return null;
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    TransLogSchema.find().then(res => {
                        resolve(res);
                    }).catch(err => resolve(null));
                } else {
                    resolve(null);
                }
            });
        },
        getTransLogCount(parent, { transLog }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    var count = TransLogSchema.count(transLog);
                    resolve(count);
                } else {
                    resolve(null);
                }
            });
        },
    }

    static Mutation: any = {
        saveTransLog(userId: String, businessId: String, goodsId: String, info: String): Promise<ITransLogModel> {
            return new Promise((resolve, reject) => {
                TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: info }).then((info) => {
                    resolve(info);
                });
            });

        }
    }
}