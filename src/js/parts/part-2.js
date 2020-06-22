import ServiceData from "../parts/part-1";
import store from "../store/store";
import * as actions from "../actions/actions";

//Instance ServiceData
const data = new ServiceData();

//Elements node
const tableHead = document.querySelector(".table > thead");
const arrowSort = document.querySelectorAll(".arrow-sort");
const formCreatePerson = document.querySelector(".form-create-person");
const btnCreatePerson = document.querySelector(".btn-create-person");
const formEditPerson = document.querySelector(".edit-person");
const btnCancelPerson = document.querySelector(".btn-cancel");
const tableBody = document.querySelector(".table > tbody");
const processLoading = document.querySelector(".popup-processing");

//Actions
const {
  fetchPersonsRequest,
  fetchPersonsSuccess,
  fetchPersonsFailure,
  updatePersons,
  personsFilter,
  foundEditPerson,
} = actions;

//Init App
function init() {
  store.subscribe(renderRows);
  store.dispatch(fetchPersonsRequest());
  data
    .getPersons()
    .then((data) => store.dispatch(fetchPersonsSuccess(data)))
    .catch((error) => store.dispatch(fetchPersonsFailure(error)));
  //Btn show form for create person
  btnCreatePerson.addEventListener("click", showOrHideFormCreate);
  //Submit form for create person
  formCreatePerson.addEventListener("submit", createPerson);
  //Btn for cancel edit person
  btnCancelPerson.addEventListener("click", cancelEditPerson);
  //Submit form for edit person
  formEditPerson.addEventListener("submit", editPerson);
  //Filter persons
  tableHead.addEventListener("click", selectFilter);
}

//Function for create row table
function createRowTable(person) {
  const row = document.createElement("tr");

  const td = `
        <td class="w-25">${person.ID}</td>
        <td class="w-50">${person.Name}</td>
        <td class="w-25">
            ${person.Age}
            <button class="btn-person btn-person-edit">
            </button> 
            <button class="btn-person btn-person-remove">
            </button>
        </td>
    `;

  row.innerHTML = td;

  row.querySelector(".btn-person-remove").addEventListener("click", () => {
    const newPersonsList = changePersons(person, "delete");
    fetchRequest(newPersonsList, "удаления");
  });

  row.querySelector(".btn-person-edit").addEventListener("click", () => {
    showOrHideFormCreate(false);
    fillForm(person);
  });

  tableBody.appendChild(row);
}

//Render row function
function renderRows() {
  tableBody.innerHTML = "";
  if (store.getState().error) {
    alert(store.getState().error.message);
  }
  if (store.getState().persons) {
    const sortData = sortPersons([...store.getState().persons]);
    sortData.forEach((person) => {
      if (person) {
        createRowTable(person);
      }
    });
  }
}

//Function request REST API Server
function fetchRequest(newPersonsList, message) {
  loadingData(message);
  data
    .updatePersons(newPersonsList)
    .then(() => {
      store.dispatch(updatePersons(newPersonsList));
      message == "создания" ? showOrHideFormCreate() : null;
      message == "редактирования" ? hideFormEdit() : null;
      let succesProcessMessage;
      if (message == "создания") {
        succesProcessMessage = "создан";
      }
      if (message == "редактирования") {
        succesProcessMessage = "отредактирован";
      }
      if (message == "удаления") {
        succesProcessMessage = "удален";
      }
      processLoading.querySelector(
        ".message-process"
      ).innerText = `Пользователь успешно ${succesProcessMessage}!`;
      setTimeout(() => (processLoading.style.display = "none"), 1500);
    })
    .catch((error) => alert(error.message));
}

//Function popup process loading
function loadingData(actionType) {
  const messageProcessing = `
        <div class="spinner-border text-warning" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="message-process">
            Идёт процесс ${actionType} пользователя!
        </div>
    `;
  processLoading.innerHTML = messageProcessing;
  processLoading.style.display = "flex";
}

//Create, edit or delete person
function changePersons(dataPerson, action) {
  switch (action) {
    case "delete":
      const personIndex = store
        .getState()
        .persons.findIndex(({ ID }) => ID === dataPerson.ID);
      return [
        ...store.getState().persons.slice(0, personIndex),
        ...store.getState().persons.slice(personIndex + 1),
      ];

    case "create":
      const newPerson = {
        ID: dataPerson[0].value,
        Name: dataPerson[1].value,
        Age: dataPerson[2].value,
      };
      return [...store.getState().persons, newPerson];

    case "edit":
      const indx = store.getState().editPerson;
      const editPerson = {
        ID: dataPerson[0].value,
        Name: dataPerson[1].value,
        Age: dataPerson[2].value,
      };
      return [
        ...store.getState().persons.slice(0, indx),
        editPerson,
        ...store.getState().persons.slice(indx + 1),
      ];

    default:
      return store.getState().persons;
  }
}

//-----------------------------------------------------------
//Functions sort persons
function sortPersons(dataPersons) {
  const filter = store.getState().filter;

  switch (filter) {
    case "":
      return dataPersons;
    case "id":
      return sortId(dataPersons);
    case "surname":
      return sortSurName(dataPersons);
    case "name":
      return sortName(dataPersons);
    case "age":
      return sortAge(dataPersons);
  }
}

