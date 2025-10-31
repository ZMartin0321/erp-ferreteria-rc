const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token provided" });
  const parts = auth.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ message: "Token error" });
  const token = parts[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET || "clave_segura",
    (err, decoded) => {
      if (err) return res.status(401).json({ message: "Token inválido" });
      req.user = decoded;
      next();
    }
  );
};

const authorize =
  (roles = []) =>
  (req, res, next) => {
    if (typeof roles === "string") roles = [roles];
    if (!req.user) return res.status(401).json({ message: "No autorizado" });
    if (roles.length && !roles.includes(req.user.role))
      return res.status(403).json({ message: "Permiso denegado" });
    next();
  };

module.exports = { verifyToken, authorize };
