import express from "express";
import { isNotAuthenticated } from "../passport/passportFn.js";
import passport from "passport";

const router = express.Router();

router.get("/", isNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

export default router;
