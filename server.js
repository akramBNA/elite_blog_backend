require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/database");
const routes = require("./routes/routes")
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
