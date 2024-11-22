import express from 'express';
import cors from 'cors';
import connectDB from './config/mongoose.js';
import { env } from './config/enviroment.js';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import route from './routes/index.js';

const app = express();
let io;

app.use(express.json());
app.use(cors());

route(app);

// Middleware for centralized error handling
app.use(errorHandlingMiddleware);

const httpServer = createServer(app);
io = new Server(httpServer, {
  path: '/socket',
  cors: {
    origin: [`https://${env.APP_HOST}:5173/`],
  },
  transports: ['websocket'],
});

const START_SERVER = () => {
  io.on('connection', (socket) => {
    console.log('connect !');
  });

  httpServer.listen(env.APP_PORT, () => {
    console.log(`Hello, I am running hosting at ${env.APP_HOST}:${env.APP_PORT}/, version ${process.env.APP_VERSION}`);
  });

  app.get('/', (req, res) => res.send('Hello'));
};

connectDB()
  .then(() => console.log('Connected to database'))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error(error);
    process.exit();
  });

export const server = {
  io,
  app,
  START_SERVER,
  connectDB,
};