import UserSchema, { IUserModel } from './user';
import RoleSchema from '../role/role';
import ProfileSchema from '../profile/profile';


import { DocumentQuery, MongoosePromise } from 'mongoose';

export class User {


    constructor() {
    }

    static User: any = {
        Role(model) {
            return RoleSchema.findById(model.roleId);
        },
        Profile(model) {
            return ProfileSchema.findOne({ userId: model.id });
        }
    }

    static Query: any = {
        getUsers(_, __, context): Promise<Array<IUserModel>> {
            if(!context.user) return null;
            let promise = new Promise<Array<IUserModel>>((resolve, reject) => {
                UserSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getUserById(_, { id }, context): Promise<IUserModel> {
            if(!context.user) return null;

            let promise = new Promise<IUserModel>((resolve, reject) => {
                UserSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getUserPage(_, { pageIndex = 1, pageSize = 10, user }, context) {
            if(!context.user) return null;
            var skip=(pageIndex - 1) * pageSize
            var userInfo = UserSchema.find(user).skip(skip).limit(pageSize)
            return userInfo;
        },

        getUserWhere(_, { user }, context) {
            if(!context.user) return null;
            var users = UserSchema.find(user);
            return users;
        },

        getUserCount(_, { user }, context) {
            if(!context.user) return 0;
            var count = UserSchema.count(user);
            return count;
        },

        login(_, { user }, context) {
            if(!user) return null;
            return new Promise<any>((resolve, reject) => {
                UserSchema.findOne(user).then(data => {
                    context.session.user = data;
                    resolve(data);
                })
            })
        },
        logOut(_, { }, context) {
            context.user=null;
            context.session.user=null;
            return true;
        },
        currentUser(_, { }, context) {
            if(!context.user) return null;
            let promise = new Promise<IUserModel>((resolve, reject) => {
                let user = context.user;
                if (user) {
                    UserSchema.findById(user._id).then(res => {
                        resolve(res);
                    }).catch(err => resolve(null));
                }else{
                    resolve(null);
                }
            });
            return promise;

        },
    }

    static Mutation: any = {
        saveUser(_, { user }, context) {
            if(!context.user) return null;
            if (user.id) {
                return new Promise<IUserModel>((resolve, reject) => {
                    UserSchema.findByIdAndUpdate(user.id, user, (err, res) => {
                        Object.assign(res, user);
                        resolve(res);
                    })
                });
            }
            return UserSchema.create(user)
        },

        deleteUser(_, { id }, context): Promise<Boolean> {
            if(!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                UserSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}



