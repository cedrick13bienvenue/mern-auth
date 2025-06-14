import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mondodb.js"; // Match your existing file name
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = ["http://localhost:5173"];

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "mern-auth",
      version: "1.0.0",
      description: "app description",
    },
    schemes: ["http"],
    host: "localhost:4000",
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
app.get("/swagger.json", function (req, res) {
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
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API EndPoints
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