function sortId(data) {
  return data.sort((pers1, pers2) => pers1.ID - pers2.ID);
}

function sortSurName(data) {
  return data.sort((pers1, pers2) => {
    if (pers1.Name > pers2.Name) {
      return 1;
    }

    if (pers1.Name < pers2.Name) {
      return -1;
    }

    return 0;
  });
}

function sortName(data) {
  return data.sort((pers1, pers2) => {
    const name1 = pers1.Name.split(" ")[1];
    const name2 = pers2.Name.split(" ")[1];
    if (name1 > name2) {
      return 1;
    }

    if (name1 < name2) {
      return -1;
    }

    return 0;
  });
}

function sortAge(data) {
  return data.sort((pers1, pers2) => pers1.Age - pers2.Age);
}
//Functions sort persons
//-----------------------------------------------------------

//Data for form edit
function fillForm(person) {
  const foundPerson = store
    .getState()
    .persons.find(({ ID }) => ID === person.ID);
  const foundIndexPerson = store
    .getState()
    .persons.findIndex(({ ID }) => ID === person.ID);
  store.dispatch(foundEditPerson(foundIndexPerson));
  btnCreatePerson.style.display = "none";
  formEditPerson.style.display = "block";
  const inputs = formEditPerson.querySelectorAll("input");
  inputs[0].value = foundPerson.ID;
  inputs[1].value = foundPerson.Name;
  inputs[2].value = foundPerson.Age;
  inputs[0].focus();
}

//Function show or hide form for create person
function showOrHideFormCreate(hideEdit = true) {
  if (hideEdit) {
    const showOrHide = btnCreatePerson.classList.contains("active-form");
    const focusOrBlur = formCreatePerson.querySelector("input");
    formCreatePerson.style.display = showOrHide ? "none" : "block";
    showOrHide ? focusOrBlur.blur() : focusOrBlur.focus();
    formCreatePerson
      .querySelectorAll("input")
      .forEach((input) => (input.value = ""));
    btnCreatePerson.innerText = !showOrHide
      ? "Скрыть форму"
      : "Добавить пользователя";
    btnCreatePerson.classList.toggle("active-form");
  } else {
    formCreatePerson.style.display = "none";
    btnCreatePerson.style.display = "block";
    btnCreatePerson.innerText = "Добавить пользователя";
    btnCreatePerson.classList.remove("active-form");
  }
}

//Function hide form for edit person
function hideFormEdit() {
  formEditPerson
    .querySelectorAll("input")
    .forEach((input) => (input.value = ""));
  formEditPerson.style.display = "none";
  showOrHideFormCreate(false);
}

//Function for cancel edit person
function cancelEditPerson() {
  hideFormEdit();
}

//Function create persons
function createPerson(e) {
  e.preventDefault();

  const inputs = this.querySelectorAll("input");

  if (validateDataPerson(inputs)) {
    const newPersonsList = changePersons(inputs, "create");
    fetchRequest(newPersonsList, "создания");
  }
}

//Function edit persons
function editPerson(e) {
  e.preventDefault();

  const inputs = this.querySelectorAll("input");

  if (validateDataPerson(inputs, "edit")) {
    const newPersonsList = changePersons(inputs, "edit");
    fetchRequest(newPersonsList, "редактирования");
  }
}

//Function validation entering data
function validateDataPerson(inputs, action) {
  const dataID = +inputs[0].value;
  const dataFullName = inputs[1].value;
  const dataAge = parseInt(inputs[2].value);

  if (isNaN(dataID) || dataID == 0) {
    alert("Поле ID должно быть целым числом и не может быть нулём!");
    return false;
  } else {
    if (action !== "edit") {
      const foundID = store.getState().persons.find(({ ID }) => +ID === dataID);
      if (foundID) {
        alert("Пользователь с таким ID уже существует");
        return false;
      }
    }
  }

  if (dataFullName.length > 100 || dataFullName.length < 3) {
    alert("ФИО пользоватедя не может быть меньше 3 символов");
    return false;
  }

  if (isNaN(dataAge) || dataAge > 100 || dataAge <= 0) {
    alert("Возраст не может быть строкой, меньше 1 или больше 100");
    return false;
  }

  return true;
}

//Selection filter person
function selectFilter(e) {
  if (e.target.tagName === "SPAN") {
    if (e.target.classList.contains("active-sort")) {
      store.dispatch(personsFilter(""));
      e.target.classList.remove("active-sort");
    } else {
      arrowSort.forEach((arrow) => {
        arrow.classList.remove("active-sort");
        e.target.classList.add("active-sort");

        if (e.target.classList.contains("sort-id")) {
          store.dispatch(personsFilter("id"));
        }

        if (e.target.classList.contains("sort-surname")) {
          store.dispatch(personsFilter("surname"));
        }

        if (e.target.classList.contains("sort-name")) {
          store.dispatch(personsFilter("name"));
        }

        if (e.target.classList.contains("sort-age")) {
          store.dispatch(personsFilter("age"));
        }
      });
    }
  }
}

export default init;
