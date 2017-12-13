import * as Sequelize from 'sequelize';

export class MysqDB {

    sequelize: Sequelize.Sequelize;

    private tName:string;
    
    constructor(tName:string) {
        this.tName=tName;
        this.sequelize = new Sequelize("game", "root", "root", {
            host: "localhost",
            dialect: 'mysql',
            pool: {max: 5,min: 0,idle: 30000}
        });
    }
    /**
     * 根据传入的sql语句查询，
     * 适用于复杂查询
     * @param sql 
     */
    findSql(sql: string) {
        this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT });
    }

    /**
     * 查询所有
     * @param sql 
     */
    find() {
        var sql = `select * from ${this.tName}`;
        this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT });
    }
 
    /**
     * 根据ID查找
     * @param id 
     */
    findById(id: number) {
        var sql = `select * from ${this.tName} where id=${id}`;
        let promise=new Promise<object>((resolve,reject)=>{
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT }).then(data=>{
                resolve(data[0])
            }).catch(err=>reject(err));
        })

        return promise;
       
    }
    /**
     * 根据条件分页查找 
     * @param pageIndex 
     * @param pageSize 
     * @param where 
     */
    findPage(pageIndex: number, pageSize: number, where: string = "1=1",order:string="") {
        var sql = `select * from ${this.tName} where ${where}  ${order} LIMIT ${(pageIndex - 1) * pageSize}, ${pageSize}`;
        return this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT });
    }
    
    /**
     * 根据条件查找总数
     * @param where 
     */
    findCount(where: string = "1=1") {
        var sql = `select count(*) count from ${this.tName} where ${where}`;
        var promise=new Promise<Number>((resolve,reject)=>{
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT }).then(result=>{
                var count=result[0]["count"];
                resolve(count);
            })
        })
        return promise;
    }
    /**
     * 根据条件查找
     * @param where 
     */
    findWhere(where: string = "1=1") {
        var sql = `select * from ${this.tName} where ${where}`;
        return this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT });
    }
    /**
     * 添加
     * @param field
     * @param fieldValue 
     *  
     */
    add(field: string,fieldValue:string) {
        var sql=`INSERT INTO ${this.tName} (${field}) VALUES (${fieldValue})`
        let promise=new Promise<boolean>((resolve,reject)=>{
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.INSERT })
            .then(data=> resolve(data[1])).catch(error=>reject(error))
        })
        return promise
    }
    /**
     * 修改
     * @param sql 
     */
    update(updateStr: string,where:string=" 1=1 ") {
        var sql=`UPDATE ${this.tName} SET ${updateStr} WHERE ${where}`
        let promise=new Promise<boolean>((resolve,reject)=>{
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.UPDATE })
            .then(data=> resolve(data[1])).catch(error=>reject(error))
        })
        return promise
    }
    /**
     * 删除
     * @param where 
     */
    delete(where: string=" 1=1 ") {
        var sql=`delete from ${this.tName} where ${where}`
        let promise=new Promise<boolean>((resolve,reject)=>{
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.DELETE })
            .then(data=> resolve(data[1])).catch(error=>reject(error))
        })
        return promise
    }
}
