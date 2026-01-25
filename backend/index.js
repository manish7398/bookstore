require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const verifyJWT = require("./src/middlewares/verifyJWT");


const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://book-app-frontend-tau.vercel.app"],
    credentials: true,
  })
);

// routes
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

// protected test route
app.get("/api/protected", verifyJWT, (req, res) => {
  res.send({
    message: "Protected data accessed",
    user: req.user,
  });
});

// database + server
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}

main().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
