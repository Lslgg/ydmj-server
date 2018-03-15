import AdvertmSchema, { IAdvertmModel } from './advertm';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import { FileManager } from '../../common/file/fileManager';
import { resolve } from 'url';
import { reject } from 'bluebird';
export class Advertm {

    constructor() {

    }

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
        getAdvertm(parent, { }, context): Promise<Array<IAdvertmModel>> {
            if (!context.user) return null;

            let promise = new Promise<Array<IAdvertmModel>>((resolve, reject) => {
                AdvertmSchema.find().then(res => {
                    resolve(res);
                    return;
                }).catch(err => resolve(null));
            })
            return promise;
        },
        getAdvertmById(parent, { id }, context): Promise<IAdvertmModel> {
            if (!context.user) return null;

            let promise = new Promise<IAdvertmModel>((resolve, reject) => {
                AdvertmSchema.findById(id).then(res => {
                    resolve(res);
                    return;
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getAdvertmPage(parent, { pageIndex = 1, pageSize = 10, advertm }, context): Promise<IAdvertmModel[]> {
            if (!context.user) return null;
            return new Promise<IAdvertmModel[]>((resolve, reject) => {
                var skip = (pageIndex - 1) * pageSize
                var advertmInfo = AdvertmSchema.find(advertm).skip(skip).limit(pageSize);
                resolve(advertmInfo);
                return;
            });
        },

        getAdvertmWhere(parent, { advertm }, context): Promise<IAdvertmModel[]> {
            if (!context.user) return null;
            return new Promise<IAdvertmModel[]>((resolve, reject) => {
                AdvertmSchema.find(advertm).then(info => {
                    resolve(info);                
                    return;
                });                
            }); 
        },

        getAdvertmCount(parent, { user }, context): Promise<Number> {
            if (!context.user) return null;
            return new Promise<Number>((resolve, reject) => {
                var count = AdvertmSchema.count(user);
                resolve(count);
                return;
            });
        },
    }

    static Mutation: any = {
        saveAdvertm(parent, { advertm }, context): Promise<any> {
            if (!context.user || !context.session.isManger) return null;
            return new Promise<any>((resolve, reject) => {
                if (advertm.id && advertm.id != "0") {
                    AdvertmSchema.findByIdAndUpdate(advertm.id, advertm, (err, res) => {
                        Object.assign(res, advertm);
                        resolve(res);
                        return;
                    })
                    return;
                }
                AdvertmSchema.create(advertm).then(info => {
                    resolve(info);
                    return;
                });
            });
        },
        deleteAdvertm(parent, { id }, context): Promise<Boolean> {
            if (!context.user || !context.session.isManger) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                AdvertmSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null);
                    return;
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}