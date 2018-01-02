import PowerSchema, { IPowerModel } from './power';
import { DocumentQuery, MongoosePromise } from 'mongoose';

export class Power {

    constructor() {

    }


    static Query: any = {

        getPowers(_, __, context): Promise<Array<IPowerModel>> {
            if(!context.user) return null;

            let promise = new Promise<Array<IPowerModel>>((resolve, reject) => {
                PowerSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getPowerById(_, { id }, context): Promise<IPowerModel> {
            if(!context.user) return null;

            let promise = new Promise<IPowerModel>((resolve, reject) => {
                PowerSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getPowerPage(_, { pageIndex = 1, pageSize = 10, power }, context) {
            if(!context.user) return null;
            var skip=(pageIndex - 1) * pageSize;
            var list = PowerSchema.find(power).skip(skip).limit(pageSize)
            return list;
        },

        getPowerCount(_, { power }, context) {
            if(!context.user) return 0;
            var count = PowerSchema.count(power);
            return count;
        },

        getPowerWhere(_, { power }, context) {
            if(!context.user) return null;
            
            var users = PowerSchema.find(power);
            return users;
        },
    }

    static Mutation: any = {
        savePower(_, { power }, context) {
            if(!context.user) return null;
            
            if (power.id) {
                return new Promise<IPowerModel>((resolve, reject) => {
                    PowerSchema.findByIdAndUpdate(power.id, power, (err, res) => {
                        Object.assign(res, power);
                        resolve(res);
                    })
                });
            }
            
            return PowerSchema.create(power)
        },

        deletePower(_, { id }, context): Promise<Boolean> {
            if(!context.user) return null;
            
            let promise = new Promise<Boolean>((resolve, reject) => {
                PowerSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        },
        addAllPower(_, { power }, context){
            if(!context.user) return null;
            
            return PowerSchema.create(power);
        },
        delAllPower(_, { power }, context): Promise<Boolean> {
            if(!context.user) return null;
            
            let promise = new Promise<Boolean>((resolve, reject) => {
                if (!power) resolve(false);
                PowerSchema.find(power).remove((err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        }
    }
}