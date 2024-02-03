import express from "express";
import { isNotAuthenticated } from "../passport/passportFn.js";
import bcrypt from "bcrypt";
import databaseQuery from "../database/db.js";
import base64 from "base-64";
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
        `INSERT INTO users(username,fullname,password) VALUES('${req.body.email}','${req.body.name}','${hashedPassword}');`
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

router.post("/frontend", async (req, res, done) => {
  console.log(req);

  const encoded = req.rawHeaders
    .find((element) => element.includes("Basic"))
    .split("Basic");
  const decode = base64.decode(encoded[1]).split(":");

  const email = decode[0] || req.body.email;
  const password = decode[1] || req.body.password;

  const isUserExist = await databaseQuery(
    `SELECT * from users WHERE users.username ='${email}';`
  );
  if (isUserExist.length < 1) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await databaseQuery(
        `INSERT INTO users(username,fullname,password) VALUES('${email}','${req.body.name}','${hashedPassword}');`
      );
      return res.json({ message: "Successfully added", isSuccess: true });
    } catch (error) {
      console.log("Error: ", error.message);
      // return res.json({ message: error.message, isSuccess: false });
    }
  } else {
    req.session.error = "User already exists";
    return res.json({ message: "User already exists", isSuccess: false });
  }
});

export default router;
