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

        async getTransLog(parent, { }, context): Promise<Array<ITransLogModel>> {

            if (!context.user) return null;

            if (context.session.isManger) {
                return await TransLogSchema.find();
            }

            return null;
        },

        async getTransLogCount(parent, { transLog }, context): Promise<Number> {

            if (!context.user) return null;

            if (context.session.isManger) {
                return await TransLogSchema.count(transLog);
            }

            return null;
        }
    }

    static Mutation: any = {

        async saveTransLog(parent, { userId, businessId, goodsId, info }, context): Promise<ITransLogModel> {

            if (!context.user) return null;

            return await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: info });
        }

    }
}