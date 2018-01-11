import GoodsSchema, { IGoodsModel } from './goods';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
export class Goods{
    constructor(){
  
    }

    static Goods: any = {

        Business(model) {            
            return BusinessSchema.findById(model.business_id);
        },
        
    }

    static Query:any={
        getGoods(parent, {}, context): Promise<Array<IGoodsModel>> {
            if(!context.user) return null;

            let promise = new Promise<Array<IGoodsModel>>((resolve, reject) => {
                GoodsSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },        
    }

    static Mutation: any = {
        saveGoods(parent, { goods }, context) {
            if(!context.user) return null;

            if (goods.id) {
                return new Promise<IGoodsModel>((resolve, reject) => {
                    GoodsSchema.findByIdAndUpdate(goods.id, goods, (err, res) => {
                        Object.assign(res, goods);
                        resolve(res);
                    })
                });
            }
            return GoodsSchema.create(goods)
        }
    }
}