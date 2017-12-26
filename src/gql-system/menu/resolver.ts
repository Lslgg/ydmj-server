import MenuSchema, { IMenuModel } from './menu';
import { DocumentQuery, MongoosePromise } from 'mongoose';

export class Menu {

    constructor() {
    }


    static Query: any = {

        getMenus(_, __, context): Promise<Array<IMenuModel>> {
            let promise = new Promise<Array<IMenuModel>>((resolve, reject) => {
                MenuSchema.find().then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            })
            return promise;
        },

        getMenuById(_, { id }, context): Promise<IMenuModel> {
            let promise = new Promise<IMenuModel>((resolve, reject) => {
                MenuSchema.findById(id).then(res => {
                    resolve(res);
                }).catch(err => resolve(null));
            });
            return promise;
        },

        getMenuPage(_, { pageIndex = 1, pageSize = 10, menu }, context) {
            var userInfo = MenuSchema.find(menu)
                .skip((pageIndex - 1) * pageSize).limit(pageSize)
            return userInfo;
        },

        getMenuCount(_, { menu }, context) {
            var count = MenuSchema.count(menu);
            return count;
        },

        getMenuWhere(_, { menu }, context) {
            //var users = MenuSchema.find({"pid":{"$in" : ["5a221555842273172c089eb1","5a2215d3842273172c089eb2"]}});
            return MenuSchema.find(menu);
        },
    }

    static Mutation: any = {
        saveMenu(_, { menu }, context) {
            if (menu.id) {
                return new Promise<IMenuModel>((resolve, reject) => {
                    MenuSchema.findByIdAndUpdate(menu.id, menu, (err, res) => {
                        Object.assign(res, menu);
                        resolve(res);
                    })
                });
            }
            return MenuSchema.create(menu)
        },

        deleteMenu(_, { id }, context): Promise<Boolean> {
            let promise = new Promise<Boolean>((resolve, reject) => {
                MenuSchema.findByIdAndRemove(id, (err, res) => {
                    resolve(res != null)
                })
            });
            return promise;
        }
    }
}