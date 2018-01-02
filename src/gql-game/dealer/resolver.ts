import { MysqDB } from '../../common/sequelize';

export class Dealer {

    static mysql = new MysqDB("t_dealers");

    constructor() {

    }

    static Query = {
        getDealers(_, __, context) {
            if(!context.user) return null;

            return Dealer.mysql.find();
        },

        getDealerById(_, { id }, context) {
            if(!context.user) return null;

            return Dealer.mysql.findById(id);
        },

        getDealerPage(_, { pageIndex = 1, pageSize = 10, where, order }, context) {
            if(!context.user) return null;

            return Dealer.mysql.findPage(pageIndex, pageSize, where, order)
        },

        getDealerCount(_, { where }, context) {
            if(!context.user) return null;

            return Dealer.mysql.findCount(where);
        },

        getDealerWhere(_, { where, order }, context) {
            if(!context.user) return null;

            return Dealer.mysql.findWhere(where, order);
        }
    }

    static Mutation = {
        saveDealer(_, { dealer }, context) {
            if(!context.user) return null;

            if (dealer.id) {
                return Dealer.mysql.update(dealer, dealer.id);
            }
            return Dealer.mysql.add(dealer);
        },

        deleteDealer(_, { id }, context) {
            if(!context.user) return null;

            return Dealer.mysql.delete(id);
        }
    }
}
