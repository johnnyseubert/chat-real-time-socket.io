import express from "express"
import http from "http";
import path from 'path'
import { Server } from 'socket.io'

const server = express();
const serverHttp = http.createServer(server);
const io = new Server(serverHttp);

server.use(express.static(path.join(__dirname, "..", "public")))

export { serverHttp, io } 