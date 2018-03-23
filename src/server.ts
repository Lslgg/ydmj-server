import * as express from 'express';
import { express as middleware } from 'graphql-voyager/middleware';
import * as Mongoose from 'mongoose';
import schema from './schema';
import * as path from "path";

var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const expressValidator = require('express-validator');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var cors = require('cors');
var compression = require('compression');

var graphqlHTTP = require('express-graphql');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
var { makeExecutableSchema } = require('graphql-tools');
const expressPlayground = require('graphql-playground-middleware-express').default;
import { apolloUploadExpress } from 'apollo-upload-server';
import { UploadFile } from './common/file_server/uploadFile';
import { Engine } from 'apollo-engine';

class Server {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.config();
		this.routes();
	}

	private config() {
		//设置静态文件
		this.setStatic();
		//设置mongodb连接
		this.setMongodbInit();
		//设置cors 跨域
		this.setCors();
		//设置Session
		this.setSession();
		console.log('config');
	}

	private routes(): void {
		//富文本图片上传
		var uploadFileRouter = new UploadFile().router();
		this.app.use('/', uploadFileRouter);

		this.app.use('/graphql', apolloUploadExpress(),
			graphqlExpress(req => {
				console.log('getcontent');
				let context = {
					session: req.session,
					user: req.session.user
				}
				return {
					schema,
					context,
					// 使用graphql apollo engine 如果不使用注释删除就可以
					//tracing: true,
					//cacheControl: true
				}
			})
		);
		this.app.get('/wxlogin', (req, res) => {
<<<<<<< HEAD
			if (req.query && req.query.code) {
				let async = require('async');
				async.waterfall([
					function (callback) {
						let https = require('https');
						let appId = 'wx7b80c3dba5d880b6';
						let secret = 'eb1dc047a60625023061726fcec8dc31';
						//get 请求外网  
						https.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appId + '&secret=' + secret + '&code=' + req.query.code + '&grant_type=authorization_code', function (req) {
							let result = '';
							req.on('data', function (data) {
								result += data;
							});
							req.on('end', function () {
								let resultObj = JSON.parse(result);
								callback(null, resultObj);
							});
						});
					},
					function (resultObj, callback) {
						console.log('f2');
						if (!resultObj || !resultObj.access_token || !resultObj.openid) {
							callback(null, null);
						} else {
							let token = resultObj.access_token
							let openid = resultObj.openid;
							let https = require('https');
							https.get(' https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid + '&lang=zh_CN', function (req) {
								let result = '';
								req.on('data', function (data) {
									result += data;
								});
								req.on('end', function () {
									let resultObj = JSON.parse(result);
									callback(null, resultObj);
								});
							});
						}
					},
					function (resultObj, callback) {
						console.log('f3');
						if (!resultObj || !resultObj.openid) {
							callback(null, null, null);
						} else {
							var MongoClient = require('mongodb').MongoClient;
							var url = "mongodb://localhost:27017/webSite";
							MongoClient.connect(url, function (err, db) {
								if (err) throw err;
								let dbo = db.db("webSite");
								dbo.collection("users").find({ username: resultObj.openid }).toArray(function (err, result) { // 返回集合中所有数据
									if (err) throw err;
									callback(null, result, resultObj);
								});
							});
						}
					},
					function (result, resultObj, callback) {
						console.log('f4');

						if (result && result.length > 0) {
							callback(null, result[0]);
						} else {
							let user = {
								username: resultObj.openid, name: resultObj.nickname, email: resultObj.nickname + "@qq.com", password: "123456",
								createAt: new Date().toISOString(), updateAt: new Date().toISOString(), isValid: true, roleId: "5a58795c498fb060c09bede3",
								profileId: "test", openid: resultObj.openid, nickname: resultObj.nickname, language: resultObj.language,
								city: resultObj.city, province: resultObj.province, country: resultObj.country, headimgurl: resultObj.headimgurl, isWinxin: true
							};
							var MongoClient = require('mongodb').MongoClient;
							var url = "mongodb://localhost:27017/webSite";
							MongoClient.connect(url, function (err, db) {
								let dbo = db.db("webSite");
								dbo.collection("users").insertOne(user, function (err, res) {
									if (err) throw err;
									if (res && res.ops && res.ops[0]) {
										var MongoClient = require('mongodb').MongoClient;
										var url = "mongodb://localhost:27017/webSite";										
										callback(null, res.ops[0]);										
									} else {
										callback(null, null);
									}
								});
							});
						}
					},
					function (userObj, callback) {										
						console.log('f5');
						if (userObj) {
							console.log('dohere');
							req['session'].user = userObj;							
							callback(null, true);
						} else {
							callback(null, false);
						}
					}
				], function (err, result) {
					console.log('end');
					if (result) {
						console.log('red');
						res.redirect(302, '/#/%E4%B8%BB%E9%A1%B5/home');
						res.end();
					} else {
						res.end('出错了！请重新登录。');
					}
				});
			} else {
				console.log('nocode');
				res.end('nocode');
			}
		});

