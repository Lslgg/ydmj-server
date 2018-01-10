import { MysqDB } from '../../common/sequelize';

export class Order {

    static mysql = new MysqDB("t_order");

    constructor() {

    }

    static Query = {
        getOrderPage(parent, { pageIndex = 1, pageSize = 10, where = " 1=1 ", order = "id" }, context) {
            if(!context.user) return null;

            var sql = `SELECT tr.id,tr.userId,tu.name, td.name dealerName,
                        tr.cards card,tr.cost cost, FROM_UNIXTIME(tr.createTime/1000) createTime,td.id dealerId
                        FROM t_order tr JOIN t_user tu ON tr.userId = tu.id JOIN t_dealers td ON tu.code=td.id
                        WHERE tr.state=1  and ${where} ORDER BY ${order} LIMIT ${(pageIndex - 1) * pageSize}, ${pageSize}`;
            return Order.mysql.findSql(sql)
        },

        getOrderCount(parent, { where }, context) {
            if(!context.user) return null;

            var sql = `SELECT count(*) count
                    FROM t_order tr JOIN t_user tu ON tr.userId = tu.id JOIN t_dealers td ON tu.code=td.id
                    WHERE tr.state=1  and ${where}`;
            let promise = new Promise((resolve, reject) => {
                Order.mysql.findSql(sql).then(result => {
                    var count = result[0]["count"];
                    resolve(count);
                })
            })
            return promise;
        },

        getOrderCardCost(parent, { where = " 1=1 " }, context) {
            if(!context.user) return null;

            var sql = `SELECT  
                        COUNT(*) count,
                        SUM(tr.cards) card,
                        SUM(tr.cost) cost 
                      FROM t_order tr JOIN t_user tu ON tr.userId = tu.id JOIN t_dealers td ON tu.code=td.id
                      WHERE tr.state=1 and ${where}`;
            let promise = new Promise((resolve, reject) => {
                Order.mysql.findSql(sql).then(result => {
                    var count = result[0];
                    resolve(count);
                })
            })
            return promise;
        }
    }

    static Mutation = {

    }
}
