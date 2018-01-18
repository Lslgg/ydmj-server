import BusinessSchema, { IBusinessModel } from './business';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import UserSchema from '../../gql-system/user/user';
export class Business{
    constructor(){
  
    }

    static Business: any = {

        User(model) {            
            return UserSchema.findById(model.user_id);
        },        
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
        getBusinessById(parent, { id }, context): Promise<IBusinessModel> {
            if (!context.user) return null;
            
            let promise = new Promise<IBusinessModel>((resolve, reject) => {
                BusinessSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getBusinessPage(parent, { pageIndex = 1, pageSize = 10, business }, context) {
            if (!context.user) return null;
            console.log(context.user);
            var skip = (pageIndex - 1) * pageSize
            var businessInfo = BusinessSchema.find(business).skip(skip).limit(pageSize)
            return businessInfo;
        },

        getBusinessWhere(parent, { business }, context) {
            if (!context.user) return null;
            var businesses = BusinessSchema.find(business);
            return businesses;
        },

        getBusinessCount(parent, { business }, context) {
            if (!context.user) return 0;
            var count = BusinessSchema.count(business);
            return count;
        },    
    }

    static Mutation: any = {
        saveBusiness(parent, { business }, context) {
            if(!context.user) return null;
            
            if (business.id && business.id != "0") {
                return new Promise<IBusinessModel>((resolve, reject) => {
                    BusinessSchema.findByIdAndUpdate(business.id, business, (err, res) => {                        
                        Object.assign(res, business);
                        resolve(res);
                    })
                });
            }                        
            business.trans_times = 0;
            business.score = 0;
            return BusinessSchema.create(business)
        },
        deleteBusiness(parent, { id }, context): Promise<Boolean> {
            if (!context.user) return null;
            let promise = new Promise<Boolean>((resolve, reject) => {
                BusinessSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                }).catch(err => reject(err));
            });
            return promise;
        }
    }
}