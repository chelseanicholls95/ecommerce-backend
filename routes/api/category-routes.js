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

router.post("/", async (req, res) => {
  try {
    const { category_name } = req.body;
    const category = await Category.create({
      category_name,
    });
    res.status(200).json(category);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    const category = await Category.update(
      { category_name },
      {
        where: { id },
      }
    );
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const { id } = req.params;
    const category = await Category.destroy({
      where: { id },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;
