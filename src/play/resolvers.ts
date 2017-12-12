import { MysqDB } from '../common/sequelize';

export class Play {

    static mysql = new MysqDB("t_user");

    constructor() {

    }

    static Query = {
        getPlays(_, __, context) {
            return Play.mysql.find();
        },
        getPlayById(_, { id }, context) {
            return Play.mysql.findById(id);
        },
        getPlayPage(_, { pageIndex = 1, pageSize = 10, where }, context) {
            return Play.mysql.findPage(pageIndex, pageSize, where)
        },

        getPlayCount(_, { where }, context) {
            return Play.mysql.findCount(where);
        },
        getPlayWhere(_, { where }, context) {
            return Play.mysql.findWhere(where);
        }
    }

    static Mutation = {

    }
}
