import * as Sequelize from 'sequelize';

export class MysqDB {

    sequelize: Sequelize.Sequelize;

    private tName: string;

    constructor(tName: string) {
        this.tName = tName;
        this.sequelize = new Sequelize("game", "root", "123456", {
            host: "localhost",
            dialect: 'mysql',
            pool: { max: 5, min: 0, idle: 30000 },
            operatorsAliases: false,
            logging:false,
            dialectOptions: {
                multipleStatements: true
            },
        });
    }
    /**
     * 根据传入的sql语句查询，
     * 适用于复杂查询
     * @param sql 
     */
    findSql(sql: string): Promise<{}> {
        let promise = new Promise<{}>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT }).then(data => {
                resolve(data)
            }).catch(error => reject(error));
        })
        return promise;
    }

    /**
     * 查询所有
     * @param sql 
     */
    find(): Promise<{}> {
        var sql = `SELECT * FROM ${this.tName}`;
        let promise = new Promise<{}>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT }).then(data => {
                resolve(data)
            }).catch(error => reject(error));
        })
        return promise;
    }

    /**
     * 根据ID查找
     * @param id 
     */
    findById(id: string): Promise<{}> {
        var sql = `SELECT * FROM ${this.tName} WHERE id=${id}`;
        let promise = new Promise<object>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT }).then(data => {
                resolve(data[0])
            }).catch(err => reject(err));
        })

        return promise;

    }
    /**
     * 根据条件分页查找 
     * @param pageIndex 
     * @param pageSize 
     * @param where 
     */
    findPage(pageIndex: number, pageSize: number, where: string = "1=1", order: string = "id"): Promise<{}> {
        var sql = `SELECT * FROM ${this.tName} WHERE ${where}  
                ORDER BY ${order} LIMIT ${(pageIndex - 1) * pageSize}, ${pageSize}`;
        let promise = new Promise<{}>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT }).then(data => {
                resolve(data)
            }).catch(error => reject(error));
        });
        return promise;
    }

    /**
     * 根据条件查找总数
     * @param where 
     */
    findCount(where: string = "1=1"): Promise<Number> {
        var sql = `SELECT count(*) count FROM ${this.tName} WHERE ${where}`;
        var promise = new Promise<Number>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT }).then(result => {
                var count = result[0]["count"];
                resolve(count);
            })
        })
        return promise;
    }
    /**
     * 根据条件查找
     * @param where 
     */
    findWhere(where: string = "1=1", order: string = ""): Promise<{}> {
        var sql = `SELECT * FROM ${this.tName} WHERE ${where} ${order}`;
        let promise = new Promise<{}>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT }).then(data => {
                resolve(data)
            }).catch(error => reject(error))
        });
        return promise;
    }
    /**
     * 添加
     * @param info
     * @return 添加的对象
     */
    add(info: object): Promise<{}> {
        var {fields,fieldValues} = this.toAddStr(info);
        var sql = `INSERT INTO ${this.tName} (${fields}) VALUES (${fieldValues});
                SELECT LAST_INSERT_ID() as id;`;

        let promise = new Promise<{}>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT })
                .then(data => {
                    var id = data[1][0]["id"];
                    if (!id) { resolve(null); return; }
                    this.findById(id).then(data => resolve(data));
                }).catch(error => reject(error))
        })
        return promise
    }
    /**
     * 修改
     * @param sql 
     * @return 修改的对象
     */
    update(dealer: object, id: string): Promise<{}> {
        var updateStr = this.toUpStr(dealer);
        var sql = `UPDATE ${this.tName} SET ${updateStr} WHERE id="${id}"`;

        let promise = new Promise<{}>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.UPDATE })
                .then(data => {
                    this.findById(id).then(data => resolve(data))
                }).catch(error => reject(error))
        })
        return promise
    }
    /**
    * 修改
    * @param sql 
    * @return 是否成功
    */
    updateByStr(updateStr: string, where: string = " 1=1 "): Promise<boolean> {
        var sql = `UPDATE ${this.tName} SET ${updateStr} WHERE ${where}`;
        let promise = new Promise<boolean>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.UPDATE })
                .then(data => resolve(data[1])).catch(error => reject(error))
        })
        return promise
    }
    /**
     * 删除
     * @param where 
     * @return 是否成功
     */
    delete(id: string): Promise<boolean> {
        var sql = `DELETE FROM ${this.tName} WHERE id="${id}"`;
        let promise = new Promise<boolean>((resolve, reject) => {
            this.sequelize.query(sql, { type: this.sequelize.QueryTypes.DELETE })
                .then(data => {
                    resolve(!data);
                }).catch(error => reject(error))
        })
        return promise
    }

    /**
     * 将对象转换为修改的字符串
     * @param info 
     */
    private toUpStr(info: object): string {
        var str = JSON.stringify(info);
        if (!str) return "";
        str = str.replace(/(":)/g, "=");
        str = str.replace(/(,")/g, ",");
        str = str.replace(/({")/g, "");
        str = str.replace(/(})/g, "");
        return str;
    }
    
    /**
     * 将对象转换为添加字符串
     * @param info 
     * @retrun 字段名和字段值
     */
    private toAddStr(info: object): { fields: string, fieldValues: string } {
        var keys = Object.keys(info);
        var values = Object.keys(info).map((key) => `"${info[key]}"`);

        var fields = keys.join(',');
        var fieldValues = values.join(',');
        return { fields, fieldValues };
    }

}
