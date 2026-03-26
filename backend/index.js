require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const verifyJWT = require("./src/middlewares/verifyJWT");

const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");

const app = express();
const port = process.env.PORT || 5000;

/* =========================
   MIDDLEWARES
========================= */

// JSON parser
app.use(express.json());

// CORS configuration (FIXED + PRODUCTION READY)
const allowedOrigins = [
  "http://localhost:5173",
  "https://book-app-frontend-tau.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // ✅ allow all Vercel previews
      ) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* =========================
   ROUTES
========================= */

// Health check route (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

// Protected route example
app.get("/api/protected", verifyJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected data accessed",
    user: req.user,
  });
});

/* =========================
   404 Handler
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

/* =========================
   DATABASE CONNECTION
========================= */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

connectDB();