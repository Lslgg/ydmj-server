import { MysqDB } from '../../common/sequelize';

export class Dealer {

    static mysql = new MysqDB("t_dealers");

    constructor() {

    }

    static Query = {
        getDealers(parent, __, context) {
            if(!context.user) return null;

            return Dealer.mysql.find();
        },

        getDealerById(parent, { id }, context) {
            if(!context.user) return null;

            return Dealer.mysql.findById(id);
        },

        getDealerPage(parent, { pageIndex = 1, pageSize = 10, where, order }, context) {
            if(!context.user) return null;

            return Dealer.mysql.findPage(pageIndex, pageSize, where, order)
        },

        getDealerCount(parent, { where }, context) {
            if(!context.user) return null;

            return Dealer.mysql.findCount(where);
        },

        getDealerWhere(parent, { where, order }, context) {
            if(!context.user) return null;

            return Dealer.mysql.findWhere(where, order);
        }
    }

    static Mutation = {
        saveDealer(parent, { dealer }, context) {
            if(!context.user) return null;

            if (dealer.id) {
                return Dealer.mysql.update(dealer, dealer.id);
            }
            return Dealer.mysql.add(dealer);
        },

        deleteDealer(parent, { id }, context) {
            if(!context.user) return null;

            return Dealer.mysql.delete(id);
        }
    }
}
