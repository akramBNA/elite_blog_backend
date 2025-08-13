require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/database");
const routes = require("./routes/routes");
const { initSocket } = require("./socket");
const http = require("http");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
