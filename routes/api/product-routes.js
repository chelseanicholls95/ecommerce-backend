const { Router } = require("express");

const { Category, Product, ProductTag, Tag } = require("../../models");

const router = Router();

// get all products with category and tag info
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get all products." });
  }
});

// get one product with category and tag info
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!product) {
      res.status(404).json({ message: "No product with this id." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get product" });
  }
});

// create a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      tagIds: req.body.tagIds,
      category_id: req.body.category_id,
    };

    const product = await Product.create(newProduct);

    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json({ message: "Successfully created product." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create product" });
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
      res.status(404).json({ message: "No product with this id." });
    } else {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      const removedProductTags = await ProductTag.destroy({
        where: { id: productTagsToRemove },
      });
      const createdNewProductTags = await ProductTag.bulkCreate(newProductTags);

      const updatedProductTags = {
        removedProductTags,
        createdNewProductTags,
      };

      res.status(200).json({
        message: "Successfully updated Product.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// delete a product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.destroy({
      where: { id },
    });
    if (!product) {
      res.status(404).json({ message: "No product with this id." });
    }
    res.status(200).json({ message: "Successfully deleted product." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
