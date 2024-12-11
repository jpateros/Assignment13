const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();


app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://jpateros5410:M18nqYeaTDPrOo1d@inventory.epd0y.mongodb.net/inventory?retryWrites=true&w=majority";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  product: {
    productid: { type: Number, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    instock: { type: Boolean, required: true },
  },
});

const Product = mongoose.model("Product", productSchema);

app.get("/product/get", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

app.post("/product/create", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Error creating product" });
  }
});

app.put("/product/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findOneAndUpdate({ id }, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Error updating product" });
  }
});

app.delete("/product/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findOneAndDelete({ id });
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
