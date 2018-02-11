import BusinessSchema, { IBusinessModel } from './business';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import RoleSchema from '../../gql-system/role/role';
import UserBusinessSchema from '../userBusiness/userBusiness';
import { FileManager } from '../../common/file/fileManager';
import { resolve } from 'url';
import { reject } from 'bluebird';


export class Business {

    constructor() {

    }

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
        getBusiness(parent, { }, context): Promise<Array<IBusinessModel>> {
            // 管理员返回所有商家
            return new Promise<Array<IBusinessModel>>((resolve, reject) => {
                if (!context.user) resolve(null);
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    BusinessSchema.find().then((businessList) => {
                        resolve(businessList);
                    });
                } else {
                    // 普通商家只返回自己的商家
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var businessIdList: Array<String> = [];
                        for (var i = 0; i < info.length; i++) {
                            businessIdList.push(info[i].businessId);
                        }
                        BusinessSchema.find({ _id: { $in: businessIdList } }).then(info => {
                            resolve(info);
                        });
                    });
                }
            });

        },
        getBusinessById(parent, { id }, context): Promise<IBusinessModel> {
            // 查找当前用户商家       
            if (context.user) return null;

			let promise = new Promise<IBusinessModel>((resolve, reject) => {
				BusinessSchema.findById(id).then((res) => {
					resolve(res);
				}).catch(err => resolve(null));
			});
			return promise;

        },

        getBusinessPage(parent, { pageIndex = 1, pageSize = 10, business }, context): Promise<Array<IBusinessModel>> {
            return new Promise<Array<IBusinessModel>>((resolve, reject) => {
                if (context.user) resolve(null);
                var skip = (pageIndex - 1) * pageSize;
                // 管理员返回所有商家
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    BusinessSchema.find(business).skip(skip).limit(pageSize).then((businessList) => {
                        resolve(businessList);
                    });
                } else {
                    // 普通商家只返回自己的商家
                    UserBusinessSchema.find({ userId: context.user._id }).skip(skip).limit(pageSize).then((info) => {
                        var businessIdList: Array<String> = [];
                        for (var i = 0; i < info.length; i++) {
                            businessIdList.push(info[i].businessId);
                        }
                        business._id = businessIdList;
                        BusinessSchema.find(business).then(info => {
                            resolve(info);
                        });
                    });
                }
            });
        },

        getBusinessWhere(parent, { business }, context) {
            if (context.user) return null;
            return BusinessSchema.find(business).then(info => {
                return info;
            });

        },

        getBusinessCount(parent, { business }, context): Promise<Number> {

            return new Promise<Number>((resolve, reject) => {
                if (context.user) resolve(null);
                // 管理员统计所有                            
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    var count = BusinessSchema.count(business);
                    resolve(count);
                } else {
                    // 非管理员统计自己的商家
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var businessIdList: Array<String> = [];
                        for (var i = 0; i < info.length; i++) {
                            businessIdList.push(info[i].businessId);
                        }
                        business._id = businessIdList;
                        var count = BusinessSchema.count(business);
                        resolve(count);
                    });
                }
            });



        },
    }

    static Mutation: any = {
        saveBusiness(parent, { business }, context): Promise<any> {
            if (!context.user) return null;
            return new Promise<any>((resolve, reject) => {
                if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                    if (business.id && business.id != "0") {
                        BusinessSchema.findByIdAndUpdate(business.id, business, (err, res) => {
                            Object.assign(res, business);
                            resolve(res);
                        });
                    }
                    business.times = 0;
                    business.score = 0;
                    BusinessSchema.create(business).then((info) => {
                        resolve(info);
                    });
                    
                } else {
                    UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                        var flag = false;
                        for (var i = 0; i < info.length; i++) {
                            if (info[i].businessId == business.id) {
                                flag = true;
                            }
                        }
                        if (flag) {
                            if (business.id && business.id != "0") {
                                BusinessSchema.findByIdAndUpdate(business.id, business, (err, res) => {
                                    Object.assign(res, business);
                                    resolve(res);
                                });
                            } else {
                                resolve(null);
                            }
                        } else {
                            resolve(null);
                        }
                    });
                }
            });
        },
        deleteBusiness(parent, { id }, context) {
            if (!context.user) return null;
            // 非管理员不能使用删除商家
            if (context.user.roleId != '5a0d0122c61a4b1b30171148') return null;
            return BusinessSchema.findByIdAndRemove(id, (err, res) => {
                return res;
            }).catch(err => {
                return err;
            });
        }
    }
}