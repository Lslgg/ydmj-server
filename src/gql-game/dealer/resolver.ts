import { MysqDB } from '../../common/sequelize';

export class Dealer {

    static mysql = new MysqDB("t_dealers");

    constructor() {

    }

    static Query = {
        getDealers(_, __, context) {
            return Dealer.mysql.find();
        },

        getDealerById(_, { id }, context) {
            return Dealer.mysql.findById(id);
        },

        getDealerPage(_, { pageIndex = 1, pageSize = 10, where, order }, context) {
            return Dealer.mysql.findPage(pageIndex, pageSize, where, order)
        },

        getDealerCount(_, { where }, context) {
            return Dealer.mysql.findCount(where);
        },

        getDealerWhere(_, { where, order }, context) {
            return Dealer.mysql.findWhere(where,order);
        }
    }

    static Mutation = {
        createDealer(_, { dealer }, context) {
            return Dealer.mysql.add(dealer);
        },

        updateDealer(_, { id, dealer }, context) {
            return Dealer.mysql.update(dealer, id);
        },

        deleteDealer(_, { id }, context) {
            return Dealer.mysql.delete(id);        
        } 
    }
}
