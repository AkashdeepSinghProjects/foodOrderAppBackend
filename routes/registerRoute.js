import express from "express";
import { isNotAuthenticated } from "../passport/passportFn.js";
import bcrypt from "bcrypt";
import databaseQuery from "../database/db.js";
import passport from "passport";

const router = express.Router();

router.get("/", isNotAuthenticated, (req, res) => {
  res.render("register.ejs", { error: req.session.error });
  delete req.session.error;
});

router.post("/", async (req, res, done) => {
  const isUserExist = await databaseQuery(
    `SELECT * from users WHERE users.username ='${req.body.email}';`
  );
  if (isUserExist.length < 1) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await databaseQuery(
        `INSERT INTO users(username,fullname,password) VALUES('${req.body.email}','${req.body.naem}','${hashedPassword}');`
      );
      return res.redirect("/login");
    } catch (error) {}
  } else {
    console.log("user exoist");
    req.session.error = "User already exists";
    return res.redirect(
      "/register?e=" + encodeURIComponent("Incorrect username or password")
    );
  }
});

export default router;
