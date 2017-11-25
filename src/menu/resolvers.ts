import MenuSchema, { IMenuModel } from './menu';
import { DocumentQuery, MongoosePromise } from 'mongoose';

export class MenuResolver {

    constructor() {
    }


    static Query: any = {

        getMenus(_, __, context): Promise<Array<IMenuModel>> {
            let promise = new Promise<Array<IMenuModel>>((resolve, reject) => {
                MenuSchema.find().then(res => {
                    resolve(res);
                });
            });
            return promise;
        },

        getMenuById(_, { id }, context): Promise<IMenuModel> {
            let promise = new Promise<IMenuModel>((resolve, reject) => {
                MenuSchema.findById(id).then(res => {
                    resolve(res);
                });
            });
            return promise;
        },

        getMenuPage(_, { pageIndex = 1, pageSize = 10, Menu }, context):
            DocumentQuery<Array<IMenuModel>, IMenuModel> {
            var userInfo = MenuSchema.find(Menu).skip((pageIndex - 1) * pageSize).limit(pageSize)
            return userInfo;
        },

        getMenuCount(_, { menu }, context) {
            var count = MenuSchema.count(menu);
            return count;
        },

        getMenuWhere(_, { menu }, context) {
            var users = MenuSchema.find(menu);
            return users;
        },
    }

    static Mutation: any = {
        createMenu (_, { menu }, context): MongoosePromise<Array<IMenuModel>> {
            return MenuSchema.create(menu)
        },
        updateMenu (_, { id, menu }, context) {
            let promise = new Promise<IMenuModel>((resolve, reject) => {
                MenuSchema.findByIdAndUpdate(id, menu, (err, res) => {
                    Object.assign(res, menu);
                    resolve(res);
                })
            });

            return promise;
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