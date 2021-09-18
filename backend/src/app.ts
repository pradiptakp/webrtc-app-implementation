import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import compression from "compression";
import http from "http";
import { Express } from "express-serve-static-core";
var isProduction = process.env.NODE_ENV === "production";

import { controllers } from "./controllers/";
import { Server } from "socket.io";

var app = express();
const server = http.createServer(app);
const port = process.env.NODE_ENV === "production" ? process.env.PORT : 3002;

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  socket.on("offer", (e) => {
    socket.broadcast.emit("offer", e);
  });
  socket.on("answer", (e) => {
    socket.broadcast.emit("answer", e);
  });
  socket.on("candidate", (e) => {
    socket.broadcast.emit("candidate", e);
  });
  socket.on("leave", (e) => {
    socket.broadcast.emit("leave", e);
  });
});

app.use(cors());
app.set("port", port);
app.use(compression());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "conduit",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

app.use(express.static("public"));

// ERROR FALLBACK
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).send("Internal Server Error!");
});

server.listen(port, () => console.log(`Listening on port ${port}`));
