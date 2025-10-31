const { Supplier } = require("../models");

// Supplier model placeholder - we'll create minimal controller methods
const list = async (req, res, next) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const s = await Supplier.create(req.body);
    res.status(201).json(s);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier)
      return res.status(404).json({ message: "Proveedor no encontrado" });

    await supplier.update(req.body);
    res.json({ message: "Proveedor actualizado exitosamente", supplier });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier)
      return res.status(404).json({ message: "Proveedor no encontrado" });

    await supplier.destroy();
    res.json({ message: "Proveedor eliminado exitosamente" });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, update, remove };
