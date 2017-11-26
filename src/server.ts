import * as express from 'express';
import { express as middleware } from 'graphql-voyager/middleware';
import * as Mongoose from 'mongoose';
import schema from './schema';
import { UploadFile } from './file/uploadFile';

var bodyParser = require('body-parser');
var cors = require('cors');
var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
var { makeExecutableSchema } = require('graphql-tools');
const expressPlayground = require('graphql-playground-middleware-express').default;

class Server {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.config();
		this.routes();
	}

	private config() {
		const MONGO_URI = 'mongodb://localhost/webSite';
		Mongoose.connect(MONGO_URI || process.env.MONGO_URI, { useMongoClient: true });

		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());

		const corsOption = this.setCors();

		this.app.use(cors(corsOption));
	}

	private routes(): void {
		var uploadFileRouter = new UploadFile().router();
		this.app.use('/', uploadFileRouter);

		this.app.use('/graphql', graphqlExpress({ schema }));
		this.app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
		this.app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
		this.app.use('/voyager', middleware({ endpointUrl: '/graphql' }));
	}

	private setCors() {
		var whitelist: Array<string> = [ 'http://localhost:4200' ];
		return (req, callback) => {
			let origin = req.header('Origin');
			var success = whitelist.findIndex((value) => value == origin) > -1;
			callback(null, { origin: success });
		};
	}
}

export default new Server().app;
