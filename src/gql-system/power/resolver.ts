import PowerSchema, { IPowerModel } from './power';
import { DocumentQuery, MongoosePromise } from 'mongoose';

export class Power {

    constructor() {

    }


    static Query: any = {

        getPowers(_, __, context): Promise<Array<IPowerModel>> {
            let promise = new Promise<Array<IPowerModel>>((resolve, reject) => {
                PowerSchema.find().then(res => {
                    resolve(res);
                }).catch(err=>resolve(null));
            });
            return promise;
        },

        getPowerById(_, { id }, context): Promise<IPowerModel> {
            let promise = new Promise<IPowerModel>((resolve, reject) => {
                PowerSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err=>resolve(null));
            });
            return promise;
        },

        getPowerPage(_, { pageIndex = 1, pageSize = 10, power }, context):
            DocumentQuery<Array<IPowerModel>, IPowerModel> {
            var list = PowerSchema.find(power).skip((pageIndex - 1) * pageSize).limit(pageSize)
            return list;
        },

        getPowerCount(_, { power }, context) {
            var count = PowerSchema.count(power);
            return count;
        },

        getPowerWhere(_, { power }, context) { 
            var users = PowerSchema.find(power);
            return users;
        },
    }

    static Mutation: any = {
        createPower (_, { power }, context): MongoosePromise<Array<IPowerModel>> {
            return PowerSchema.create(power)
        },
        updatePower (_, { id, power }, context) {
            let promise = new Promise<IPowerModel>((resolve, reject) => {
                PowerSchema.findByIdAndUpdate(id, power, (err, res) => {
                    Object.assign(res, power);
                    resolve(res);
                })
            });

            return promise;
        },
        deletePower(_, { id }, context): Promise<Boolean> {
            let promise = new Promise<Boolean>((resolve, reject) => {
                PowerSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        },
        addAllPower(_, { power }, context):MongoosePromise<Array<IPowerModel>> {
            return PowerSchema.create(power); 
        },
        delAllPower(_, { power }, context): Promise<Boolean> {
            let promise = new Promise<Boolean>((resolve, reject) => {
                if(!power) resolve(false);
                PowerSchema.find(power).remove((err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        }
    }
}