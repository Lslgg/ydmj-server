import GoodsTypeSchema, { IGoodsTypeModel } from './goodsType';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import UserBusinessSchema from '../userBusiness/userBusiness';

export class GoodsType {

    constructor() {

    }

    static GoodsType: any = {
        Business(model) {
            return BusinessSchema.findById(model.businessId);
        },
    }

    static Query: any = {
        getGoodsType(parent, { }, context) {
            if (!context.user) return null;
            // 管理员返回所有
            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                return GoodsTypeSchema.find().then(res => {
                    return res;
                }).catch(err => { return err; });
            } else {
                // 商家返回自己的类别
                return UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    return GoodsTypeSchema.find({ businessId: { $in: businessIdList } }).then(res => {
                        return res;
                    }).catch(err => { return err; });
                });
            }
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
            if (!context.user) return null;
            var skip = (pageIndex - 1) * pageSize;
            // 管理员返回所有
            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                return GoodsTypeSchema.find(goodsType).skip(skip).limit(pageSize).then(res => {
                    return res;
                }).catch(err => { return err; });
            } else {
                // 商家返回自己的类别     
                return UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    if (!goodsType.businessId) {
                        goodsType.businessId = businessIdList;
                    }
                    return GoodsTypeSchema.find(goodsType).skip(skip).limit(pageSize).then(res => {
                        return res;
                    }).catch(err => { return err; });
                });
            }
        },

        getGoodsTypeWhere(parent, { goodsType }, context) {
            // if (!context.user) return null;
            var goodsTypeInfo = GoodsTypeSchema.find(goodsType);                
            return goodsTypeInfo;
        },

        getGoodsTypeCount(parent, { goodsType }, context) {
            if (!context.user) return 0;
            // 管理员统计所有
            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                var count = GoodsTypeSchema.count(goodsType);
                return count;
            } else {
                // 商家统计自己的
                return GoodsTypeSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    if (!goodsType.businessId) {
                        goodsType.businessId = businessIdList;
                    }
                    var count = GoodsTypeSchema.count(goodsType);
                    return count;
                });
            }

        },
    }

    static Mutation: any = {
        saveGoodsType(parent, { goodsType }, context) {
            if (!context.user) return null;
            if (!goodsType.businessId) return null;
            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                if (goodsType.id && goodsType.id != "0") {

                    GoodsTypeSchema.findByIdAndUpdate(goodsType.id, goodsType, (err, res) => {
                        Object.assign(res, goodsType);
                        return res;
                    })
                }
                return GoodsTypeSchema.create(goodsType);
            } else {
                return UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
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
                                return res;
                            })
                        }
                        return GoodsTypeSchema.create(goodsType);
                    } else {
                        return null;
                    }
                });
            }

        },

        deleteGoodsType(parent, { id }, context) {
            if (!context.user) return null;

            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                GoodsTypeSchema.findByIdAndRemove(id, (err, res) => {
                    return (res != null);
                }).catch(err => { return err; });
            } else {
                return GoodsTypeSchema.findById(id).then((goodstype) => {
                    return UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var flag = false;
                        for (var i = 0; i < info.length; i++) {
                            if (info[i].businessId == goodstype.businessId) {
                                flag = true;
                            }
                        }
                        if (flag) {
                            return GoodsTypeSchema.findByIdAndRemove(id, (err, res) => {
                                return (res != null);
                            }).catch(err => { return err; });
                        } else {
                            return false;
                        }
                    });
                });
            }
        }
    }
}