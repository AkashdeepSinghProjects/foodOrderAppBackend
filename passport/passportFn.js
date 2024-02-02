export function isAuthenticated(req, res, done) {
  if (req.isAuthenticated()) {
    return done();
  }
  return res.redirect("/login");
}
export function isNotAuthenticated(req, res, done) {
  if (!req.isAuthenticated()) {
    return done();
  }
  return res.redirect("/");
}
