const express = require("express");
const path = require("path");
const acc = require("./db/MenuItemAccessor");
const { Constants } = require("./utils/Constants");
const { MenuItem } = require("./entity/MenuItem");
const app = express();
const cors = require("cors");

app.use(express.static(Constants.PUBLIC_FOLDER));

app.use(express.json());

app.use(cors());

// Get all menu items
app.get("/api/menuitems", async function (request, response) {
  try {
    let data = await acc.getAllItems();
    response.status(200).json({ err: null, data: data });
  } catch (err) {
    response
      .status(500)
      .json({ err: "Could not read data: " + err, data: null });
  }
});

app.post("/api/menuitems/:id(\\d{3})", async function (request, response) {
  let itemData = request.body;

  try {
    let item;
    try {
      item = new MenuItem(
        itemData.id, // Use the id from the request URL
        itemData.category.toUpperCase(), // Ensure the category is in uppercase
        itemData.description,
        itemData.price,
        itemData.vegetarian
      );
    } catch (err) {
      throw new Error("MenuItem constructor error: " + err.message);
    }

    let ok = await acc.addItem(item);
    if (ok) {
      response.status(201).json({ err: null, data: true });
    } else {
      response
        .status(409)
        .json({ err: `Item ${item.id} already exists`, data: null });
    }
  } catch (err) {
    response.status(400).json({ err: err.message, data: null });
  }
});

// Update a menu item
app.put("/api/menuitems/:id(\\d{3})", async function (request, response) {
  if (request.params.id) {
    let itemData = request.body;

    try {
      let item = new MenuItem(
        itemData.id,
        itemData.category,
        itemData.description,
        itemData.price,
        itemData.vegetarian
      );

      let ok = await acc.updateItem(item);
      if (ok) {
        response.status(200).json({ err: null, data: true });
      } else {
        response
          .status(404)
          .json({ err: `Item ${item.id} does not exist`, data: null });
      }
    } catch (error) {
      response
        .status(400)
        .json({ err: "MenuItem constructor error", data: null });
    }
  } else {
    response
      .status(405)
      .json({ err: "Bulk updates not supported", data: null });
  }
});

// Delete a menu item
app.delete("/api/menuitems/:key(\\d{3})", async function (request, response) {
  let id = Number(request.params.key);
  let item = new MenuItem(id, "aaa", "", 0, false);

  try {
    let ok = await acc.deleteItem(item);
    if (ok) {
      response.status(200).json({ err: null, data: true });
    } else {
      response
        .status(404)
        .json({ err: `Item ${item.id} does not exist`, data: null });
    }
  } catch (err) {
    response.status(500).json({ err: "Delete aborted: " + err, data: null });
  }
});

// 405 Method Not Allowed for invalid routes
// Single GETs not supported
app.all("/api/menuitems/:id(\\d{3})", function (request, response) {
  response.status(405).json({ err: "Single GETs not supported", data: null });
});

// Bulk inserts not supported
app.all("/api/menuitems", function (request, response) {
  if (request.method === "GET") {
    response.status(405).json({ err: "Single GETs not supported", data: null });
  } else if (request.method === "POST") {
    response
      .status(405)
      .json({ err: "Bulk inserts not supported", data: null });
  } else if (request.method === "PUT") {
    response
      .status(405)
      .json({ err: "Bulk updates not supported", data: null });
  } else {
    response
      .status(405)
      .json({ err: "Bulk deletes not supported", data: null });
  }
});

// 404
app.use(function (request, response, next) {
  response
    .status(404)
    .sendFile(path.join(__dirname, Constants.PUBLIC_FOLDER, "404.html"));
});

// start the server - should be the last step
app.listen(Constants.PORT_NUM, () =>
  console.log(`Example app listening on port ${Constants.PORT_NUM}!`)
);
