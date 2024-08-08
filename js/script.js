let isRotating = false;
let originalColors = [];
let usedColors = [];
let orderList = [];
let usedNames = [];
let currentIndex = 0; // Índice para rastrear la posición actual en orderList

function rotateCircle() {
  const namesTextarea = document.getElementById("namesTextarea");
  const names = namesTextarea.value
    .split("\n")
    .filter((name) => name.trim() !== "");
  if (names.length < 2 || isRotating) return;

  if (orderList.length === 0) {
    orderList = [...names];
    usedNames = [];
    usedColors = [];
    originalColors = [];
    updateCircleDivisions(names);
  }

  isRotating = true;
  const randomTime = Math.floor(Math.random() * (7000 - 3000 + 1)) + 1000;
  let rotationAngle = 0;
  let rotateInterval = 5;
  const totalRotationTime = randomTime - 1000;

  const rotateIntervalId = setInterval(() => {
    rotationAngle += 5;
    const divisions = document.getElementById("divisions");
    divisions.setAttribute("transform", `rotate(${rotationAngle} 100 100)`);

    if (rotateInterval > 1) {
      const remainingTime = randomTime - (performance.now() - startTime);
      const finalRotationTime = totalRotationTime * 0.2;
      const decelerationRate = 1 - remainingTime / finalRotationTime;
      rotateInterval = 5 + (10 - 5) * decelerationRate;
    }
  }, rotateInterval);

  const startTime = performance.now();

  setTimeout(() => {
    clearInterval(rotateIntervalId);
    isRotating = false;
    restoreOriginalColors();
    console.log(rotationAngle);
    let totalRotation = rotationAngle / 360;
    let rotationDivision = 360 / names.length;
    let totalRotationInt = Math.floor(totalRotation);
    let rotation = totalRotation - totalRotationInt;
    let angle = rotation * 360;
    let inicio = 0;
    let angleDivisions = {};
    for (let i = names.length - 1; i >= 0; i--) {
      angleDivisions[names[i]] = {
        inicio: inicio,
        fin: inicio + rotationDivision,
      };
      inicio += rotationDivision;
    }
    console.log(angleDivisions);
    console.log(angle);
    let selectedName = "";
    for (let name in angleDivisions) {
      if (
        angle >= angleDivisions[name].inicio &&
        angle < angleDivisions[name].fin
      ) {
        selectedName = name;
        break;
      }
    }
    showSelectedName(selectedName);
  }, randomTime);
}

function showSelectedName(selectedName) {
  const orderListItems = document.getElementById("orderListItems");
  const listItem = document.createElement("li");
  listItem.textContent = `${selectedName}`;
  orderListItems.appendChild(listItem);

  const selectedNameModal = document.getElementById("selectedName");
  selectedNameModal.textContent = `Salió ${selectedName}!`;
  openModal("nameModal");

  currentIndex = (currentIndex + 1) % orderList.length; // Actualiza el índice para el próximo nombre
}

function updateCircleDivisions(names) {
  originalColors = [];
  usedColors = [];
  orderList = [...names];
  usedNames = [];

  const colors = [
    "aquamarine",
    "blue",
    "brown",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dodgerblue",
    "firebrick",
    "forestgreen",
    "fuchsia",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "hotpink",
    "indianred",
    "indigo",
    "khaki",
    "lavender",
    "lime",
    "limegreen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "navy",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen"
  ];
  const numDivisiones = names.length;
  const angle = 360 / numDivisiones;

  const divisions = document.getElementById("divisions");
  divisions.innerHTML = "";

  for (let i = 0; i < numDivisiones; i++) {
    const startAngle = angle * i;
    const endAngle = startAngle + angle;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", describeArc(100, 100, 90, startAngle, endAngle));
    let color = "";

    do {
      color = colors[Math.floor(Math.random() * colors.length)];
    } while (usedColors.includes(color));

    usedColors.push(color);
    originalColors.push(color);
    path.setAttribute("fill", color);
    path.addEventListener("mouseover", function () {
      showTooltip(names[i], color);
    });
    path.addEventListener("mouseout", hideTooltip);
    path.addEventListener("click", function () {
      if (!isRotating && usedNames.includes(names[i])) {
        usedNames.splice(usedNames.indexOf(names[i]), 1);
        restoreOriginalColors();
      }
    });
    divisions.appendChild(path);
  }
}

