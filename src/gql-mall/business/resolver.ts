import BusinessSchema, { IBusinessModel } from './business';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import RoleSchema from '../../gql-system/role/role';
import UserBusinessSchema from '../userBusiness/userBusiness';
import { FileManager } from '../../common/file/fileManager';


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
        getBusiness(parent, { }, context) {
            if (!context.user) return null;
            // 管理员返回所有商家
            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                return BusinessSchema.find().then((businessList) => {
                    return businessList;
                });
            } else {
                // 普通商家只返回自己的商家
                return UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    return BusinessSchema.find({ _id: { $in: businessIdList } }).then(info => {
                        return info;
                    });
                });
            }
        },
        getBusinessById(parent, { id }, context) {
            if (!context.user) return null;
            // 查找当前用户商家            
            return BusinessSchema.findById(id).then(res => {
                return res;
            }).catch(err => { return null });
        },

        getBusinessPage(parent, { pageIndex = 1, pageSize = 10, business }, context) {
            if (!context.user) return null;
            var skip = (pageIndex - 1) * pageSize;
            // 管理员返回所有商家
            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                return BusinessSchema.find(business).skip(skip).limit(pageSize).then((businessList) => {
                    return businessList;
                });
            } else {
                // 普通商家只返回自己的商家
                return UserBusinessSchema.find({ userId: context.user._id }).skip(skip).limit(pageSize).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    business._id = businessIdList;
                    return BusinessSchema.find(business).then(info => {
                        return info;
                    });
                });
            }
        },

        getBusinessWhere(parent, { business }, context) {
            if (!context.user) return null;
            var businesses = BusinessSchema.find(business);
            return businesses;
        },

        getBusinessCount(parent, { business }, context) {
            if (!context.user) return 0;
            // 管理员统计所有            
            if (context.user.roleId == '5a0d0122c61a4b1b30171148') {
                var count = BusinessSchema.count(business);
                return count;
            } else {
                // 非管理员统计自己的商家
                return UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var businessIdList: Array<String> = [];
                    for (var i = 0; i < info.length; i++) {
                        businessIdList.push(info[i].businessId);
                    }
                    business._id = businessIdList;
                    var count = BusinessSchema.count(business);
                    return count;
                });
            }


        },
    }

    static Mutation: any = {
        saveBusiness(parent, { business }, context) {
            if (!context.user) return null;

            if (business.id && business.id != "0") {

                return UserBusinessSchema.find({ userId: context.user._id }).then((info) => {
                    var flag = false;
                    for (var i = 0; i < info.length; i++) {
                        if (info[i].businessId == business.id) {
                            flag = true;
                        }
                    }
                    // 判断该商家是否为该用户
                    if (flag) {
                        return BusinessSchema.findByIdAndUpdate(business.id, business, (err, res) => {
                            Object.assign(res, business);
                            return res;
                        })
                    } else {
                        return null;
                    }
                });
            }
            // 只有管理员能添加商家
            if (context.user.roleId != '5a0d0122c61a4b1b30171148') {
                return null;
            }
            business.times = 0;
            business.score = 0;
            return BusinessSchema.create(business);
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