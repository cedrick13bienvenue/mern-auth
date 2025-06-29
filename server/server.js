import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mondodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://authentic-mern.vercel.app", // your deployed frontend
  "https://mern-auth-3rp7.onrender.com", // backend itself (for swagger etc)
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "mern-auth",
      version: "1.0.0",
      description: "app description",
    },
    schemes: ["https"],
    host: "mern-auth-3rp7.onrender.com",
    basePath: "/api",
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "bearer",
        in: "header",
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js", "./model/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocs);
});

app.use(
  "/documentation",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, false, {
    docExpansion: "none",
  })
);

app.use(express.json());
app.use(cookieParser());

// API EndPoints
app.get("/", (req, res) => res.send("API is working!"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