function restoreOriginalColors() {
  const divisions = document.getElementById("divisions").children;
  for (let i = 0; i < divisions.length; i++) {
    divisions[i].setAttribute("fill", originalColors[i]);
  }
}

document
  .getElementById("dataInput")
  .addEventListener("change", handleFileSelect, false);
document
  .getElementById("saveButton")
  .addEventListener("click", saveNamesToFile);

function handleFileSelect(event) {
  const files = event.target.files;
  if (files.length === 0) {
    // No file selected, exit the function
    return;
  }

  const file = files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = e.target.result
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const namesTextarea = document.getElementById("namesTextarea");
    namesTextarea.value = data.join("\n");
    updateCircleDivisions(data);
  };

  reader.readAsText(file);
}

function openModal(modalId) {
  if (modalId === "removeNameModal") {
    const namesTextarea = document.getElementById("namesTextarea");
    const names = namesTextarea.value
      .split("\n")
      .filter((name) => name.trim() !== "");
    updateRemoveNameModal(names);
  }
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function addNameFromModal() {
  const newName = document.getElementById("newName").value.trim();
  if (newName !== "" && newName.length <= 20 && !newName.includes("\n") && !newName.includes("\r") && !newName.includes("\t") && newName.length >= 3) { 
    const namesTextarea = document.getElementById("namesTextarea");
    namesTextarea.value += (namesTextarea.value ? "\n" : "") + newName;
    const names = namesTextarea.value
      .split("\n")
      .filter((name) => name.trim() !== "");
    updateCircleDivisions(names);
    document.getElementById("newName").value = "";
    if (document.getElementById("errorMessage")) {
      document.getElementById("errorMessage").remove();
    }
    closeModal("addNameModal");
  } else {
    const modalContent = document.querySelector("#addNameModal .modal-content");
    if (document.getElementById("errorMessage")) {
      document.getElementById("errorMessage").remove();
    }
    modalContent.insertAdjacentHTML(
      "beforeend",
      '<p style="color: red;" id="errorMessage">Por favor, ingrese un nombre válido.</p>'
    );
  }
}

function updateRemoveNameModal(names) {
  const namesToRemoveCheckboxes = document.getElementById(
    "namesToRemoveCheckboxes"
  );
  namesToRemoveCheckboxes.innerHTML = "";
  names.forEach((name) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = name;
    checkbox.id = `checkbox-${name}`;
    const label = document.createElement("label");
    label.htmlFor = `checkbox-${name}`;
    label.textContent = name;
    const br = document.createElement("br");
    namesToRemoveCheckboxes.appendChild(checkbox);
    namesToRemoveCheckboxes.appendChild(label);
    namesToRemoveCheckboxes.appendChild(br);
  });
}

function removeSelectedNames() {
  const checkboxes = document.querySelectorAll(
    '#namesToRemoveCheckboxes input[type="checkbox"]'
  );
  const selectedNames = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const namesTextarea = document.getElementById("namesTextarea");
  const names = namesTextarea.value
    .split("\n")
    .filter((name) => name.trim() !== "" && !selectedNames.includes(name));
  namesTextarea.value = names.join("\n");
  updateCircleDivisions(names);
  closeModal("removeNameModal");
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
    "L",
    start.x,
    start.y,
  ].join(" ");

  return d;
}

function saveNamesToFile() {
  const namesTextarea = document.getElementById("namesTextarea");
  const blob = new Blob([namesTextarea.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "nombres.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showTooltip(text, color) {
  const tooltip = document.getElementById("tooltip");
  tooltip.textContent = text;
  tooltip.style.background = `rgba(${color}, 0.5)`;
  tooltip.style.display = "block";
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
}


window.onclick = function (event) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  };


  document.onkeydown = function (event) {
    if (event.key === "Escape") {
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        modal.style.display = "none";
      });
    }
  };

  
  document.getElementById("newName").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addNameFromModal();
    }
  });
  