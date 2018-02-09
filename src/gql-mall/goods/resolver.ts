import GoodsSchema, { IGoodsModel } from './goods';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema, { IBusinessModel } from '../business/business';
import GoodsTypeSchema from '../goodsType/goodsType';
import UserBusinessSchema from '../userBusiness/userBusiness';
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
        getGoods(parent, { }, context) {
            if (!context.user) return null;

            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                return GoodsSchema.find().then(res => {
                    return res;
                }).catch(err => { return null; });
            } else {
                return UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    return GoodsSchema.find({ _id: { in: businessIdList } }).then(res => {
                        return res;
                    }).catch(err => { return null; });
                });
            }
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

        getGoodsPage(parent, { pageIndex = 1, pageSize = 10, goods }, context) {
            if (!context.user) return null;
            var skip = (pageIndex - 1) * pageSize

            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                var goodsInfo = GoodsSchema.find(goods).skip(skip).limit(pageSize);
                return goodsInfo;
            } else {
                return UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    if (!goods.businessId) {
                        goods.businessId = businessIdList;
                    }
                    var goodsInfo = GoodsSchema.find(goods).skip(skip).limit(pageSize);
                    return goodsInfo;
                });
            }


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
        saveGoods(parent, { goods }, context) {
            if (!context.user) return null;

            if (goods.id && goods.id != "0") {
                return new Promise<IGoodsModel>((resolve, reject) => {
                    GoodsSchema.findByIdAndUpdate(goods.id, goods, (err, res) => {
                        Object.assign(res, goods);
                        resolve(res);
                    })
                });
            }
            return GoodsSchema.create(goods)
        },
        deleteGoods(parent, { id }, context): Promise<Boolean> {
            if (!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                GoodsSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}