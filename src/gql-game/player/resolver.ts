import { MysqDB } from '../../common/sequelize';

export class Player {

    static mysql = new MysqDB("t_user");

    constructor() {

    }

    static Query = {
        getPlayers(_, __, context) {
            if(!context.user) return null;

            return Player.mysql.find();
        },
        getPlayerById(_, { id }, context) {
            if(!context.user) return null;

            return Player.mysql.findById(id);
        },
        getPlayerPage(_, { pageIndex = 1, pageSize = 10, where, order }, context) {
            if(!context.user) return null;

            order = order ? "cardNum" : order;
            return Player.mysql.findPage(pageIndex, pageSize, where, order)
        },

        getPlayerCount(_, { where }, context) {
            if(!context.user) return null;

            return Player.mysql.findCount(where);
        },
        getPlayerWhere(_, { where, order }, context) {
            if(!context.user) return null;

            return Player.mysql.findWhere(where);
        }
    }

    static Mutation = {
        updatePlayerCard(_, { id, cardNum }, context) {
            if(!context.user) return null;

            var upSql = `cardNum=cardNum+${cardNum}`;
            var where = `id=${id}`;
            return Player.mysql.updateByStr(upSql, where);
        }
    }
}
