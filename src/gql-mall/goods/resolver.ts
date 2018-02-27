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
            return new Promise<Array<IGoodsModel>>((resolve, reject) => {
                if (!context.user) resolve(null);
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    GoodsSchema.find().then(res => {
                        resolve(res);
                    }).catch(err => { resolve(null); });
                } else {
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var businessIdList: Array<String> = [];
                        for (var i = 0; i < info.length; i++) {
                            businessIdList.push(info[i].businessId);
                        }
                        GoodsSchema.find({ businessId: { $in: businessIdList } }).then(res => {
                            resolve(res);
                        }).catch(err => { resolve(null) });
                    });
                }
            });
        },
        getGoodsById(parent, { id }, context): Promise<IGoodsModel> {
            if (!context.user) return null;

            let promise = new Promise<IGoodsModel>((resolve, reject) => {
                GoodsSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getGoodsPage(parent, { pageIndex = 1, pageSize = 10, goods }, context): Promise<Array<IGoodsModel>> {
            return new Promise<Array<IGoodsModel>>((resolve, reject) => {
                if (!context.user) resolve(null);
                var skip = (pageIndex - 1) * pageSize

                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    GoodsSchema.find(goods).skip(skip).limit(pageSize).then((goodsInfo) => {
                        resolve(goodsInfo);
                    });                    
                } else {
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
                        });
                    });
                }
            });
        },

        getGoodsWhere(parent, { goods }, context) {
            if (!context.user) return null;
            var goodsInfo = GoodsSchema.find(goods);
            return goodsInfo;
        },

        getGoodsCount(parent, { goods }, context) {
            if (!context.user) return 0;
            var count = GoodsSchema.count(goods);
            return count;
        },
    }

    static Mutation: any = {
        saveGoods(parent, { goods }, context): Promise<any> {
            if (!context.user) return null;
            return new Promise<any>((resolve, reject) => {
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    if (goods.id && goods.id != "0") {
                        GoodsSchema.findByIdAndUpdate(goods.id, goods, (err, res) => {
                            Object.assign(res, goods);
                            resolve(res);
                        });
                    } else {        
                        goods.times = 0;                
                        GoodsSchema.create(goods).then((info) => {
                            resolve(info);
                        });                        
                    }
                } else {
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var flag = false;
                        for (var i = 0; i < info.length; i++) {
                            if (info[i].businessId == goods.businessId) {
                                flag = true;
                            }
                        }
                        if (flag) {
                            if (goods.id && goods.id != "0") {
                                GoodsSchema.findByIdAndUpdate(goods.id, goods, (err, res) => {
                                    Object.assign(res, goods);
                                    resolve(res);
                                });
                            } else {
                                goods.times = 0;
                                GoodsSchema.create(goods).then((info) => {
                                    resolve(info);
                                });   
                            }
                        } else {
                            resolve(null);
                        }
                    });
                }
            });
        },
        deleteGoods(parent, { id }, context): Promise<Boolean> {

            return new Promise<Boolean>((resolve, reject) => {
                if (!context.user) resolve(null);
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    GoodsSchema.findByIdAndRemove(id, (err, res) => {
                        resolve(res != null)
                    }).catch(err => reject(err));
                } else {
                    var flag = false;
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        GoodsSchema.findById(id, (err, res) => {
                            for (var i = 0; i < info.length; i++) {
                                if (info[i].businessId == res.businessId) {
                                    flag = true;
                                }
                            }
                            if (flag) {
                                GoodsSchema.findByIdAndRemove(id, (err, res) => {
                                    resolve(res != null)
                                }).catch(err => reject(err));
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