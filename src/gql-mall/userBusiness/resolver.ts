import UserBusinessSchema, { IUserBusinessModel } from './userBusiness';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import UserSchema from '../../gql-system/user/user';
import BusinessSchema from '../../gql-mall/business/business';
import { resolve, reject } from 'bluebird';
export class UserBusiness {
    constructor() {

    }


    static UserBusiness: any = {

        Business(model) {
            return BusinessSchema.findById(model.businessId);
        },
        User(model) {
            return UserSchema.findById(model.userId);
        },

    }

    static Query: any = {
        getUserBusiness(parent, { }, context): Promise<Array<IUserBusinessModel>> {
            if (!context.user || !context.session.isManger) return null;
            let promise = new Promise<Array<IUserBusinessModel>>((resolve, reject) => {
                UserBusinessSchema.find().then(res => {
                    resolve(res);
                    return;
                }).catch(err => { resolve(null); return; });
            })
            return promise;
        },
        getUserBusinessById(parent, { id }, context): Promise<IUserBusinessModel> {
            if (!context.user || !context.session.isManger) return null;
            let promise = new Promise<IUserBusinessModel>((resolve, reject) => {
                UserBusinessSchema.findById(id).then(res => {
                    resolve(res);
                    return;
                }).catch(err => { resolve(null); return; });
            });
            return promise;
        },

        getUserBusinessWhere(parent, { userBusiness }, context): Promise<IUserBusinessModel[]> {
            if (!context.user || !context.session.isManger) return null;
            return new Promise<IUserBusinessModel[]>((resolve, reject) => {
                var userBusinessInfo = UserBusinessSchema.find(userBusiness);
                resolve(userBusinessInfo);
                return;
            });
        },

        getUserBusinessPage(parent, { pageIndex = 1, pageSize = 10, userbusiness }, context): Promise<IUserBusinessModel[]> {
            if (!context.user || !context.session.isManger) return null;
            return new Promise<IUserBusinessModel[]>((resolve, reject) => {
                var skip = (pageIndex - 1) * pageSize;
                var userBusinessInfo = UserBusinessSchema.find(userbusiness).skip(skip).limit(pageSize);
                resolve(userBusinessInfo);
                return;
            });
        },

        getUserBusinessCount(parent, { userBusiness }, context): Promise<Number> {
            if (!context.user || !context.session.isManger) return null;
            return new Promise<Number>((resolve, reject) => {
                var count = UserBusinessSchema.count(userBusiness);
                resolve(count);
                return;
            });
        },

    }

    static Mutation: any = {
        saveUserBusiness(parent, { userBusiness }, context): Promise<any> {
            if (!context.user || !context.session.isManger) return null;
            return new Promise<any>((resolve, reject) => {
                if (userBusiness.id && userBusiness.id != "0") {
                    UserBusinessSchema.findByIdAndUpdate(userBusiness.id, userBusiness, (err, res) => {
                        Object.assign(res, userBusiness);
                        resolve(res);
                        return;
                    });
                    return;
                }
                UserBusinessSchema.create(userBusiness).then(info => {
                    resolve(info);
                    return;
                });
            });
        },
        saveUserBusinessAll(parent, { userBusiness }, context): Promise<IUserBusinessModel[]> {
            if (!context.user || !context.session.isManger) return null;
            return new Promise<IUserBusinessModel[]>((resolve, reject) => {
                UserBusinessSchema.create(userBusiness).then(info => {
                    resolve(info);
                    return;
                });
            });

        },
        deleteUserBusinessAll(parent, { id }, context): Promise<Boolean> {
            if (!context.user || !context.session.isManger) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                UserBusinessSchema.find({ _id: { $in: id } }).remove().then(res => {
                    resolve(true);
                    return;
                }).catch(err => { resolve(err); return; });
            });
            return promise;
        },
        deleteUserBusiness(parent, { id }, context): Promise<Boolean> {
            if (!context.user || !context.session.isManger) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                UserBusinessSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null);
                    return;
                }).catch(err => { resolve(err); return; });
            });
            return promise;
        },
    }
}