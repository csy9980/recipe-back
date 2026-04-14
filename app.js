const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://recipe-front-kappa.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const postRouter = require("./routes/posts");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const models = require("./models");


const uploadDir = path.join(__dirname, "public", "uploads");
app.use("/downloads", express.static(uploadDir));
app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  models.sequelize
    .sync({ force: false })
    .then(() => {
      console.log("DB connected");
    })
    .catch(() => {
      console.error("DB error");
      process.exit();
    });
});
