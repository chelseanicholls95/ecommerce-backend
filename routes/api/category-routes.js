const { Router } = require("express");

const { Category, Product } = require("../../models");

const router = Router();

// get all categories with product info
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to get all categories" });
  }
});

// get one category with product info
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [{ model: Product }],
    });

    if (!category) {
      return res.status(404).json({ message: "No category with this id" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to get category" });
  }
});

// create a new category
router.post("/", async (req, res) => {
  try {
    const { category_name } = req.body;

    const category = await Category.create({
      category_name,
    });

    if (!category) {
      return res.status(500).json({ error: "Failed to create category" });
    }

    return res.status(200).json({ message: "Successfully created category" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to create category" });
  }
});

// update a category
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

    if (!category) {
      return res.status(500).json({ error: "Failed to update category" });
    }

    return res.status(200).json({ message: "Successfully updated category" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update category" });
  }
});

// delete a category
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Category.destroy({
      where: { id },
    });

    return res.status(200).json({ message: "Successfully deleted category" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;
