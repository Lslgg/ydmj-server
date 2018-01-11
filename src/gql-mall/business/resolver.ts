import BusinessSchema, { IBusinessModel } from './business';
import { DocumentQuery, MongoosePromise } from 'mongoose';

export class Business{
    constructor(){
  
    }

    static Query:any={
        getBusiness(parent, {}, context): Promise<Array<IBusinessModel>> {
            if(!context.user) return null;

            let promise = new Promise<Array<IBusinessModel>>((resolve, reject) => {
                BusinessSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },
    }

    static Mutation: any = {
        saveBusiness(parent, { business }, context) {
            if(!context.user) return null;

            if (business.id) {
                return new Promise<IBusinessModel>((resolve, reject) => {
                    BusinessSchema.findByIdAndUpdate(business.id, business, (err, res) => {
                        Object.assign(res, business);
                        resolve(res);
                    })
                });
            }
            return BusinessSchema.create(business)
        }
    }
}