let addOrUpdate = ""; // global

window.onload = function () {
  // click on table row
  document.querySelector("#items").addEventListener("click", handleTableClick);

  // buttons
  document.querySelector("#addButton").addEventListener("click", doAdd);
  document.querySelector("#updateButton").addEventListener("click", doUpdate);
  document.querySelector("#deleteButton").addEventListener("click", doDelete);
  document.querySelector("#doneButton").addEventListener("click", doDone);
  document.querySelector("#cancelButton").addEventListener("click", doCancel);

  refreshTable();
  setInputPanelState(false); // hide input panel
  setButtonStates(false); // disable Delete and Update buttons
};

function doAdd() {
  clearInputPanel();
  setInputPanelState(true);
  setIdInputState(true);
  addOrUpdate = "ADD";
}

function doUpdate() {
  setInputPanelState(true);
  setIdInputState(false);
  addOrUpdate = "UPDATE";
}

function doDelete() {
  let elem = document.querySelector(".selected");
  let id = Number(elem.querySelector("td").innerHTML);
  let url = "http://localhost:8000/api/menuitems/" + id;
  let method = "DELETE";

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let resp = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        if (resp.data) {
          alert("delete successful");
        }
        refreshTable();
      } else {
        alert(resp.err);
      }
    }
  };
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-Type", "application/json"); // IMPORTANT
  xhr.send();
}

function doDone() {
  let id = Number(document.querySelector("#idInput").value);
  if (id < 100 || id > 999) {
    alert("ID must be a three-digit number.");
    return;
  }

  let category = document.querySelector("#categoryInput").value;
  if (category.trim() === "" || category.length !== 3) {
    alert("Category must be three letters.");
    return;
  }

  let description = document.querySelector("#descriptionInput").value;
  if (description.trim() === "") {
    alert("Description is required.");
    return;
  }

  let price = Number(document.querySelector("#priceInput").value);
  if (isNaN(price) || price <= 0) {
    alert("Price must be a positive number.");
    return;
  }

  let vegetarian = document.querySelector("#vegetarianInput").checked;
  let obj = {
    id: id,
    category: category,
    description: description,
    price: price,
    vegetarian: vegetarian,
  };

  let url = "http://localhost:8000/api/menuitems/" + id;
  let method = addOrUpdate === "ADD" ? "POST" : "PUT";

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let resp = JSON.parse(xhr.responseText);
      if (addOrUpdate === "ADD") {
        console.log("response", resp);
        if (xhr.status === 201) {
          if (resp.data) {
            alert("add successful");
          }
          refreshTable();
        } else {
          alert(resp.err);
        }
      } else {
        if (xhr.status === 200) {
          if (resp.data) {
            alert("update successful");
          }
          refreshTable();
        } else {
          alert(resp.err);
        }
      }
    }
  };
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-Type", "application/json"); // IMPORTANT
  xhr.send(JSON.stringify(obj));
  setInputPanelState(false);
}

function doCancel() {
  setInputPanelState(false);
}

function refreshTable() {
  let url = "http://localhost:8000/api/menuitems";
  let method = "GET";
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let response = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        buildTable(response.data);
        setButtonStates(false);
      } else {
        alert(response.err);
      }
    }
  };
  xhr.open(method, url, true);
  xhr.send();
}

function buildTable(data) {
  let elem = document.querySelector("#items");
  let html = "<table>";
  html +=
    "<tr><th>ID</th><th>Category</th><th>Description</th><th>Price</th><th>Vegetarian</th></tr>";
  data.forEach((item) => {
    html += "<tr>";
    html += `<td>${item.id}</td>`;
    html += `<td>${item.category}</td>`;
    html += `<td>${item.description}</td>`;
    html += `<td>${item.price}</td>`;
    html += `<td>${item.vegetarian}</td>`;
    html += "</tr>";
  });
  html += "</table>";
  elem.innerHTML = html;
}

function handleTableClick(evt) {
  let elem = evt.target;
  if (elem.nodeName !== "TD") return;
  clearSelections();
  let row = elem.parentElement;
  row.classList.add("selected");
  populateInputPanel();
  setButtonStates(true);
}

function populateInputPanel() {
  let row = document.querySelector(".selected");
  let tds = row.querySelectorAll("td");
  let id = Number(tds[0].innerHTML);
  let category = tds[1].innerHTML;
  let description = tds[2].innerHTML;
  let price = Number(tds[3].innerHTML);
  let vegetarian = tds[4].innerHTML;
  document.querySelector("#idInput").value = id;
  document.querySelector("#categoryInput").value = category;
  document.querySelector("#descriptionInput").value = description;
  document.querySelector("#priceInput").value = price;
  document.querySelector("#vegetarianInput").value = vegetarian;
}

function clearInputPanel() {
  document.querySelector("#idInput").value = 0;
  document.querySelector("#categoryInput").value = "";
  document.querySelector("#descriptionInput").value = "";
  document.querySelector("#priceInput").value = 0;
  document.querySelector("#vegetarianInput").value = false;
}

function clearSelections() {
  let rows = document.querySelectorAll("tr");
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.remove("selected");
  }
}

function setButtonStates(value) {
  let updateButton = document.querySelector("#updateButton");
  let deleteButton = document.querySelector("#deleteButton");
  if (value) {
    updateButton.removeAttribute("disabled");
    deleteButton.removeAttribute("disabled");
  } else {
    updateButton.setAttribute("disabled", "disabled");
    deleteButton.setAttribute("disabled", "disabled");
  }
}

function setInputPanelState(value) {
  let elem = document.querySelector("#inputPanel");
  if (value) {
    elem.classList.remove("hidden");
  } else {
    elem.classList.add("hidden");
  }
}

function setIdInputState(value) {
  let elem = document.querySelector("#idInput");
  if (value) {
    elem.removeAttribute("disabled");
  } else {
    elem.setAttribute("disabled", "disabled");
  }
}
