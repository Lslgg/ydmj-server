import * as express from 'express';
var bodyParser = require('body-parser');
var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
var { makeExecutableSchema } = require('graphql-tools');
const expressPlayground = require('graphql-playground-middleware-express').default;
import { express as middleware } from 'graphql-voyager/middleware';
import * as Mongoose from 'mongoose';
var cors = require('cors');
import schema from "./schema";

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config() {

    const MONGO_URI = "mongodb://localhost/webSite";
    Mongoose.connect(MONGO_URI || process.env.MONGO_URI);

    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    const corsOption = this.setCors();

    this.app.use(cors(corsOption));

  }

  public routes(): void {
    let router: express.Router;
    router = express.Router();

    this.app.use('/', router)
    this.app.use('/graphql', graphqlExpress({ schema }))
    this.app.get('/playground', expressPlayground({ endpoint: '/graphql' }))
    this.app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
    this.app.use('/voyager', middleware({ endpointUrl: '/graphql' }))

    this.app.listen(8080, function () {
      console.log("Now browse to http://localhost:8080/playground");
    });
  }

  private setCors() {
    var whitelist: Array<string> = ["http://localhost:4200"];
    return (req, callback) => {
      let origin = req.header('Origin');
      var success = whitelist.findIndex(value=> value == origin)>-1;
      callback(null, { origin: success })
    }
  }
}

new Server();