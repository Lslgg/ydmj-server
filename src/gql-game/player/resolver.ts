import { MysqDB } from '../../common/sequelize';

export class Player {

    static mysql = new MysqDB("t_user");

    constructor() {

    }

    static Query = {
        getPlayers(parent, __, context) {
            if(!context.user) return null;

            return Player.mysql.find();
        },
        getPlayerById(parent, { id }, context) {
            if(!context.user) return null;

            return Player.mysql.findById(id);
        },
        getPlayerPage(parent, { pageIndex = 1, pageSize = 10, where, order }, context) {
            if(!context.user) return null;

            order = order ? "cardNum" : order;
            return Player.mysql.findPage(pageIndex, pageSize, where, order)
        },

        getPlayerCount(parent, { where }, context) {
            if(!context.user) return null;

            return Player.mysql.findCount(where);
        },
        getPlayerWhere(parent, { where, order }, context) {
            if(!context.user) return null;

            return Player.mysql.findWhere(where);
        }
    }

    static Mutation = {
        updatePlayerCard(parent, { id, cardNum }, context) {
            if(!context.user) return null;

            var upSql = `cardNum=cardNum+${cardNum}`;
            var where = `id=${id}`;
            return Player.mysql.updateByStr(upSql, where);
        }
    }
}
