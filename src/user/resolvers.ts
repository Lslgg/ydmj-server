import UserSchema, { IUserModel } from './user';
import RoleSchema from '../role/role';

import { DocumentQuery, MongoosePromise } from 'mongoose';

export class UserResolver {

    private userModel: IUserModel;

    constructor(userModel: IUserModel) {
        this.userModel = userModel;
    }

    static User: any = {
        Role(model) {
            return RoleSchema.findById(model.roleId);
        }
    }

    static Query: any = {

        getUsers(_, __, context): Promise<Array<IUserModel>> {
            let promise = new Promise<Array<IUserModel>>((resolve, reject) => {
                var users = UserSchema.find().then(res => {
                    resolve(res);
                }).catch(err=>resolve(null));
            });
            return promise;
        },

        getUserById(_, { id }, context): Promise<IUserModel> {
            let promise = new Promise<IUserModel>((resolve, reject) => {
                var users = UserSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err=>resolve(null));
            });
            return promise;
        },

        getUserPage(_, { pageIndex = 1, pageSize = 10, user }, context):
            DocumentQuery<Array<IUserModel>, IUserModel> {
            var userInfo = UserSchema.find(user).skip((pageIndex - 1) * pageSize).limit(pageSize)
            return userInfo;
        },

        getUserWhere(_, { user }, context) {
            var users = UserSchema.find(user);
            return users;
        },

        getUserCount(_, { user }, context) {
            var count = UserSchema.count(user);
            return count;
        },

        login(_, { user }, context): DocumentQuery<IUserModel, IUserModel> {
            var users = UserSchema.findOne(user)
            return users
        },
    }

    static Mutation: any = {

        createUser(_, { user }, context): MongoosePromise<Array<IUserModel>> {
            return UserSchema.create(user)
        },

        updateUser(_, { id, user }, context) {
            let promise = new Promise<IUserModel>((resolve, reject) => {
                UserSchema.findByIdAndUpdate(id, user, (err, res) => {
                    Object.assign(res, user);
                    resolve(res);
                })
            });

            return promise;
        },

        deleteUser(_, { id }, context): Promise<Boolean> {
            let promise = new Promise<Boolean>((resolve, reject) => {
                UserSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}



