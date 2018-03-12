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
        getTransaction(parent, { }, context): Promise<ITransactionModel[]> {
            if (!context.user) return null;
            return new Promise<ITransactionModel[]>((resolve, reject) => {
                if (context.session.isManger) {
                    TransactionSchema.find().then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(null); return; });
                    return;
                }
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    TransactionSchema.find({ business: { $in: businessIdList } }).then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(err); return; });
                });
            });
        },
        getTransactionById(parent, { id }, context): Promise<ITransactionModel> {
            if (!context.user) return null;
            return new Promise<ITransactionModel>((resolve, reject) => {
                TransactionSchema.findById(id).then(res => {
                    if (!res || res.userId != context.user._id) {
                        resolve(null);
                        return;
                    }                    
                    resolve(res);
                    return; 
                }).catch(err => resolve(null));
            });
        },

        getTransactionPage(parent, { pageIndex = 1, pageSize = 10, transaction }, context): Promise<ITransactionModel[]> {
            if (!context.user) return null;
            return new Promise<ITransactionModel[]>((resolve, reject) => {
                var skip = (pageIndex - 1) * pageSize;
                if (context.session.isManger) {
                    TransactionSchema.find(transaction).skip(skip).limit(pageSize).then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(err); return; });
                    return;
                }
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
                    }).catch(err => { resolve(err); return; });
                });
            });
        },
        getTransactionCount(parent, { transaction }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                if (context.session.isManger) {
                    var count = TransactionSchema.count(transaction);
                    resolve(count);
                    return;
                }
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
            });
        },
        doTransact(parent, { code }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                TransactionSchema.find({ code: code }).then(info => {
                    //没有该交易
                    if (!info || !info[0]) { resolve(-1); return; }

                    UserBusinessSchema.find({ businessId: info[0].businessId, userId: context.user._id }).then(ubinfo => {

                        //不是正确的兑换商家
                        if (!ubinfo || ubinfo.length < 0) { resolve(-1); return; }

                        //已兑换
                        if (info[0].state == 1) { resolve(1); return; }
                        var endTime = info[0].endTime.getTime();
                        var crTime = new Date().getTime();
                        //已过期
                        if (endTime < crTime) { resolve(2); return; }
                        info[0].state = 1;
                        var flag;
                        TransactionSchema.findByIdAndUpdate(info[0].id, info[0]).then(info => {
                            if (info) {
                                resolve(3);
                                return;
                            } else {
                                resolve(4);
                                return;
                            }
                        });
                    });
                });
            });
        },
    }

    static Mutation: any = {

        async saveTransaction(parent, { userId, businessId, goodsId }, context): Promise<Boolean> {
            if (!context.user) return null;
            var user = await UserSchema.findById(userId).then(res => {
                return res;
            });
            var goods = await GoodsSchema.findById(goodsId).then(res => {
                return res;
            });
            var business = await BusinessSchema.findById(businessId).then(res => {
                return res;
            });

            if (!user || !goods || !business) return false;
            if (goods.stock <= 0 || !goods.isValid || !business.isValid) return false;
            if (goods.businessId != business.id) return false;

            var flag;
            // -----------------------------------------------
            // 用户积分减少
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "扣除用户积分：" + goods.score }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;

            //todo
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "扣除用户积分成功" }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;

            // -----------------------------------------------
            // 商家积分增加，交易次数+1            
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商家信息" }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;

            var times = parseInt(business.times + '') + 1;
            var score = parseInt(business.score + '') + parseInt(goods.score + '');
            flag = BusinessSchema.findByIdAndUpdate(businessId, { times: times, score: score, }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;

            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商家信息成功，原交易次数：" + business.times + "原积分：" + business.score + "商品积分：" + goods.score }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;
            // -----------------------------------------------
            // 商品库存-1，交易次数+1                        
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商品信息" }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;

            times = parseInt(goods.times + '') + 1;
            var stock = parseInt(goods.stock + '') - 1;
            flag = GoodsSchema.findByIdAndUpdate(goodsId, { times: times, stock: stock, }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;

            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "修改商品信息成功！原交易次数：" + goods.times + "原库存:" + goods.stock }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;

            // -----------------------------------------------
            // 添加交易            
            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "添加交易信息" }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;

            var validTime = goods.validTime;
            var date: Date = new Date();
            var endTime = parseFloat(date.getTime() + '') + parseFloat(validTime + '');
            var endDate = new Date(endTime);
            var code = endTime.toString(16);
            var tinfo = await TransactionSchema.create({ code: code, goodsId: goodsId, businessId: businessId, userId: userId, state: 0, endTime: endDate }).then(info => {
                return info ? info.id : null;
            });
            if (!tinfo) return false;

            flag = await TransLogSchema.create({ userId: userId, businessId: businessId, goodsId: goodsId, info: "添加交易信息成功！交易id:" + tinfo }).then(info => {
                return info ? true : false;
            });
            if (!flag) return false;

            return true;
        }
    }
}