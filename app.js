import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = process.env.BACKEND_PORT;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// database credentials
const pgDbConfig = {
  host: "localhost",
  port: process.env.POSTGRESS_PORT,
  database: "foodApp", // databse name
  user: "postgres",
  password: process.env.POSTGRESS_PASSWORD,
};

// Database connection
async function databaseQuery(query) {
  try {
    const client = new pg.Client(pgDbConfig);
    await client.connect();
    const result = await client.query(query);
    await client.end();
    return result.rows;
  } catch (err) {
    console.log(err.message);
    return;
  }
}

app.get("/", async (req, res) => {
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
