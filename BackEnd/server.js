require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoStore } = require("connect-mongo");
const User = require("./schemas/user.js");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes.js");
const groupRoutes = require("./routes/groupRoutes.js");
const todoRoutes = require("./routes/todoRoutes.js");
const app = express();
const MONGO_URL =
  process.env.USE_LOCAL_MONGO === "false"
    ? process.env.MONGO_URL
    : "mongodb://localhost:27017/Todo";

app.use(express.json());

mongoose.connect(MONGO_URL).then(() => {
  const isNgrok = process.env.USE_NGROK === "true";
  const allowOrigin = isNgrok
    ? process.env.FRONTEND_NGROK_URL
    : "http://localhost:5173";
  app.use(
    cors({
      origin: allowOrigin,
      credentials: true,
    }),
  );
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 14 * 24 * 60 * 60,
        autoRemove: "native",
      }),
      cookie: {
        httpOnly: true,
        secure: isNgrok,
        sameSite: isNgrok ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );
  app.use("/api/auth", authRoutes);
  app.use("/api/group", groupRoutes);
  app.use("/api/todo", todoRoutes);

  
  app.get("/health", (req, res) => res.send("ok"));
  console.log("connected");
  app.listen(3000);
});
