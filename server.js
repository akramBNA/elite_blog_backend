require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/database");
const routes = require("./routes/routes");
const { initSocket } = require("./socket");
const http = require("http");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const app = express();

app.use(helmet());

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500
});
app.use(speedLimiter);

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
