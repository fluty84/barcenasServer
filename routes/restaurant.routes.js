const express = require("express");
const Restaurant = require("../models/Restaurant.model");
const Product = require("../models/Product.model");
const Table = require("../models/Table.model");
const bcrypt = require("bcryptjs");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const router = express.Router();

const saltRounds = 10;

// Get one restaurant
router.get("/restaurant/:id", (req, res) => {
  //BORRADO AUTHENTICATED PARA PODER REALIZAR MUESTRA DE MENU EN CUSTOMER
  const { id } = req.params;

  Restaurant.findById(id)
    .populate("menu")
    .populate("tables")
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json(err))

});

//GET TABLE

router.get("/table/:tableId", (req, res, next) => {
  const { tableId } = req.params;

  Table
    .findById(tableId)
    .populate({
      path: 'restaurantId',
      populate: {
        path: 'menu'
      }
    })
    .then((table) => {
      console.log(table);
      res.json(table)
    })
    .catch((err) => res.status(500).json(err))

});

//Create Restaurant

router.post("/create", (req, res) => {
  const { restaurant, password, address, tables, menu, email } = req.body;

  if (email === "" || password === "" || restaurant === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  if (password.length < 2) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  Restaurant
    .findOne({ restaurant })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return Restaurant.create({
        restaurant,
        password: hashedPassword,
        address,
        tables,
        menu,
        email,
      });
    })
    .then((createdUser) => {
      const { restaurant, password, address, tables, menu, email } =
        createdUser;

      const user = { restaurant, password, address, tables, menu, email };

      res.status(201).json({ user });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Create Product

router.post("/create-product", (req, res) => {
  const { name, price, category, allergens, restaurantId, imageUrl } = req.body;

  Product
    .create({ name, price, category, allergens, restaurantId, imageUrl })
    .then((product) => {
      return Restaurant.findByIdAndUpdate(restaurantId, {
        $push: { menu: product },
      });
    })
    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});

// Delete Product

router.post("/delete-product", (req, res) => {
  const { _id } = req.body;

  Product
    .findByIdAndDelete(_id)
    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});

// Create table

router.post("/create-table", isAuthenticated, (req, res) => {
  //const { password, customer } = req.body;

  const restaurantId = req.payload._id;

  Table
    .create({ restaurantId })
    .then((table) => {
      return Restaurant.findByIdAndUpdate(restaurantId, {
        $push: { tables: table },
      });
    })
    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});
// Delete table 

router.post("/delete-table", isAuthenticated, (req, res) => {

  const {tableId} = req.body

  console.log(req.body, '----->')

  Table
    .findByIdAndDelete(tableId)
    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))
})

//Create order

router.post("/send-order", (req, res) => {
  const { order } = req.body;
  const { id } = order //TABLEID

  Table.findByIdAndUpdate(id, { $push: { currentOrder: order } })
    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});

// Reset Table
router.post("/reset-table", (req, res) => {


  const { tableId } = req.body //TABLEID


  Table.findByIdAndUpdate(tableId, { currentOrder: [], total: [], password: null, customer: null })
    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});

//display order

router.get("/:tableId/display-order", (req, res) => {

  Table.findById(req.params.tableId)
    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});

// edit order

router.put("/edit-order", (req, res) => {
  const { id } = req.body;
  const order = req.body;

  Table.findByIdAndUpdate(id, { currentOrder: order })

    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});

// accept order
router.post("/accept-order", (req, res) => {
  const { id } = req.body;

  Table.findById(id)
    .then((tab) => {
      const currentOrderCopy = [...tab.currentOrder];
      return Table.findByIdAndUpdate(id, {
        $push: { total: currentOrderCopy },
        currentOrder: [],
      });
    })
    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});

// delete order

router.post("/delete-order", (req, res) => {
  const { id } = req.body;


  Table.findByIdAndUpdate(id, { currentOrder: [] })

    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});

// delete total

router.delete("/delete-total", (req, res) => {
  const { id } = req.body;

  Table.findByIdAndUpdate(id, { total: [] })

    .then((result) => res.status(201).json({ result }))
    .catch((err) => res.status(500).json(err))

});

//Update total

router.post("/update-total", (req, res) => {

  const { tableId } = req.body
  const {arrFinalOrder} = req.body;

  const order = arrFinalOrder.map(elm => {
    let name = elm[0]
    return [{ [name]: elm[1] }]
  });

  Table.findByIdAndUpdate(tableId, { total: order })
    .then(result =>  console.log(result))
    .catch(err => res.status(500).json(err))

});

module.exports = router;
