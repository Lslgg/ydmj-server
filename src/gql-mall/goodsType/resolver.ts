import GoodsTypeSchema, { IGoodsTypeModel } from './goodsType';
import { DocumentQuery, MongoosePromise } from 'mongoose';
import BusinessSchema from '../business/business';
export class GoodsType{
    constructor(){
  
    }

    static GoodsType: any = {
        Business(model) {            
            return BusinessSchema.findById(model.business_id);
        },        
    }

    static Query:any={
        getGoodsType(parent, {}, context): Promise<Array<IGoodsTypeModel>> {
            if(!context.user) return null;

            let promise = new Promise<Array<IGoodsTypeModel>>((resolve, reject) => {
                GoodsTypeSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },        
    }

    static Mutation: any = {
        saveGoodsType(parent, { goodsType }, context) {
            if(!context.user) return null;        
            if (goodsType.id) {
                return new Promise<IGoodsTypeModel>((resolve, reject) => {
                    GoodsTypeSchema.findByIdAndUpdate(goodsType.id, goodsType, (err, res) => {
                        Object.assign(res, goodsType);
                        resolve(res);
                    })
                });
            }
            return GoodsTypeSchema.create(goodsType)
        }
    }
}