import PowerSchema, { IPowerModel } from './power';
import { DocumentQuery, MongoosePromise } from 'mongoose';

export class PowerResolver {

    constructor() {

    }


    static Query: any = {

        getPowers(_, __, context): Promise<Array<IPowerModel>> {
            let promise = new Promise<Array<IPowerModel>>((resolve, reject) => {
                PowerSchema.find().then(res => {
                    resolve(res);
                });
            });
            return promise;
        },

        getPowerById(_, { id }, context): Promise<IPowerModel> {
            let promise = new Promise<IPowerModel>((resolve, reject) => {
                PowerSchema.findById(id).then(res => {
                    console.log(res);
                    resolve(res);
                });
            });
            return promise;
        },

        getPowerPage(_, { pageIndex = 1, pageSize = 10, power }, context):
            DocumentQuery<Array<IPowerModel>, IPowerModel> {
            var userInfo = PowerSchema.find(power).skip((pageIndex - 1) * pageSize).limit(pageSize)
            return userInfo;
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
        }
    }
}