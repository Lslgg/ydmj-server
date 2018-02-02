import UserBusinessSchema, { IUserBusinessModel } from './userBusiness';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import UserSchema from '../../gql-system/user/user';
import BusinessSchema from '../../gql-mall/business/business';
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
            if (!context.user) return null;

            let promise = new Promise<Array<IUserBusinessModel>>((resolve, reject) => {
                UserBusinessSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },
        getUserBusinessById(parent, { id }, context): Promise<IUserBusinessModel> {
            if (!context.user) return null;

            let promise = new Promise<IUserBusinessModel>((resolve, reject) => {
                UserBusinessSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getUserBusinessWhere(parent, { userBusiness }, context) {
            if (!context.user) return null;
            var userBusinessInfo = UserBusinessSchema.find(userBusiness);
            return userBusinessInfo;
        },

        getUserBusinessPage(parent, { pageIndex = 1, pageSize = 10, userbusiness }, context) {
            if (!context.user) return null;
            var skip = (pageIndex - 1) * pageSize
            var userBusinessInfo = UserBusinessSchema.find(userbusiness).skip(skip).limit(pageSize)
            return userBusinessInfo;
        },

        getUserBusinessCount(parent, { userBusiness }, context) {
            if (!context.user) return 0;
            var count = UserBusinessSchema.count(userBusiness);
            return count;
        },

    }

    static Mutation: any = {
        saveUserBusiness(parent, { userBusiness }, context) {
            if (!context.user) return null;
            if (userBusiness.id && userBusiness.id != "0") {
                return new Promise<IUserBusinessModel>((resolve, reject) => {
                    UserBusinessSchema.findByIdAndUpdate(userBusiness.id, userBusiness, (err, res) => {
                        Object.assign(res, userBusiness);
                        resolve(res);
                    })
                });
            }
            var info = UserBusinessSchema.find(userBusiness);

            return UserBusinessSchema.create(userBusiness);
        },
        saveUserBusinessAll(parent, { userBusiness }, context) {
            if (!context.user) return null;

            return UserBusinessSchema.create(userBusiness);
        },
        deleteUserBusinessAll(parent, { userBusiness }, context): Promise<Boolean> {
            if (!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                if (!userBusiness) resolve(false);
                UserBusinessSchema.find(userBusiness).remove((err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        },
        deleteUserBusiness(parent, { id }, context): Promise<Boolean> {
            if (!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                UserBusinessSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        },
    }
}