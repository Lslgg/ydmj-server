import ProfileSchema, { IProfileModel } from './profile';
import RoleSchema from '../role/role';

import { DocumentQuery, MongoosePromise } from 'mongoose';

export class Profile {

    constructor() {
    }


    static Query: any = {

        getProfiles(parent, __, context): Promise<Array<IProfileModel>> {
            if(!context.user) return null;

            let promise = new Promise<Array<IProfileModel>>((resolve, reject) => {
                var proFiles = ProfileSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getProfileById(parent, { id }, context): Promise<IProfileModel> {
            if(!context.user) return null;

            let promise = new Promise<IProfileModel>((resolve, reject) => {
                var proFiles = ProfileSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getProfilePage(parent, { pageIndex = 1, pageSize = 10, profile }, context) {
            if(!context.user) return null;
            var skip=(pageIndex - 1) * pageSize;
            var proFileInfo = ProfileSchema.find(profile).skip(skip).limit(pageSize)
            return proFileInfo;
        },

        getProfileWhere(parent, { profile }, context) {
            if(!context.user) return 0;
            console.log(profile);
            var proFiles = ProfileSchema.find(profile);
            return proFiles;
        },

        getProfileCount(parent, { profile }, context) {
            if(!context.user) return null;            
            var count = ProfileSchema.count(profile);
            return count;
        },

        getProfileAggregate(parent, { profile }, context): Promise<{}> {
            if(!context.user) return null;

            let promise = new Promise<{}>((resolve, reject) => {
                ProfileSchema.aggregate([profile]
                ).then(data => resolve(data))
                    .catch(err => {
                        console.error(err);
                        reject(err);
                    });
            })

            return promise;
        }
    }

    static Mutation: any = {

        saveProfile(parent, { profile }, context) {
            if(!context.user) return null;
            
            if (profile.id && profile.id != "0") {
                return new Promise<IProfileModel>((resolve, reject) => {
                    ProfileSchema.findByIdAndUpdate(profile.id, profile, (err, res) => {
                        Object.assign(res, profile);
                        resolve(res);
                    })
                });
            }
            return ProfileSchema.create(profile)
        },

        deleteProfile(parent, { id }, context): Promise<Boolean> {
            if(!context.user) return null;
            
            let promise = new Promise<Boolean>((resolve, reject) => {
                ProfileSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        }
    }

}



