import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import passport from "passport";
import session from "express-session";
import flash from "express-flash";
import methodOverride from "method-override";
import passportInitialize from "./passport/passport-config.js";
import { isAuthenticated } from "./passport/passportFn.js";
import databaseQuery from "./database/db.js";
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import logoutRoute from "./routes/logoutRoute.js";

const app = express();
const port = process.env.BACKEND_PORT;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);

passportInitialize(
  passport,
  async (username) =>
    await databaseQuery(
      `SELECT * from users WHERE users.username ='${username}';`
    ),
  async (id) =>
    await databaseQuery(`SELECT * from users WHERE users.id =${id};`)
);

app.get("/", isAuthenticated, (req, res) => {
  res.render("index.ejs");
});

app.get("/food", async (req, res) => {
  if (req.query.type) {
    const result = await databaseQuery(
      `SELECT * FROM food_list WHERE type = '${req.query.type}'`
    );
    res.json({ result: result });
  } else if (req.query.name) {
    const result = await databaseQuery(
      `SELECT * FROM food_list WHERE name ILIKE '%${req.query.name}%'`
    );
    res.json({ result: result });
  } else {
    const result = await databaseQuery("SELECT * FROM food_list");
    res.json({ result: result });
  }
});

app.get("/gettypes", async (req, res) => {
  const result = await databaseQuery("SELECT DISTINCT type FROM food_list");
  res.json({ result: result });
});

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
