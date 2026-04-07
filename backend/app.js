import dotenv from "dotenv";
dotenv.config();
import express from "express";

import {createServer} from "node:http";
import {Server} from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./src/controllers/socketManager.js";

import usersRoutes from "./src/routes/users.routes.js";


import cors from "cors";

const app= express();
const server= createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit : "40kb"}));
app.use(express.urlencoded({limit :"40kb", extended :true}));


app.use("/api/v1/users", usersRoutes);
// app.use("/api/v2/users", newUserRoutes);
const start=  async () =>{

    app.set("mongo_user")
    const connectionDb = await mongoose.connect(process.env.MONG_URL)
    console.log(`mongo database connected to my ${connectionDb.connection.host}`)

    app.get("/", (req, res) => {
       res.send("Backend is running successfully");
   });
   server.listen(app.get("port"), () => {
     console.log("listenning on port 8000");
  })
}

start();