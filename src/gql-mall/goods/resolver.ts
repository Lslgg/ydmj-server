import GoodsSchema, { IGoodsModel } from './goods';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema, { IBusinessModel } from '../business/business';
import GoodsTypeSchema from '../goodsType/goodsType';
import UserBusinessSchema from '../userBusiness/userBusiness';
import { resolve } from 'url';
import { reject } from 'bluebird';
import { FileManager } from '../../common/file/fileManager';
export class Goods {

    constructor() { }

    static Goods: any = {
        Business(model) {
            return BusinessSchema.findById(model.businessId);
        },
        GoodsType(model) {
            return GoodsTypeSchema.findById(model.goodsTypeId);
        },
        Images(model) {
            let promise = new Promise<Array<any>>((resolve, reject) => {
                let fm = new FileManager();
                let imgs = fm.getFileByIds(model.imageIds);
                resolve(imgs);
            });
            return promise;
        }
    }

    static Query: any = {

        async getGoods(parent, { }, context): Promise<Array<IGoodsModel>> {                              
            if (!context.user) return null;

            if (context.session.isManger) {
                console.log('dohere');
                return await GoodsSchema.find();
            }

            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            return await GoodsSchema.find({ businessId: { $in: businessIdList } });
        },

        async getGoodsById(parent, { id }, context): Promise<IGoodsModel> {

            if (!context.user) return null;

            return await GoodsSchema.findById(id);
        },

        async getGoodsPage(parent, { pageIndex = 1, pageSize = 10, goods }, context): Promise<IGoodsModel[]> {

            if (!context.user) return null;


            var skip = (pageIndex - 1) * pageSize;

            if (context.session.isManger) {
                return await GoodsSchema.find(goods).skip(skip).limit(pageSize);
            }

            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            if (!goods.businessId) {
                goods.businessId = businessIdList;
            }
            return await GoodsSchema.find(goods).skip(skip).limit(pageSize);
        },

        async getGoodsWhere(parent, { goods }, context): Promise<IGoodsModel[]> {

            if (!context.user) return null;

            return await GoodsSchema.find(goods);
        },

        async getGoodsCount(parent, { goods }, context): Promise<Number> {

            if (!context.user) return null;

            // 管理员统计所有                            
            if (context.session.isManger) {
                return await GoodsSchema.count(goods);
            }

            // 非管理员统计自己的商家
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            if (!goods.businessId) {
                goods.businessId = businessIdList;
            }
            return await GoodsSchema.count(goods);
        },

        //前台方法
        async getGoodsPageM(parent, { pageIndex = 1, pageSize = 10, goods, sort }, context): Promise<IGoodsModel[]> {            

            if (!context.user) return null;

            var skip = (pageIndex - 1) * pageSize;

            return await GoodsSchema.find(goods).sort(sort).skip(skip).limit(pageSize);
        }
    }

    static Mutation: any = {

        async saveGoods(parent, { goods }, context): Promise<any> {

            if (!context.user) return null;

            if (context.session.isManger) {
                if (goods.id && goods.id != "0") {
                    let res = await GoodsSchema.findByIdAndUpdate(goods.id, goods);
                    Object.assign(res, goods);
                    return res;
                }
                goods.times = 0;
                goods.sortIndex = new Date().getTime();
                return await GoodsSchema.create(goods);
            }

            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var flag = false;
            for (var i = 0; i < userBusinessList.length; i++) {
                if (userBusinessList[i].businessId == goods.businessId) {
                    flag = true;
                }
            }
            if (!flag) {
                return;
            }
            if (goods.id && goods.id != "0") {
                let res = await GoodsSchema.findByIdAndUpdate(goods.id, goods);
                Object.assign(res, goods);
                return res;
            }
            goods.times = 0;
            goods.sortIndex = new Date().getTime();
            return await GoodsSchema.create(goods);
        },

        async deleteGoods(parent, { id }, context): Promise<Boolean> {

            if (!context.user) return null;

            if (context.session.isManger) {
                return (await GoodsSchema.findByIdAndRemove(id) != null);
            }
            var flag = false;
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            let res = await GoodsSchema.findById(id);
            for (var i = 0; i < userBusinessList.length; i++) {
                if (userBusinessList[i].businessId == res.businessId) {
                    flag = true;
                }
            }
            if (!flag) {
                return false;
            }
            return (await GoodsSchema.findByIdAndRemove(id) != null);
        }

    }
}