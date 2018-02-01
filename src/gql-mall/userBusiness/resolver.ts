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

        getUserBusinessCount(parent, { userBusiness }, context) {
            if (!context.user) return 0;
            var count = UserBusinessSchema.count(userBusiness);
            return count;
        },

        // getBusinessCount(parent, { business }, context) {

        // }
    }

    static Mutation: any = {       
        saveAllUserBusiness(parent, { userBusiness }, context) {
            if (!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                UserBusinessSchema.create(userBusiness).then(info => {
                    resolve(info.length>0);
                });
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