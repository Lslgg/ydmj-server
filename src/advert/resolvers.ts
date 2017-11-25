import AdvertSchema, { IAdvertModel } from './advert';
import { DocumentQuery, MongoosePromise } from 'mongoose';

export class AdvertResolver {

    constructor() {
    }


    static Query: any = {

        getAdverts(_, __, context): Promise<Array<IAdvertModel>> {
            let promise = new Promise<Array<IAdvertModel>>((resolve, reject) => {
                AdvertSchema.find().then(res => {
                    resolve(res);
                });
            });
            return promise;
        },

        getAdvertById(_, { id }, context): Promise<IAdvertModel> {
            let promise = new Promise<IAdvertModel>((resolve, reject) => {
                AdvertSchema.findById(id).then(res => {
                    resolve(res);
                });
            });
            return promise;
        },

        getAdvertPage(_, { pageIndex = 1, pageSize = 10, advert }, context):
            DocumentQuery<Array<IAdvertModel>, IAdvertModel> {
            var userInfo = AdvertSchema.find(advert).skip((pageIndex - 1) * pageSize).limit(pageSize)
            return userInfo;
        },

        getAdvertCount(_, { advert }, context) {
            var count = AdvertSchema.count(advert);
            return count;
        },

        getAdvertWhere(_, { advert }, context) {
            var users = AdvertSchema.find(advert);
            return users;
        },
    }

    static Mutation: any = {
        createAdvert (_, { advert }, context): MongoosePromise<Array<IAdvertModel>> {
            return AdvertSchema.create(advert)
        },
        updateAdvert (_, { id, advert }, context) {
            let promise = new Promise<IAdvertModel>((resolve, reject) => {
                AdvertSchema.findByIdAndUpdate(id, advert, (err, res) => {
                    Object.assign(res, advert);
                    resolve(res);
                })
            });

            return promise;
        },
        deleteAdvert(_, { id }, context): Promise<Boolean> {
            let promise = new Promise<Boolean>((resolve, reject) => {
                AdvertSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        }
    }
}