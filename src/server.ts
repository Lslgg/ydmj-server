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

var graphqlHTTP = require('express-graphql');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
var { makeExecutableSchema } = require('graphql-tools');
const expressPlayground = require('graphql-playground-middleware-express').default;
import { apolloUploadExpress } from 'apollo-upload-server';
import { UploadFile } from './common/file_server/uploadFile';

class Server { 
	public app: express.Application;

	constructor() { 
		this.app = express();
		this.config();
		this.routes();
	}

	private config() {
		//设置静态文件
		this.app.use("/uploads", express.static(path.join(__dirname, '../uploads')));
		
		//设置mongodb连接
		const MONGO_URI = 'mongodb://localhost/webSite';
		Mongoose.connect(MONGO_URI || process.env.MONGO_URI, { useMongoClient: true });
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
		
		//设置cors 跨域
		const corsOption = this.setCors();
		this.app.use(cors(corsOption));

		//设置Session
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

	private routes(): void {

		var uploadFileRouter = new UploadFile().router();
		this.app.use('/', uploadFileRouter);

		this.app.use('/graphql',apolloUploadExpress(),
			graphqlExpress(req => {
				let context = {
					session: req.session,
					user: req.session.user
				}
				return { schema, context }
			})
		);
		this.app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
		this.app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
		this.app.use('/voyager', middleware({ endpointUrl: '/graphql' }));
	}

	private setCors() {
		return {
			credentials: true,
			origin: [
				 "http://localhost:4200",
				 "http://localhost:3000",
				 "http://localhost:8083"
			],
			headers: [
				"Access-Control-Allow-Origin",
				"Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type",
				"CORELATION_ID"
			] 
		}
	}
}

export default new Server().app;
