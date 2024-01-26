import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = process.env.BACKEND_PORT;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// database credentials
const client = new pg.Client({
  host: "localhost",
  port: process.env.POSTGRESS_PORT,
  database: "foodApp", // databse name
  user: "postgres",
  password: process.env.POSTGRESS_PASSWORD,
});

// Database connection
async function databaseQuery(query) {
  try {
    await client.connect();
    const result = await client.query(query);
    console.log("result", result.rows);
    return result.rows;
  } catch (err) {
    console.error(err.message);
  }
  return;
}

databaseQuery("SELECT * FROM users");

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
