import express from "express";

const router = express.Router();

router.delete("/", (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.log(err);
      return done(err);
    }
    return res.redirect("/login");
  });
});

export default router;
