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
        getAdvertmById(parent, { id }, context): Promise<IAdvertmModel> {
            if (!context.user) return null;

            let promise = new Promise<IAdvertmModel>((resolve, reject) => {
                AdvertmSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getAdvertmPage(parent, { pageIndex = 1, pageSize = 10, advertm }, context) {
            if (!context.user) return null;
            var skip = (pageIndex - 1) * pageSize
            var advertmInfo = AdvertmSchema.find(advertm).skip(skip).limit(pageSize)
            return advertmInfo;
        },

        getAdvertmWhere(parent, { advertm }, context) {
            if (!context.user) return null;
            var advertms = AdvertmSchema.find(advertm);
            return advertms;
        },

        getAdvertmCount(parent, { user }, context) {
            if (!context.user) return 0;
            var count = AdvertmSchema.count(user);
            return count;
        },
    }

    static Mutation: any = {
        saveAdvertm(parent, { adverm }, context) {
            if (!context.user) return null;
            if (adverm.id && adverm.id != "0") {
                return new Promise<IAdvertmModel>((resolve, reject) => {
                    AdvertmSchema.findByIdAndUpdate(adverm.id, adverm, (err, res) => {
                        Object.assign(res, adverm);
                        resolve(res);
                    })
                });
            }
            return AdvertmSchema.create(adverm);
        },
        deleteAdvertm(parent, { id }, context): Promise<Boolean> {
            if (!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                AdvertmSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}