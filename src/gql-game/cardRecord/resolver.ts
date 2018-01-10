import { MysqDB } from '../../common/sequelize';

export class CardRecord {

    static mysql = new MysqDB("t_card_record");

    constructor() {

    }

    static Query = {

        getCardRecordPage(parent, { pageIndex = 1, pageSize = 10, where = "1=1", order = "id" }, context) {
            if(!context.user) return null;

            var sql=`SELECT * FROM (${CardRecord.recordSql}) AS record WHERE ${where} ORDER BY ${order}  LIMIT ${(pageIndex - 1) * pageSize}, ${pageSize}`;
            return CardRecord.mysql.findSql(sql);
        },

        getCardRecordCount(parent, { where=" 1=1 " }, context) {
            if(!context.user) return null;
            
            var sql=`SELECT count(*) AS count FROM (${CardRecord.recordSql}) AS record WHERE ${where}`;
            let promise=new Promise<number>((resolve,rejcet)=>{
                CardRecord.mysql.findSql(sql).then(result => { 
                    var count = result[0]["count"];
                    resolve(count);
                })
            })
            
            return promise;
        },

        getCardRecordWhere(parent, { where=" 1=1 ", order=" id " }, context) {
            if(!context.user) return null;
            
            var sql=`SELECT * FROM (${CardRecord.recordSql}) AS record WHERE ${where} ORDER BY ${order}`;
            return CardRecord.mysql.findSql(sql);
        },

        getCardRecordStatistice(parent, { where=" 1=1 " }, context) {
            if(!context.user) return null;
            
            var sql=`SELECT SUM(changeNum) AS count  FROM (${CardRecord.recordSql}) AS record WHERE ${where}`;
            let promise = new Promise((resolve, reject) => {
                CardRecord.mysql.findSql(sql).then(result => {
                    var count = result[0]["count"];
                    count=count==null?0:count
                    resolve(count);
                }).catch(err=>reject(err));
            })
            return promise;
        }
    }

    static Mutation = {

    }



    //连表查询的消费房卡记录Str
    private static recordSql=` SELECT 
            tcr.id,
            tu.name AS userName,
            tcr.userId,
            td.name AS dealerName,
            td.id dealerId,
            tcr.changeNum,
            tcr.reason,
            tcr.createTime 
            FROM
            t_card_record AS tcr 
            INNER JOIN t_user AS tu 
                ON tcr.userId = tu.id 
            LEFT JOIN t_dealers AS td 
                ON tu.code = td.id 
            WHERE reason != 0 
            AND changeNum < 0`;

}
