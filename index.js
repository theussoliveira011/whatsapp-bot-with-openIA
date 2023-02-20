import * as dotenv from 'dotenv';
import { create } from 'venom-bot';
import { commands } from './controllers/responsesController.js';
import express from 'express';
import http from 'http';
import { body } from 'express-validator';
import { sendMessage } from './controllers/routesController.js';

const app = express();

dotenv.config();
const port = process.env.PORT || 8000;
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const configCreate = {
  session: 'Chat-GPT',
  multidevice: true,
  headless: false
};

create(configCreate)
  .then(client => start(client))
  .catch(erro => console.log(erro));


async function start(client){

  client.onAnyMessage(message => commands(client, message));
  
};
