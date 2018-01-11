import AdvertmSchema, { IAdvertmModel } from './advertm';
import { DocumentQuery, MongoosePromise } from 'mongoose';
export class Advertm {
    constructor() {

    }

    static Query: any = {
        getAdvertm(parent, { }, context): Promise<Array<IAdvertmModel>> {
            if (!context.user) return null;

            let promise = new Promise<Array<IAdvertmModel>>((resolve, reject) => {
                AdvertmSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },
    }

    static Mutation: any = {
        saveAdvertm(parent, { adverm }, context) {
            if (!context.user) return null;
            if (adverm.id) {
                return new Promise<IAdvertmModel>((resolve, reject) => {
                    AdvertmSchema.findByIdAndUpdate(adverm.id, adverm, (err, res) => {
                        Object.assign(res, adverm);
                        resolve(res);
                    })
                });
            }
            return AdvertmSchema.create(adverm);
        }
    }
}