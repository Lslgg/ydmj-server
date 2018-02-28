import TransactionSchema, { ITransactionModel } from './transaction';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import GoodsSchema from '../goods/goods';
import { User } from '../../gql-system/user/resolver';
import UserSchema from '../../gql-system/user/user';
import UserBusinessSchema from '../userBusiness/userBusiness';
import TransLogSchema from '../transLog/transLog';
export class Transaction {
    constructor() {

    }

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
        getTransaction(parent, { }, context): Promise<Array<ITransactionModel>> {
            if (!context.user) return null;
            return new Promise<Array<ITransactionModel>>((resolve, reject) => {                
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    TransactionSchema.find().then(res => {
                        resolve(res);
                        return;
                    }).catch(err => resolve(null));
                } else {
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var businessIdList: Array<String> = [];
                        for (var i = 0; i < info.length; i++) {
                            businessIdList.push(info[i].businessId);
                        }
                        TransactionSchema.find({ business: { $in: businessIdList } }).then(res => {
                            resolve(res);
                            return;
                        }).catch(err => { resolve(err); });
                    });
                }
            });
        },
        getTransactionById(parent, { id }, context): Promise<ITransactionModel> {
            return; 
            // if (!context.user) return null;

            // return new Promise<ITransactionModel>((resolve, reject) => {
            //     UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
            //         TransactionSchema.findById(id).then(res => {
            //             var flag = false;
            //             for (var i = 0; i < info.length; i++) {
            //                 if (info[i].businessId == res.businessId) {
            //                     flag = true;
            //                 }
            //             }
            //             if (flag) {
            //                 resolve(res);
            //             } else {
            //                 resolve(null);
            //             }
            //         }).catch(err => resolve(null));
            //     });
            // });
        },

        getTransactionPage(parent, { pageIndex = 1, pageSize = 10, transaction }, context): Promise<Array<ITransactionModel>> {
            if (!context.user) return null;
            return new Promise<Array<ITransactionModel>>((resolve, reject) => {
                var skip = (pageIndex - 1) * pageSize
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    TransactionSchema.find(transaction).skip(skip).limit(pageSize).then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(err); return;});
                } else {
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var businessIdList: Array<String> = [];
                        for (var i = 0; i < info.length; i++) {
                            businessIdList.push(info[i].businessId);
                        }
                        if (!transaction.businessId) {
                            transaction.businessId = businessIdList;
                        }
                        TransactionSchema.find({ business: { $in: businessIdList } }).skip(skip).limit(pageSize).then(res => {
                            resolve(res);
                            return;
                        }).catch(err => { resolve(err); return;});
                    });
                }
            });
        },
        getTransactionCount(parent, { transaction }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    var count = TransactionSchema.count(transaction);
                    resolve(count);
                    return;
                } else {
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var businessIdList: Array<String> = [];
                        for (var i = 0; i < info.length; i++) {
                            businessIdList.push(info[i].businessId);
                        }
                        if (!transaction.businessId) {
                            transaction.businessId = businessIdList;
                        }
                        var count = TransactionSchema.count(transaction);
                        resolve(count);
                        return;
                    });
                }
            });
        },
    }

    static Mutation: any = {
        async saveTransaction(parent, { userId, businessId, goodsId }, context): Promise<Boolean> {
            var user = await UserSchema.findById(userId).then(async res => {
                return res;
            });
            var goods = await GoodsSchema.findById(goodsId).then(async res => {
                return res;
            });
            var business = await BusinessSchema.findById(businessId).then(async res => {
                return res;
            });

            if (!user || !goods || !business) return false;
            if (goods.stock <= 0 || !goods.isValid || !business.isValid) return false;


            var flag;
            // -----------------------------------------------
            // 用户积分减少
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "扣除用户积分" }).then(async info => {
                return info ? true : false;
            });
            // 记录日志是否成功
            if (!flag) return false;
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "扣除用户积分成功" }).then(async info => {
                return info ? true : false;
            });
            // 记录日志是否成功
            if (!flag) return false;
            // -----------------------------------------------
            // 商家积分增加，交易次数+1            
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商家信息" }).then(async info => {
                return info ? true : false;
            });
            // 记录日志是否成功
            if (!flag) return false;
            var times = parseInt(business.times + '') + 1;
            var score = parseInt(business.score + '') + parseInt(goods.score + '');
            flag = BusinessSchema.findByIdAndUpdate(businessId, { times: times, score: score, }).then(async info => {
                return info ? true : false;
            });
            // 修改商家是否成功
            if (!flag) return false;

            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商家信息成功，原交易次数：" + business.times + "原积分：" + business.score + "商品积分：" + goods.score }).then(async info => {
                return info ? true : false;
            });
            // 记录日志是否成功
            if (!flag) return false;
            // -----------------------------------------------
            // 商品库存-1，交易次数+1            
            // 记录日志是否成功            
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商品信息" }).then(async info => {
                return info ? true : false;
            });
            if (!flag) return false;
            times = parseInt(goods.times + '') + 1;
            var stock = parseInt(goods.stock + '') - 1;
            flag = GoodsSchema.findByIdAndUpdate(goodsId, { times: times, stock: stock, }).then(async info => {
                return info ? true : false;
            });
            if (!flag) return false;
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商品信息成功！原交易次数：" + goods.times + "原库存:" + goods.stock }).then(async info => {
                return info ? true : false;
            });
            // 记录日志是否成功
            if (!flag) return false;
            // -----------------------------------------------
            // 添加交易            
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "添加交易信息" }).then(async info => {
                return info ? true : false;
            });
            if (!flag) return false;
            var validTime = goods.validTime;
            var date: Date = new Date();
            var endTime = parseFloat(date.getTime() + '') + parseFloat(validTime + '');
            var endDate = new Date(endTime);
            var code = endTime.toString(16);
            flag = await TransactionSchema.create({ code: code, goodsId: goodsId, businessId: businessId, userId: userId, state: 0, endTime: endDate }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "添加交易信息成功！" }).then(async info => {
                return info ? true : false;
            });
            if (!flag) return false;
            return true;
        }
    }
}