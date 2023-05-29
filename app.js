const { Client } = require("pg");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "hesam1366",
  database: "calculator",
});

client.connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/calculate", async (req, res) => {
  console.log("the request body", req.body);
  const { num1, num2, operation } = req.body;
  console.log(num1, num2, operation);
  let result;
  switch (operation) {
    case "add":
      result = num1 + num2;
      break;
    case "subtract":
      result = num1 - num2;
      break;
    case "multiply":
      result = num1 * num2;
      break;
    case "divide":
      result = num1 / num2;
      break;
    default:
      return res.status(400).json({ error: "Invalid operation" });
  }

  // Save the calculation to the database
  try {
    await client.query(
      "INSERT INTO calculations (num1, num2, operation, result) VALUES ($1, $2, $3, $4)",
      [num1, num2, operation, result]
    );
  } catch (err) {
    console.error(err);
  }

  res.json({ result });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
