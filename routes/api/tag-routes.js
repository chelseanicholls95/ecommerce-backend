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

router.post("/", async (req, res) => {
  try {
    const { tag_name } = req.body;
    const tag = await Tag.create({
      tag_name,
    });
    res.status(200).json(tag);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create tag" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tag_name } = req.body;
    const tag = await Tag.update(
      { tag_name },
      {
        where: { id },
      }
    );
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Failed to update tag" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.destroy({
      where: { id },
    });
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tag" });
  }
});

module.exports = router;
