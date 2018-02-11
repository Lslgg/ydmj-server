import TransactionSchema, { ITransactionModel } from './transaction';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import GoodsSchema from '../goods/goods';
import { User } from '../../gql-system/user/resolver';
import UserSchema from '../../gql-system/user/user';
import UserBusinessSchema from '../userBusiness/userBusiness';
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
            return new Promise<Array<ITransactionModel>>((resolve, reject) => {
                if (!context.user) return null;
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    TransactionSchema.find().then(res => {
                        resolve(res);
                    }).catch(err => resolve(null));
                } else {
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var businessIdList: Array<String> = [];
                        for (var i = 0; i < info.length; i++) {
                            businessIdList.push(info[i].businessId);
                        }
                        TransactionSchema.find({ business: { $in: businessIdList } }).then(res => {
                            resolve(res);
                        }).catch(err => { resolve(err); });
                    });
                }
            });
        },
        getTransactionById(parent, { id }, context): Promise<ITransactionModel> {
            if (!context.user) return null;

            return new Promise<ITransactionModel>((resolve, reject) => {
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    TransactionSchema.findById(id).then(res => {
                        var flag = false;
                        for (var i = 0; i < info.length; i++) {
                            if (info[i].businessId == res.businessId) {
                                flag = true;
                            }
                        }
                        if (flag) {
                            resolve(res);
                        } else {
                            resolve(null);
                        }
                    }).catch(err => resolve(null));
                });

            });
        },

        getTransactionPage(parent, { pageIndex = 1, pageSize = 10, transaction }, context): Promise<Array<ITransactionModel>> {
            if (!context.user) return null;
            return new Promise<Array<ITransactionModel>>((resolve, reject) => {
                var skip = (pageIndex - 1) * pageSize
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    TransactionSchema.find(transaction).skip(skip).limit(pageSize).then(res => {
                        resolve(res);
                    }).catch(err => { resolve(err); });
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
                        }).catch(err => { resolve(err); });
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
                    });
                }
            });
        },
        doTransact(parent, { code }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    TransactionSchema.findOne({ code: code }).then((trans) => {
                        if (!trans || !trans.code) {
                            resolve(-1);
                        }
                        var flag = false;
                        for (var i = 0; i < info.length; i++) {
                            if (info[i].businessId == trans.businessId) {
                                flag = true;
                            }
                        }
                        if (!flag)
                            resolve(4);
                        else if (trans.state == 1) {
                            resolve(1);
                        } else if (new Date(trans.endTime).getTime() < new Date().getTime()) {
                            resolve(2);
                        } else if (trans.state == 0) {
                            trans.state = 1;
                            TransactionSchema.findByIdAndUpdate(trans.id, trans, (err, res) => {
                                if (res) {
                                    resolve(3);
                                } else {
                                    resolve(4);
                                }
                            })
                        } else {
                            resolve(4);
                        }
                    });
                });
            });
        },
        isTransaction(parent, { userId, businessId, goodsId }, context) {
            if (!context.user) return null;
        }
    }

    static Mutation: any = {
        saveTranUser(parent, { }, context) {
            return new Promise<Boolean>(async (resolve, reject) => {
                resolve(true);
            });
        },
        saveTranBusiness(parent, {  }, context) {
            var user2 = { 
                name: "11111111",
                username: "11111111",
                email: "11111@qq.com",
                password: "1111111"
            }
            var user = {
                name: {name:"lslgg",age:12},
                username: "222222",
                email: "222222@qq.com",
                password: "222222"
            }
            return new Promise<Boolean>(async (resolve, reject) => {
                UserSchema.create(user2).then(result => {
                    resolve(false);
                    UserSchema.create(user).then(result => {
                        resolve(true);
                    }).catch(error=> reject(error))
                }).catch(error=> reject(error))
            });
        },
        saveTranGoods(parent, { userId, businessId, goodsId }, context) {

        }
    }
}