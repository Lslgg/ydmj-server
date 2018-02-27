import GoodsTypeSchema, { IGoodsTypeModel } from './goodsType';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import UserBusinessSchema from '../userBusiness/userBusiness';
import goods from '../goods/goods';

export class GoodsType {

    constructor() {

    }

    static GoodsType: any = {
        Business(model) {
            return BusinessSchema.findById(model.businessId);
        },
    }

    static Query: any = {
        getGoodsType(parent, { }, context): Promise<Array<IGoodsTypeModel>> {
            return new Promise<Array<IGoodsTypeModel>>((resolve, reject) => {
                if (!context.user) resolve(null);
                // 管理员返回所有
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    GoodsTypeSchema.find().then(res => {
                        resolve(res);
                    }).catch(err => { resolve(err); });
                } else {
                    // 商家返回自己的类别
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var businessIdList: Array<String> = [];
                        for (var i = 0; i < info.length; i++) {
                            businessIdList.push(info[i].businessId);
                        }
                        GoodsTypeSchema.find({ businessId: { $in: businessIdList } }).then(res => {
                            resolve(res);
                        }).catch(err => { resolve(err); });
                    });
                }
            });
        },
        getGoodsTypeById(parent, { id }, context): Promise<IGoodsTypeModel> {
            if (!context.user) return null;

            let promise = new Promise<IGoodsTypeModel>((resolve, reject) => {
                GoodsTypeSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getGoodsTypePage(parent, { pageIndex = 1, pageSize = 10, goodsType }, context) {
            return new Promise<Array<IGoodsTypeModel>>((resolve, reject) => {
                if (!context.user) resolve(null);
                var skip = (pageIndex - 1) * pageSize;
                // 管理员返回所有
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    GoodsTypeSchema.find(goodsType).skip(skip).limit(pageSize).then(res => {
                        resolve(res);
                    }).catch(err => { resolve(err); });
                } else {
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
                        }).catch(err => { resolve(err); });
                    });
                }
            });
        },
        
        getGoodsTypeWhere(parent, { goodsType }, context) {
            // if (!context.user) return null;
            var goodsTypeInfo = GoodsTypeSchema.find(goodsType);
            return goodsTypeInfo;
        },
        getGoodsTypeByIdIn(parent, { id }, context) {
            // if (!context.user) return null;                        
            var ninfo = id.split(',');                        
            var goodsTypeInfo = GoodsTypeSchema.find({businessId:{$in:ninfo}});
            return goodsTypeInfo;
        },

        getGoodsTypeCount(parent, { goodsType }, context): Promise<Number> {
            return new Promise<Number>((resolve, reject) => {
                if (!context.user) {
                    resolve(null); return;
                };
                // 管理员统计所有
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    var count = GoodsTypeSchema.count(goodsType);
                    resolve(count);
                } else {
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
                    });
                }
            });

        },
    }

    static Mutation: any = {
        saveGoodsType(parent, { goodsType }, context): Promise<any> {
            if (!context.user) return null;

            return new Promise<any>((resolve, reject) => {
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    if (goodsType.id && goodsType.id != "0") {
                        GoodsTypeSchema.findByIdAndUpdate(goodsType.id, goodsType, (err, res) => {
                            Object.assign(res, goodsType);
                            resolve(res);
                            return;
                        })
                    } else {
                        GoodsTypeSchema.create(goodsType).then(info => {
                            resolve(info);
                            return;
                        });
                    }
                } else {
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var flag = false;
                        for (var i = 0; i < info.length; i++) {
                            if (info[i].businessId == goodsType.businessId) {
                                flag = true;
                            }
                        }
                        // 判断该类别是否为该用户
                        if (flag) {
                            if (goodsType.id && goodsType.id != "0") {
                                GoodsTypeSchema.findByIdAndUpdate(goodsType.id, goodsType, (err, res) => {
                                    Object.assign(res, goodsType);
                                    resolve(res);
                                    return;
                                })
                            } else {
                                GoodsTypeSchema.create(goodsType).then(info => {
                                    resolve(info);
                                    return;
                                });
                            }
                        } else {
                            return null;
                        }
                    });
                }
            });
        },
        deleteGoodsType(parent, { id }, context): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                if (!context.user) resolve(null);

                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    GoodsTypeSchema.findByIdAndRemove(id, (err, res) => {
                        resolve(res != null);
                    }).catch(err => { resolve(err); });
                } else {
                    GoodsTypeSchema.findById(id).then((goodstype) => {
                        UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                            var flag = false;
                            for (var i = 0; i < info.length; i++) {
                                if (info[i].businessId == goodstype.businessId) {
                                    flag = true;
                                }
                            }
                            if (flag) {
                                GoodsTypeSchema.findByIdAndRemove(id, (err, res) => {
                                    resolve(res != null);
                                }).catch(err => { resolve(err); });
                            } else {
                                resolve(false);
                            }
                        });
                    });
                }
            });

        }
    }
}