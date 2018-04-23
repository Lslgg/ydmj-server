import AdvertmSchema, { IAdvertmModel } from './advertm';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import { FileManager } from '../../common/file/fileManager';
import { resolve } from 'url';
import { reject } from 'bluebird';

export class Advertm {

    constructor() { }

    static Advertm: any = {
        Images(model) {
            let promise = new Promise<Array<any>>((resolve, reject) => {
                let fm = new FileManager();
                let imgs = fm.getFileByIds(model.imageIds);
                resolve(imgs);
            });
            return promise;
        }
    };

    static Query: any = {

        async getAdvertm(parent, { }, context): Promise<Array<IAdvertmModel>> {

            if (!context.user) return null;

            return await AdvertmSchema.find();
        },

        async getAdvertmById(parent, { id }, context): Promise<IAdvertmModel> {

            if (!context.user) return null;

            return await AdvertmSchema.findById(id);
        },

        async getAdvertmPage(parent, { pageIndex = 1, pageSize = 10, advertm }, context): Promise<IAdvertmModel[]> {

            if (!context.user) return null;

            var skip = (pageIndex - 1) * pageSize;

            return await AdvertmSchema.find(advertm).skip(skip).limit(pageSize);
        },

        async getAdvertmWhere(parent, { advertm }, context): Promise<IAdvertmModel[]> {

            if (!context.user) return null;

            return await AdvertmSchema.find(advertm);
        },

        async getAdvertmCount(parent, { user }, context): Promise<Number> {

            if (!context.user) return null;

            return await AdvertmSchema.count(user);
        },

    }

    static Mutation: any = {
<<<<<<< HEAD
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
=======

        async saveAdvertm(parent, { advertm }, context): Promise<any> {

            if (!context.user || !context.session.isManger) return null;

            if (advertm.id && advertm.id != "0") {
                let res = await AdvertmSchema.findByIdAndUpdate(advertm.id, advertm);
                Object.assign(res, advertm);
                return res;
            }

            return await AdvertmSchema.create(advertm);
>>>>>>> 4c46324f89109bf7ee79710b0760e625ecc3e908
        },

        async deleteAdvertm(parent, { id }, context): Promise<Boolean> {

            if (!context.user || !context.session.isManger) return null;

            return (await AdvertmSchema.findByIdAndRemove(id) != null);

        }

    }
}