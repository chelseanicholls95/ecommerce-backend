const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tags);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get all tags." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id, {
      include: [{ model: Product }],
    });
    if (!tag) {
      res.status(404).json({ message: "No tag with this id." });
    }
    res.status(200).json(tag);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get tag" });
  }
});

router.post("/", (req, res) => {
  // create a new tag
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
