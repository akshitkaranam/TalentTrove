import express from 'express';
const app = express();
import 'express-async-errors';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();
const port = 8080;

// ------------DB & AuthenticateUser------------ //
import connectDB from './db/connect.js';

// ------------Security Packages------------ //
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

let whitelist = [process.env.BACKEND_URL, process.env.REACT_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) === -1) {
        var message =
          "The CORS policy for this origin doesn't allow access from the particular origin.";
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// }

app.use(express.json()); // make json-data available
app.use(helmet()); // secure Express-app by setting various HTTP headers
app.use(xss()); // node-Connect-middleware to sanitize user input coming from POST body, GET queries, and url params
app.use(mongoSanitize()); // Sanitizes user-supplied data to prevent MongoDB Operator Injection

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    // only connect to server if successfully-connected to DB
    app.listen(port, () =>
      console.log(`Server is listening on http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
