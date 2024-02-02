import pg from "pg";
// database credentials
const pgDbConfig = {
  host: "localhost",
  port: process.env.POSTGRESS_PORT,
  database: "foodApp", // databse name
  user: "postgres",
  password: process.env.POSTGRESS_PASSWORD,
};

// Database connection
export default async function databaseQuery(query) {
  try {
    const client = new pg.Client(pgDbConfig);
    await client.connect();
    const result = await client.query(query);
    await client.end();
    return result.rows;
  } catch (err) {
    console.log("Error: ", err.message);
    return;
  }
}
