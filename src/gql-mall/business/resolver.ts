import BusinessSchema, { IBusinessModel } from './business';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import RoleSchema from '../../gql-system/role/role';
import UserBusinessSchema from '../userBusiness/userBusiness';
import { FileManager } from '../../common/file/fileManager';
import { resolve } from 'url';
import { reject } from 'bluebird';


export class Business {

    constructor() { }

    static Business: any = {
        Images(model) {
            let promise = new Promise<Array<any>>((resolve, reject) => {
                let fm = new FileManager();
                let imgs = fm.getFileByIds(model.imageIds);
                resolve(imgs);
            });
            return promise;
        }
    };

    static Query: any = {
        async getBusiness(parent, { }, context): Promise<Array<IBusinessModel>> {

            if (!context.user) return null;

            // 管理员返回所有商家            
            if (context.session.isManger) {
                return await BusinessSchema.find();
            }

            // 普通商家只返回自己的商家
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            return await BusinessSchema.find({ _id: { $in: businessIdList } });
        },

        async getBusinessById(parent, { id }, context): Promise<IBusinessModel> {
            // 查找当前用户商家       
            if (!context.user) return null;

            return await BusinessSchema.findById(id);
        },

        async getBusinessPage(parent, { pageIndex = 1, pageSize = 10, business }, context): Promise<IBusinessModel[]> {

            if (!context.user) return null;


            var skip = (pageIndex - 1) * pageSize;

            // 管理员返回所有商家                   
            if (context.session.isManger) {
                return await BusinessSchema.find(business).skip(skip).limit(pageSize);
            }

            // 普通商家只返回自己的商家
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id }).skip(skip).limit(pageSize);
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            business._id = { "$in": businessIdList };
            return await BusinessSchema.find(business);
        },

        async getBusinessWhere(parent, { business }, context): Promise<IBusinessModel[]> {

            if (!context.user) return null;

            return await BusinessSchema.find(business);
        },

        async getBusinessCount(parent, { business }, context): Promise<Number> {

            if (!context.user) return null;

            // 管理员统计所有                            
            if (context.session.isManger) {
                return await BusinessSchema.count(business);
            }

            // 非管理员统计自己的商家
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            business._id = businessIdList;
            return await BusinessSchema.count(business);
        },

        //前台方法
        async getBusinessPageM(parent, { pageIndex = 1, pageSize = 10, business, sort }, context): Promise<IBusinessModel[]> {

            if (!context.user) return null;

            var skip = (pageIndex - 1) * pageSize;

            return await BusinessSchema.find(business).skip(skip).limit(pageSize).sort(sort);
        }
    }

    static Mutation: any = {

        async saveBusiness(parent, { business }, context): Promise<any> {

            if (!context.user) return null;


            if (context.session.isManger) {

                if (business.id && business.id != "0") {
                    let res = await BusinessSchema.findByIdAndUpdate(business.id, business);
                    Object.assign(res, business);
                    return res;
                }

                business.times = 0;
                business.score = 0;
                return await BusinessSchema.create(business);
            }

            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var flag = false;
            for (var i = 0; i < userBusinessList.length; i++) {
                if (userBusinessList[i].businessId == business.id) {
                    flag = true;
                }
            }
            if (!flag || !business.id || business.id != "0") {
                return;
            }
            let res = await BusinessSchema.findByIdAndUpdate(business.id, business);
            Object.assign(res, business);
            return res;
        },

        async deleteBusiness(parent, { id }, context): Promise<Boolean> {

            if (!context.user || !context.session.isManger) return null;

            return await (BusinessSchema.findByIdAndRemove(id) != null);
        }

    }
}