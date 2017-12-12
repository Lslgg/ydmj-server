import RoleSchema, { IRoleModel, RolePowerSchema, IRolePowerModel, ToObjectId } from './role';
import PowerScheam, { IPowerModel } from '../power/power';

import { DocumentQuery, MongoosePromise } from 'mongoose';

export class Role {

    constructor() {
    }

    static Role: any = {
        Powers(model, info) {
            let promise = new Promise<Array<IPowerModel>>((resolve, reject) => {
                RolePowerSchema.find({ roleId: model.id }).then(res => {
                    var powerIds = res.map(p => p.powerId);
                    PowerScheam.find({ '_id': { $in: powerIds } }).skip(0).limit(info.limit).then(res => {
                        resolve(res);
                    }).catch(err => resolve(null))
                })
            })
            return promise;
        }
    }

    static Query: any = {

        getRoles(_, __, context): Promise<Array<IRoleModel>> {
            let promise = new Promise<Array<IRoleModel>>((resolve, reject) => {
                RoleSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getRoleById(_, { id }, context): Promise<IRoleModel> {
            let promise = new Promise<IRoleModel>((resolve, reject) => {
                RoleSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getRolePage(_, { pageIndex = 1, pageSize = 10, role }, context):
            DocumentQuery<Array<IRoleModel>, IRoleModel> {
            var userInfo = RoleSchema.find(role).skip((pageIndex - 1) * pageSize).limit(pageSize)
            return userInfo;
        },

        getRoleCount(_, { role }, context) {
            var count = RoleSchema.count(role);
            return count;
        },

        getRoleWhere(_, { role }, context) {
            var users = RoleSchema.find(role);
            return users;
        },
    }

    static Mutation: any = {
        createRole(_, { role }, context): MongoosePromise<Array<IRoleModel>> {
            return RoleSchema.create(role)
        },
        updateRole(_, { id, role }, context) {
            let promise = new Promise<IRoleModel>((resolve, reject) => {
                RoleSchema.findByIdAndUpdate(id, role, (err, res) => {
                    Object.assign(res, role);
                    resolve(res);
                })
            });

            return promise;
        },
        deleteRole(_, { id }, context): Promise<Boolean> {
            let promise = new Promise<Boolean>((resolve, reject) => {
                RoleSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        },
        addRolePower(_, { rolePower }, context) {
            return new Promise<IRoleModel>((resolve, reject) => {
                RolePowerSchema.create(rolePower, (err, res) => {
                    if (err != null) reject(err);
                    RoleSchema.findById(rolePower.roleId).then(res => {
                        resolve(res)
                    })
                }).catch(err => { resolve(err) })
            })
        },
        addAllRolePower(_, { rolePower }, context) {
            return new Promise<IRoleModel>((resolve, reject) => {
                RolePowerSchema.create(rolePower, (err, res) => {
                    if (err != null) reject(err);
                    if(rolePower.length<0) resolve(null);
                    RoleSchema.findById(rolePower[0].roleId).then(res => {
                        resolve(res)
                    })
                }).catch(err => { resolve(err) })
            })
        },

        delPowerbyRoleId(_, { roleId }, context) {
            let promise = new Promise<Boolean>((resolve, reject) => {
                RolePowerSchema.find({ roleId: roleId }).remove().then(res => {
                    resolve(true);
                })
            });
            return promise;
        },
        delPowerbyId(_, { id }, context) {
            let promise = new Promise<Boolean>((resolve, reject) => {
                RolePowerSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        },
        delAllPowerbyId(_, { roleId, id }, context) {
            let promise = new Promise<Boolean>((resolve, reject) => {
                RolePowerSchema.find({ powerId: { $in: id },roleId: roleId  }).remove().then(res => {
                    resolve(true);
                }).catch(err => resolve(err)) 
            });
            return promise;
        }
    }
}