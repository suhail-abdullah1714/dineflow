const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://testuser:test123@cluster0.vzasjqy.mongodb.net/restaurantDB?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const OrderSchema = new mongoose.Schema({
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      image: String,
      qty: Number
    }
  ],
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", OrderSchema);

app.post("/order", async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const newOrder = new Order({
      items,
      total
    });

    await newOrder.save();

    res.json({ message: "Order saved in database" });
  } catch (error) {
    console.log("POST /order error:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log("GET /orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.delete("/orders", async (req, res) => {
  try {
    const result = await Order.deleteMany({});
    console.log("Deleted orders:", result.deletedCount);
    res.json({
      message: "All orders cleared",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.log("DELETE /orders error:", error);
    res.status(500).json({ error: "Failed to clear orders" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});