import GoodsSchema, { IGoodsModel } from './goods';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema, { IBusinessModel } from '../business/business';
import GoodsTypeSchema from '../goodsType/goodsType';
import UserBusinessSchema from '../userBusiness/userBusiness';
import { resolve } from 'url';
import { reject } from 'bluebird';
export class Goods {
    constructor() {

    }

    static Goods: any = {
        Business(model) {
            return BusinessSchema.findById(model.businessId);
        },
        GoodsType(model) {
            return GoodsTypeSchema.findById(model.goodsTypeId);
        }
    }

    static Query: any = {
        getGoods(parent, { }, context): Promise<Array<IGoodsModel>> {
            if (!context.user) return null;
            return new Promise<Array<IGoodsModel>>((resolve, reject) => {
                if (context.session.isManger) {
                    GoodsSchema.find().then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(null); });
                    return;
                }
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    GoodsSchema.find({ businessId: { $in: businessIdList } }).then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(null) });
                });

            });
        },
        getGoodsById(parent, { id }, context): Promise<IGoodsModel> {
            if (!context.user) return null;

            let promise = new Promise<IGoodsModel>((resolve, reject) => {
                GoodsSchema.findById(id).then(res => {
                    resolve(res);
                    return;
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getGoodsPage(parent, { pageIndex = 1, pageSize = 10, goods }, context): Promise<IGoodsModel[]> {
            if (!context.user) return null;
            return new Promise<IGoodsModel[]>((resolve, reject) => {
                var skip = (pageIndex - 1) * pageSize;

                if (context.session.isManger) {
                    GoodsSchema.find(goods).skip(skip).limit(pageSize).then((goodsInfo) => {
                        resolve(goodsInfo);
                        return;
                    });
                    return;
                }
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    if (!goods.businessId) {
                        goods.businessId = businessIdList;
                    }
                    GoodsSchema.find(goods).skip(skip).limit(pageSize).then((goodsInfo) => {
                        resolve(goodsInfo);
                        return;
                    });
                });
            });
        },

        getGoodsWhere(parent, { goods }, context): Promise<IGoodsModel[]> {
            if (!context.user) return null;
            return new Promise<IGoodsModel[]>((resolve, reject) => {
                var goodsInfo = GoodsSchema.find(goods);
                resolve(goodsInfo);
                return;
            });
        },

        getGoodsCount(parent, { goods }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                var count = GoodsSchema.count(goods);
                resolve(count);
                return;
            });
        },
    }

    static Mutation: any = {
        saveGoods(parent, { goods }, context): Promise<any> {
            if (!context.user) return null;
            return new Promise<any>((resolve, reject) => {
                if (context.session.isManger) {
                    if (goods.id && goods.id != "0") {
                        GoodsSchema.findByIdAndUpdate(goods.id, goods, (err, res) => {
                            Object.assign(res, goods);
                            resolve(res);
                            return;
                        });
                        return;
                    }
                    goods.times = 0;
                    GoodsSchema.create(goods).then((info) => {
                        resolve(info);
                        return;
                    });
                    return;
                }
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var flag = false;
                    for (var i = 0; i < info.length; i++) {
                        if (info[i].businessId == goods.businessId) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        resolve(null);
                        return;
                    }
                    if (goods.id && goods.id != "0") {
                        GoodsSchema.findByIdAndUpdate(goods.id, goods, (err, res) => {
                            Object.assign(res, goods);
                            resolve(res);
                            return;
                        });
                        return;
                    }
                    goods.times = 0;
                    GoodsSchema.create(goods).then((info) => {
                        resolve(info);
                        return;
                    });
                });
            });
        },
        deleteGoods(parent, { id }, context): Promise<Boolean> {
            if (!context.us) return null;
            return new Promise<Boolean>((resolve, reject) => {
                if (context.session.isManger) {
                    GoodsSchema.findByIdAndRemove(id, (err, res) => {
                        resolve(res != null);
                        return;
                    }).catch(err => reject(err));
                    return;
                }
                var flag = false;
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    GoodsSchema.findById(id, (err, res) => {
                        for (var i = 0; i < info.length; i++) {
                            if (info[i].businessId == res.businessId) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            resolve(false);
                            return;
                        }
                        GoodsSchema.findByIdAndRemove(id, (err, res) => {
                            resolve(res != null);
                            return;
                        }).catch(err => reject(err));
                    });
                });
            });
        }
    }
}