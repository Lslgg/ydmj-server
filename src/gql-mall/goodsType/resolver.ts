import GoodsTypeSchema, { IGoodsTypeModel } from './goodsType';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import UserBusinessSchema from '../userBusiness/userBusiness';
import goods from '../goods/goods';
import { resolve } from 'path';
import { reject } from 'bluebird';

export class GoodsType {

    constructor() {

    }

    static GoodsType: any = {
        Business(model) {
            return BusinessSchema.findById(model.businessId);
        },
    }

    static Query: any = {
        getGoodsType(parent, { }, context): Promise<IGoodsTypeModel[]> {
            if (!context.user) return null;
            return new Promise<IGoodsTypeModel[]>((resolve, reject) => {
                // 管理员返回所有
                if (context.session.isManger) {
                    GoodsTypeSchema.find().then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(err); return; });
                    return;
                }
                // 商家返回自己的类别
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    GoodsTypeSchema.find({ businessId: { $in: businessIdList } }).then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(err); });
                });
            });
        },
        getGoodsTypeById(parent, { id }, context): Promise<IGoodsTypeModel> {
            if (!context.user) return null;

            let promise = new Promise<IGoodsTypeModel>((resolve, reject) => {
                GoodsTypeSchema.findById(id).then(res => {
                    resolve(res); return;
                }).catch(err => { resolve(null); return; });
            });
            return promise;
        },

        getGoodsTypePage(parent, { pageIndex = 1, pageSize = 10, goodsType }, context): Promise<IGoodsTypeModel[]> {
            if (!context.user) return null;
            return new Promise<IGoodsTypeModel[]>((resolve, reject) => {
                var skip = (pageIndex - 1) * pageSize;
                // 管理员返回所有
                if (context.session.isManger) {
                    GoodsTypeSchema.find(goodsType).skip(skip).limit(pageSize).then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(err); return; });
                    return;
                }
                // 商家返回自己的类别
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    if (!goodsType.businessId) {
                        goodsType.businessId = businessIdList;
                    }
                    GoodsTypeSchema.find(goodsType).skip(skip).limit(pageSize).then(res => {
                        resolve(res);
                        return;
                    }).catch(err => { resolve(err); return; });
                });
            });
        },
        getGoodsTypeWhere(parent, { goodsType }, context): Promise<IGoodsTypeModel[]> {
            if (!context.user) return null;
            return new Promise<IGoodsTypeModel[]>((resolve, reject) => {
                var goodsTypeInfo = GoodsTypeSchema.find(goodsType);
                resolve(goodsTypeInfo);
                return;
            });

        },
        getGoodsTypeByIdIn(parent, { id }, context): Promise<IGoodsTypeModel[]> {
            if (!context.user) return null;
            return new Promise<IGoodsTypeModel[]>((resolve, reject) => {
                var ninfo = id.split(',');
                var goodsTypeInfo = GoodsTypeSchema.find({ businessId: { $in: ninfo } });
                resolve(goodsTypeInfo);
                return;
            });
        },
        getGoodsTypeCount(parent, { goodsType }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                // 管理员统计所有
                if (context.session.isManger) {
                    var count = GoodsTypeSchema.count(goodsType);
                    resolve(count);
                    return;
                }
                // 商家统计自己的
                GoodsTypeSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    if (!goodsType.businessId) {
                        goodsType.businessId = businessIdList;
                    }
                    var count = GoodsTypeSchema.count(goodsType);
                    resolve(count);
                    return;
                });
            });
        },
    }

    static Mutation: any = {
        saveGoodsType(parent, { goodsType }, context): Promise<any> {
            if (!context.user) return null;

            return new Promise<any>((resolve, reject) => {
                if (context.session.isManger) {
                    if (goodsType.id && goodsType.id != "0") {
                        GoodsTypeSchema.findByIdAndUpdate(goodsType.id, goodsType, (err, res) => {
                            Object.assign(res, goodsType);
                            resolve(res);
                            return;
                        })
                        return;
                    }
                    GoodsTypeSchema.create(goodsType).then(info => {
                        resolve(info);
                        return;
                    });
                    return;
                }
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var flag = false;
                    for (var i = 0; i < info.length; i++) {
                        if (info[i].businessId == goodsType.businessId) {
                            flag = true;
                        }
                    }
                    // 判断该类别是否为该用户
                    if (!flag) {
                        resolve(info);
                        return;
                    }
                    if (goodsType.id && goodsType.id != "0") {
                        GoodsTypeSchema.findByIdAndUpdate(goodsType.id, goodsType, (err, res) => {
                            Object.assign(res, goodsType);
                            resolve(res);
                            return;
                        })
                        return;
                    }
                    GoodsTypeSchema.create(goodsType).then(info => {
                        resolve(info);
                        return;
                    });
                });
            });
        },
        deleteGoodsType(parent, { id }, context): Promise<Boolean> {
            if (!context.user) return null;
            return new Promise<Boolean>((resolve, reject) => {
                if (context.session.isManger) {
                    GoodsTypeSchema.findByIdAndRemove(id, (err, res) => {
                        resolve(res != null);
                        return;
                    }).catch(err => { resolve(err); return; });
                    return;
                }

                GoodsTypeSchema.findById(id).then((goodstype) => {
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var flag = false;
                        for (var i = 0; i < info.length; i++) {
                            if (info[i].businessId == goodstype.businessId) {
                                flag = true;
                            }
                        }
                        if (!flag) { resolve(false); return; }
                        GoodsTypeSchema.findByIdAndRemove(id, (err, res) => {
                            resolve(res != null);
                            return;
                        }).catch(err => { resolve(err); return; });
                    });
                });
            });
        }
    }
}