=======
			var post_data = req.query;
			console.log('do');
			if (!post_data.code) {
				console.log('query');
				var appid = "wx7b80c3dba5d880b6"
				var backUrl = "http%3a%2f%2fkk11.ms0564.com";
				var host = "open.weixin.qq.com";

				var path = "/connect/oauth2/authorize?appid=wx7b80c3dba5d880b6&redirect_uri=http%3a%2f%2fkk11.ms0564.com&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
				// var path = `connect/oauth2/authorize?
				// 	appid=${appid}&redirect_uri=${backUrl}&response_type=code
				// 		&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
				var http = require('http');
				var options = {
					host: host,                   //host是要访问的域名，别加http或https
					path: path,       //请求的路径或参数，参数怎么写我不用说了吧？
					method: 'get'                              //请求类型，这里是get
				}
				var sendmsg = '';                                //创建空字符串，用来存放收到的数据
				var reqResult = http.request(options, function (req) {      //发出请求，加上参数，然后有回调函数
					// req.on("data", function (chunk) {               //监听data,接受数据
					// 	sendmsg += chunk;                         //把接受的数据存入定放的sendmsg
					// });
					// req.on("end", function (d) {                     //监听end事件，请求结束后调用
					// 	// var list = JSON.parse(sendmsg);            //对接受到的数据流进行编码
					// 	// console.log(list)                  //打印出结果
					// 	console.log(sendmsg);
					// });

				});
				reqResult.end();
			} else {
				console.log('result');				
			}
			res.send({ Hello: "Hello" })
		});
>>>>>>> 1b169aed91185da0445559ffb7f1e0ae8f3ee610
		this.app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
		this.app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
		this.app.use('/voyager', middleware({ endpointUrl: '/graphql' }));

		//使用graphql apollo engine 如果不使用注释删除就可以
		//this.setEngine();

	}

	//设置mongodb初始化
	private setMongodbInit() {
		const MONGO_URI = 'mongodb://localhost/webSite';
		Mongoose.connect(MONGO_URI || process.env.MONGO_URI, { useMongoClient: true });
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
	}

	//设置静态文件目录
	private setStatic() {
		var options = {
			dotfiles: 'ignore',
			etag: false,
			extensions: ['htm', 'html'],
			index: false,
			maxAge: '1d',
			redirect: false,
			setHeaders: function (res, path, stat) {
				res.set('x-timestamp', Date.now())
			}
		}

		this.app.use("/uploads", express.static(path.join(__dirname, '../uploads'), options));

		//设置网站
		this.app.use("/", express.static(path.join(__dirname, '../web')));
	}

	//设置session
	private setSession() {
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		this.app.use(expressValidator())
		this.app.use(cookieParser())
		this.app.use(
			session({
				secret: 'jufengyd',
				key: 'token',
				resave: false,
				saveUninitialized: false,
				store: new MongoStore({
					mongooseConnection: Mongoose.connection
				})
			})
		);
	}

	//graphql apollo engine
	private setEngine() {
		this.app.use(compression());
		const engine = new Engine({
			engineConfig: path.join(__dirname, './engineConfig.json'),
			graphqlPort: 8080,
			endpoint: '/graphql',
			dumpTraffic: true
		});
		engine.start();
		this.app.use(engine.expressMiddleware());
	}

	//设置跨域
	private setCors() {
		var corsOption = {
			credentials: true,
			origin: [
				"http://localhost:4200",
				"http://localhost:3000",
				"http://localhost:8083",
				"http://localhost:8100",
				"http://localhost:3000",
				"http://kk11.ms0564.com",
				"http://admin.ms0564.com",
				"http://192.168.1.102:8100",
				"https://open.weixin.qq.com"
			],
			headers: [
				"Access-Control-Allow-Origin",
				"Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type",
				"CORELATION_ID"
			]
		}
		this.app.use(cors(corsOption));
	}
}



export default new Server().app;
