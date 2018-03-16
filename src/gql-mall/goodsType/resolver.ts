import GoodsTypeSchema, { IGoodsTypeModel } from './goodsType';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
import UserBusinessSchema from '../userBusiness/userBusiness';
import goods from '../goods/goods';
import { resolve } from 'path';
import { reject } from 'bluebird';

export class GoodsType {

    constructor() { }

    static GoodsType: any = {
        Business(model) {
            return BusinessSchema.findById(model.businessId);
        },
    }

    static Query: any = {

        async getGoodsType(parent, { }, context): Promise<IGoodsTypeModel[]> {

            if (!context.user) return null;

            // 管理员返回所有
            if (context.session.isManger) {
                return await GoodsTypeSchema.find();
            }
            // 商家返回自己的类别
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            return await GoodsTypeSchema.find({ businessId: { $in: businessIdList } });
        },

        async getGoodsTypeById(parent, { id }, context): Promise<IGoodsTypeModel> {

            if (!context.user) return null;

            return await GoodsTypeSchema.findById(id);
        },

        async getGoodsTypePage(parent, { pageIndex = 1, pageSize = 10, goodsType }, context): Promise<IGoodsTypeModel[]> {

            if (!context.user) return null;

            var skip = (pageIndex - 1) * pageSize;
            // 管理员返回所有
            if (context.session.isManger) {
                return await GoodsTypeSchema.find(goodsType).skip(skip).limit(pageSize);
            }
            // 商家返回自己的类别
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            if (!goodsType.businessId) {
                goodsType.businessId = businessIdList;
            }
            return await GoodsTypeSchema.find(goodsType).skip(skip).limit(pageSize);
        },

        async getGoodsTypeWhere(parent, { goodsType }, context): Promise<IGoodsTypeModel[]> {

            if (!context.user) return null;

            return await GoodsTypeSchema.find(goodsType);
        },

        async getGoodsTypeByIdIn(parent, { id }, context): Promise<IGoodsTypeModel[]> {

            if (!context.user) return null;

            var ninfo = id.split(',');

            return await GoodsTypeSchema.find({ businessId: { $in: ninfo } });
        },

        async getGoodsTypeCount(parent, { goodsType }, context): Promise<Number> {

            if (!context.user) return null;
            // 管理员统计所有
            if (context.session.isManger) {
                return await GoodsTypeSchema.count(goodsType);
            }
            // 商家统计自己的
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            if (!goodsType.businessId) {
                goodsType.businessId = businessIdList;
            }
            return await GoodsTypeSchema.count(goodsType);
        }
    }

    static Mutation: any = {

        async saveGoodsType(parent, { goodsType }, context): Promise<any> {

            if (!context.user) return null;

            if (context.session.isManger) {
                if (goodsType.id && goodsType.id != "0") {
                    let res = await GoodsTypeSchema.findByIdAndUpdate(goodsType.id, goodsType);
                    Object.assign(res, goodsType);
                    return res;
                }
                return await GoodsTypeSchema.create(goodsType);
            }
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var flag = false;
            for (var i = 0; i < userBusinessList.length; i++) {
                if (userBusinessList[i].businessId == goodsType.businessId) {
                    flag = true;
                }
            }
            // 判断该类别是否为该用户
            if (!flag) {
                return null;
            }

            if (goodsType.id && goodsType.id != "0") {
                return await GoodsTypeSchema.findByIdAndUpdate(goodsType.id, goodsType);
            }
            return await GoodsTypeSchema.create(goodsType);
        },

        async deleteGoodsType(parent, { id }, context): Promise<Boolean> {

            if (!context.user) return null;

            if (context.session.isManger) {
                return (await GoodsTypeSchema.findByIdAndRemove(id) != null);
            }

            let goodsType = await GoodsTypeSchema.findById(id);
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var flag = false;
            for (var i = 0; i < userBusinessList.length; i++) {
                if (userBusinessList[i].businessId == goodsType.businessId) {
                    flag = true;
                }
            }
            if (!flag) {
                return false;
            }
            return (await GoodsTypeSchema.findByIdAndRemove(id) != null);
        }

    }
}