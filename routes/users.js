var express = require("express");
var router = express.Router();
const User = require("../user.model");
const Creds = require("../creds.model");
const Ticket = require("../ticket.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.secret;

router.get("/check-auth", (req, res, next) => {
  const token = req.get("token");
  if (!token) {
    res.status(403);
    return;
  }

  const decoded = jwt.verify(token, secret);
  console.log(decoded);
});
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(password);
  const hash = await bcrypt.hash(password, 10);

  const new_user = await Creds.create({
    password: hash,
    username,
  });
  const token = jwt.sign(
    {
      usuario: new_user.username,
    },
    secret,
    { expiresIn: "30d" }
  );
  return res.status(201).json({ token });
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    res.status(403).json({ error: "Necesitas todos los campos" });
    return;
  }
  const user = await Creds.findOne({ username });
  const isRightPassword = await bcrypt.compare(password, user.password);

  if (user && isRightPassword) {
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.secret,
      {
        expiresIn: "30d",
      }
    );
    res.status(200).json({ token });
  }
  return;
});

/* GET users listing. */
router.get("/", async (req, res, next) => {
  const usuarios = await User.find();
  res.json(usuarios);
});

router.post("/", async (req, res, next) => {
  try {
    const { nombre_completo, correo, telefono } = req.body;
    console.log(req.body);

    if (!nombre_completo || !correo || !telefono) {
      res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
      return;
    }

    const ticket = await Ticket.findOneAndUpdate(
      { disponible: true },
      { $set: { disponible: false } }
    )
      .select("-_id numero_boleto")
      .lean();

    if (!ticket) {
      throw new Error("No hay boletos disponibles en este momento");
    }

    const new_user = await User.create({
      nombre_completo,
      correo,
      telefono,
      numero_boleto: ticket.numero_boleto,
    });

    res.status(200).json({ numero: new_user.numero_boleto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/clear", async (req, res) => {
  const users = await User.deleteMany();
  const tickets = await Ticket.deleteMany();

  const tickets_nuevos = Array.from(Array(50000), (_, index) => ({
    disponible: true,
    numero_boleto: index + 1,
  }));
  await Ticket.insertMany(tickets_nuevos);
  res.status(200).json({ message: 200 });
});

router.get("/generate-tickets", async (req, res, next) => {
  const tickets = Array.from(Array(50000), (_, index) => ({
    disponible: true,
    numero_boleto: index + 1,
  }));
  await Ticket.insertMany(tickets);
  res.status(200).json({ message: 200 });
});

module.exports = router;
