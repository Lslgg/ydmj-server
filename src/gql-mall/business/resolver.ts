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
                let businessList = await BusinessSchema.find();
                return businessList;
            }

            // 普通商家只返回自己的商家
            let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id });
            var businessIdList: Array<String> = [];
            for (var i = 0; i < userBusinessList.length; i++) {
                businessIdList.push(userBusinessList[i].businessId);
            }
            let businessList = await BusinessSchema.find({ _id: { $in: businessIdList } });
            return businessList;
        },

        getBusinessById(parent, { id }, context): Promise<IBusinessModel> {
            // 查找当前用户商家       
            if (!context.user) return null;

            let promise = new Promise<IBusinessModel>(async (resolve, reject) => {
                let business = await BusinessSchema.findById(id);
                resolve(business);
                return;
            });
            return promise;
        },

        getBusinessPage(parent, { pageIndex = 1, pageSize = 10, business }, context): Promise<IBusinessModel[]> {

            if (!context.user) return null;

            return new Promise<IBusinessModel[]>(async (resolve, reject) => {

                var skip = (pageIndex - 1) * pageSize;

                // 管理员返回所有商家                   
                if (context.session.isManger) {
                    let businessList = BusinessSchema.find(business).skip(skip).limit(pageSize);
                    resolve(businessList);
                    return;
                }

                // 普通商家只返回自己的商家
                let userBusinessList = await UserBusinessSchema.find({ userId: context.user._id }).skip(skip).limit(pageSize);
                var businessIdList: Array<String> = [];
                for (var i = 0; i < userBusinessList.length; i++) {
                    businessIdList.push(userBusinessList[i].businessId);
                }
                business._id = { "$in": businessIdList };
                let businessList = await BusinessSchema.find(business);
                resolve(businessList);
                return;
            });
        },

        getBusinessWhere(parent, { business }, context): Promise<IBusinessModel[]> {

            if (!context.user) return null;

            return new Promise<IBusinessModel[]>(async (resolve, reject) => {
                let businessList = BusinessSchema.find(business);
                resolve(businessList);
                return;
            });
        },

        getBusinessCount(parent, { business }, context): Promise<Number> {

            if (!context.user) return null;

            return new Promise<Number>(async (resolve, reject) => {

                // 管理员统计所有                            
                if (context.session.isManger) {
                    var count = BusinessSchema.count(business);
                    resolve(count);
                    return;
                }

                // 非管理员统计自己的商家
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    business._id = businessIdList;
                    var count = BusinessSchema.count(business);
                    resolve(count);
                    return;
                });

            });
        },

        //前台方法
        getBusinessPageM(parent, { pageIndex = 1, pageSize = 10, business, sort }, context): Promise<IBusinessModel[]> {

            if (!context.user) return null;

            return new Promise<IBusinessModel[]>((resolve, reject) => {

                var skip = (pageIndex - 1) * pageSize;

                BusinessSchema.find(business).skip(skip).limit(pageSize).sort(sort).then((businessList) => {
                    resolve(businessList);
                    return;
                });

                return;
            });
        },
    }

    static Mutation: any = {

        async saveBusiness(parent, { business }, context): Promise<any> {

            if (!context.user) return null;

            return new Promise<any>((resolve, reject) => {

                if (context.session.isManger) {

                    if (business.id && business.id != "0") {
                        BusinessSchema.findByIdAndUpdate(business.id, business, (err, res) => {
                            // Object.assign(res, business);                            
                            // resolve(res);
                            return res;
                        });
                        return;
                    }
                    business.times = 0;
                    business.score = 0;
                    BusinessSchema.create(business).then((info) => {
                        resolve(info);
                        return;
                    });
                    return;

                }
                UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var flag = false;
                    for (var i = 0; i < info.length; i++) {
                        if (info[i].businessId == business.id) {
                            flag = true;
                        }
                    }
                    if (!flag || !business.id || business.id != "0") {
                        resolve(null);
                        return;
                    }
                    BusinessSchema.findByIdAndUpdate(business.id, business, (err, res) => {
                        Object.assign(res, business);
                        resolve(res);
                        return;
                    });
                    return;

                });
            });
        },
        deleteBusiness(parent, { id }, context): Promise<Boolean> {

            if (!context.user || !context.session.isManger) return null;

            return new Promise<Boolean>((resolve, reject) => {

                BusinessSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null);
                    return;
                }).catch(err => {
                    resolve(err);
                    return;
                });

            });
        }

    }
}