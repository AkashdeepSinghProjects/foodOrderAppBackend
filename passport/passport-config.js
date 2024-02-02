import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";

export default function passportInitialize(
  passport,
  getUserByEmail,
  getUserById
) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const data = await getUserByEmail(email);
          const user = data[0];
          if (user) {
            if (await bcrypt.compare(password, user.password)) {
              return done(null, user);
            }
            return done(null, false, { message: "incorrect password" });
          } else {
            return done(null, false, { message: "user not found" });
          }
        } catch (error) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, getUserById(id)));
}
