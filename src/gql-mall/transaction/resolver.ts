import TransactionSchema, { ITransactionModel } from './transaction';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import GoodsSchema from '../goods/goods';
import { User } from '../../gql-system/user/resolver';
import UserSchema from '../../gql-system/user/user';
import UserBusinessSchema from '../userBusiness/userBusiness';
import TransLogSchema from '../transLog/transLog';
import { resolve } from 'dns';
import { reject } from 'bluebird';
export class Transaction {

    constructor() { }

    static Transaction: any = {
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

        async getTransaction(parent, { }, context): Promise<ITransactionModel[]> {

            if (!context.user) return null;

            if (context.session.isManger) {
                return await TransactionSchema.find();
            }

            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            return await TransactionSchema.find({ business: { $in: businessIdList } });
        },

        async getTransactionById(parent, { id }, context): Promise<ITransactionModel> {

            if (!context.user) return null;

            let res = await TransactionSchema.findById(id);

            if (!res || res.userId != context.user._id) {
                return null;
            }

            return res;
        },

        async getTransactionPage(parent, { pageIndex = 1, pageSize = 10, transaction }, context): Promise<ITransactionModel[]> {

            if (!context.user) return null;


            var skip = (pageIndex - 1) * pageSize;

            if (context.session.isManger) {
                return await TransactionSchema.find(transaction).skip(skip).limit(pageSize);
            }

            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            if (!transaction.businessId) {
                transaction.businessId = businessIdList;
            }
            return await TransactionSchema.find(transaction).skip(skip).limit(pageSize);
        },

        async getTransactionPageM(parent, { pageIndex = 1, pageSize = 10, transaction }, context): Promise<ITransactionModel[]> {

            if (!context.user) return null;
            transaction.userId = context.user._id;
            var skip = (pageIndex - 1) * pageSize;
            return await TransactionSchema.find(transaction).skip(skip).limit(pageSize);
        },

        async getTransactionCount(parent, { transaction }, context): Promise<Number> {

            if (!context.user) return null;

            if (context.session.isManger) {
                return await TransactionSchema.count(transaction);
            }

            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            if (!transaction.businessId) {
                transaction.businessId = businessIdList;
            }
            return await TransactionSchema.count(transaction);
        },

        async doTransact(parent, { code }, context): Promise<Number> {

            if (!context.user) return null;

            let trans = TransactionSchema.find({ code: code });
            //没有该交易
            if (!trans || !trans[0]) { return -1; }

            let ubinfo = await UserBusinessSchema.find({ businessId: trans[0].businessId, userId: context.user._id });

            //不是正确的兑换商家
            if (!ubinfo || ubinfo.length < 0) { return -1; }

            //已兑换
            if (trans[0].state == 1) { return 1; }

            var endTime = trans[0].endTime.getTime();
            var crTime = new Date().getTime();

            //已过期
            if (endTime < crTime) { return 2; }

            trans[0].state = 1;
            let result = TransactionSchema.findByIdAndUpdate(trans[0].id, trans[0]);
            return result ? 3 : 4;
        }
    }

    static Mutation: any = {

        async saveTransaction(parent, { userId, businessId, goodsId }, context): Promise<Boolean> {
            if (!context.user) return null;
            var user = await UserSchema.findById(userId);

            var goods = await GoodsSchema.findById(goodsId);

            var business = await BusinessSchema.findById(businessId);

            if (!user || !goods || !business) return false;

            if (goods.stock <= 0 || !goods.isValid || !business.isValid) return false;

            if (goods.businessId != business.id) return false;

            var flag;
            // -----------------------------------------------
            // 用户积分减少
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "扣除用户积分：" + goods.score });
            if (!flag) return false;

            //todo
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "扣除用户积分成功" });
            if (!flag) return false;

            // -----------------------------------------------
            // 商家积分增加，交易次数+1            
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商家信息" });
            if (!flag) return false;

            var times = parseInt(business.times + '') + 1;
            var score = parseInt(business.score + '') + parseInt(goods.score + '');
            flag = BusinessSchema.findByIdAndUpdate(businessId, { times: times, score: score, });
            if (!flag) return false;

            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商家信息成功，原交易次数：" + business.times + "原积分：" + business.score + "商品积分：" + goods.score });
            if (!flag) return false;
            // -----------------------------------------------
            // 商品库存-1，交易次数+1                        
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商品信息" });
            if (!flag) return false;

            times = parseInt(goods.times + '') + 1;
            var stock = parseInt(goods.stock + '') - 1;
            flag = GoodsSchema.findByIdAndUpdate(goodsId, { times: times, stock: stock, });
            if (!flag) return false;

            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商品信息成功！原交易次数：" + goods.times + "原库存:" + goods.stock });
            if (!flag) return false;

            // -----------------------------------------------
            // 添加交易            
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "添加交易信息" });
            if (!flag) return false;

            var validTime = goods.validTime;
            var date: Date = new Date();
            var endTime = parseFloat(date.getTime() + '') + parseFloat(validTime + '');
            var endDate = new Date(endTime);
            var code = endTime.toString(16);
            var tinfo = await TransactionSchema.create({ code: code, goodsId: goodsId, businessId: businessId, userId: userId, state: 0, endTime: endDate });
            if (!tinfo) return false;

            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "添加交易信息成功！交易id:" + tinfo });
            if (!flag) return false;

            return true;
        }
    }
}