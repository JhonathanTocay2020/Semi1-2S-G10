import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js";
import publicacionRoutes from "./routes/publicacion.routes.js";
import amigoRoutes from "./routes/amigo.routes.js";
import chatbot from "./routes/chatbot.routes.js";

const app = express();
//Cors
var corsOptions = {
  origin: "*",
};

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));

//bodyparser
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.text({ limit: "10mb" }));

// Routes
app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/", publicacionRoutes);
app.use("/", amigoRoutes);
app.use("/", chatbot);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
