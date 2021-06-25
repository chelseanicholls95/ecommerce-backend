const { Router } = require("express");

const { Category, Product, ProductTag, Tag } = require("../../models");

const router = Router();

// get all products with category and tag info
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: { attributes: [] } },
      ],
      attributes: { exclude: ["category_id"] },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to get all products." });
  }
});

// get one product with category and tag info
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Category },
        { model: Tag, through: { attributes: [] } },
      ],
      attributes: { exclude: ["category_id"] },
    });

    if (!product) {
      return res.status(404).json({ message: "No product with this id." });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to get product" });
  }
});

// create a new product
router.post("/", async (req, res) => {
  try {
    const { product_name, price, stock, tagIds, category_id } = req.body;

    const newProduct = {
      product_name,
      price,
      stock,
      category_id,
    };

    const product = await Product.create(newProduct);

    if (tagIds.length) {
      const productTagIdArr = tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));

      await ProductTag.bulkCreate(productTagIdArr);
    }

    return res.status(200).json({ message: "Successfully created product." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to create product" });
  }
});

// update a product
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.update(req.body, {
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "No product with this id." });
    } else {
      const productTags = await ProductTag.findAll({
        where: { product_id: id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({
          product_id: id,
          tag_id,
        }));

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await ProductTag.destroy({
        where: { id: productTagsToRemove },
      });

      await ProductTag.bulkCreate(newProductTags);

      return res.status(200).json({
        message: "Successfully updated Product.",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product" });
  }
});

// delete a product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Product.destroy({
      where: { id },
    });

    return res.status(200).json({ message: "Successfully deleted product." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
