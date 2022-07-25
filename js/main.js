// Сохраняем API адрес (База данных) в переменную API

const API = "http://localhost:8000/trip";

// Сохраняем в переменные все инпуты и кнопки для ввода данных
let inpTitle = document.getElementById("inpTitle");
let inpDesk = document.getElementById("inpDesk");
let inpImg = document.getElementById("inpImg");
let inpPrice = document.getElementById("inpPrice");
let btnAdd = document.getElementById("btnAdd");
let sectionTrips = document.getElementById("sectionTrips");
let searchValue = "";
let currentPage = 1;

// Навешиваем событие на кнопку btnAdd
btnAdd.addEventListener("click", () => {
  if (
    !inpTitle.value.trim() ||
    !inpDesk.value.trim() ||
    !inpImg.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Error, please all inputs");
    return;
  }
  let newTrip = {
    tripTitle: inpTitle.value,
    tripDesk: inpDesk.value,
    tripImg: inpImg.value,
    tripPrice: +inpPrice.value,
  };
  createTrip(newTrip);
});

// ! ================== CREATE START==================

// Функция для добавления новых туров в БД
function createTrip(tripObj) {
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(tripObj),
  }).then(() => readTrips());
  inpTitle.value = "";
  inpDesk.value = "";
  inpImg.value = "";
  inpPrice.value = "";
}

// ! ============= READ =================
// Создаем функцию для отображения данных
function readTrips() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`)
    .then((res) => res.json())
    .then((data) => {
      sectionTrips.innerHTML = "";
      data.forEach((item) => {
        sectionTrips.innerHTML += `
        <div class ="card m-4 cardBook" style="width: 18rem" >
        <img class ="card-img-top detailsCard" style="height: 280px" src="${item.tripImg}" alt="${item.tripTitle}">
        <div class="card-body">
          <h5 class="cart-title">${item.tripTitle}</h5>
          <h5 class="card-title">${item.tripPrice} KPI</h5>
          <h5 class="card-title"></h5>
          <p class="card-text">${item.tripDesk}</p>
          <button id="${item.id}" class="btn btn-danger btnDelete">DELETE</button>

          <button type="button" class="btn btn-warning btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Edit
</button>
        </div>
        </div>
        `;
      });
    });
}
readTrips();

// !============ DELETE START ==================

document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readTrips());
  }
});

//!======= EDIT START==========
let editInpTitle = document.getElementById("editInpTitle");
let editInpDesk = document.getElementById("editInpDesk");
let editInpImg = document.getElementById("editInpImg");
let editInpPrice = document.getElementById("editInpPrice");
let btnEditSave = document.getElementById("btnEditSave");
// СОбытие на кнопку EDIT
document.addEventListener("click", (e) => {
  // console.log(e);
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    // console.log(id);
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        editInpTitle.value = data.tripTitle;
        editInpDesk.value = data.tripDesk;
        editInpImg.value = data.tripImg;
        editInpPrice.value = data.tripPrice;
        btnEditSave.setAttribute("id", data.id);
      });
  }
});

btnEditSave.addEventListener("click", () => {
  let editedTrip = {
    tripTitle: editInpTitle.value,
    tripDesk: editInpDesk.value,
    tripImg: editInpImg.value,
    tripPrice: editInpPrice.value,
  };
  console.log(editedTrip, btnEditSave.id);

  editTrip(editedTrip, btnEditSave.id);
});

function editTrip(editObj, id) {
  // console.log(editObj, id);
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(editObj),
  }).then(() => readTrips());
}
//! ====== EDIT FINISH=========

// !========== SEARCH =======
let inpSearch = document.getElementById("inpSearch");
let btnSearch = document.getElementById("btnSearch");
inpSearch.addEventListener("input", (e) => {
  console.log(e);
  searchValue = e.target.value;
  readTrips();
});
// !============= Paginate==========
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  currentPage--;
  readTrips();
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  readTrips();
});
