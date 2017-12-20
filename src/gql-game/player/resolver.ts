import { MysqDB } from '../../common/sequelize';

export class Player {

    static mysql = new MysqDB("t_user");

    constructor() {

    }

    static Query = {
        getPlayers(_, __, context) {
            return Player.mysql.find();
        },
        getPlayerById(_, { id }, context) {
            return Player.mysql.findById(id);
        },
        getPlayerPage(_, { pageIndex = 1, pageSize = 10, where, order }, context) {
            order = order ? "ORDER BY cardNum" : order;
            return Player.mysql.findPage(pageIndex, pageSize, where, order)
        },

        getPlayerCount(_, { where }, context) {
            return Player.mysql.findCount(where);
        },
        getPlayerWhere(_, { where, order }, context) {
            return Player.mysql.findWhere(where);
        }
    }

    static Mutation = {
        updatePlayerCard(_, { id, cardNum }, context) {
            var upSql = `cardNum=cardNum+${cardNum}`;
            var where = `id=${id}`;
            return Player.mysql.updateByStr(upSql, where);
        }
    }
}
