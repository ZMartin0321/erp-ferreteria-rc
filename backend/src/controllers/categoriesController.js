const { Category } = require("../models");

const list = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const c = await Category.create(req.body);
    res.status(201).json(c);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat)
      return res.status(404).json({ message: "Categoría no encontrada" });
    await cat.update(req.body);
    res.json(cat);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat)
      return res.status(404).json({ message: "Categoría no encontrada" });
    await cat.destroy();
    res.json({ message: "Eliminada" });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, update, remove };
