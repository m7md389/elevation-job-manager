module.exports = function (req, res, next) {
  if (req.user.role !== "admin") return res.send({ error: "Access denied." });
  next();
};
