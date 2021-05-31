const { Router } = require("express");

const { Category, Product } = require("../../models");

const router = Router();

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get all categories." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [{ model: Product }],
    });
    if (!category) {
      res.status(404).json({ message: "No category with this id." });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get category" });
  }
});

router.post("/", (req, res) => {
  // create a new category
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
