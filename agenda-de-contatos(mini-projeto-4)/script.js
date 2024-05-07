class Contact {
  constructor({
    id,
    name,
    phone,
    email,
    photo,
    bio,
    tipo_contato,
    pagina_pessoal,
    check_favorito,
  }) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.photo = photo;
    this.bio = bio;
    this.tipo_contato = tipo_contato;
    this.pagina_pessoal = pagina_pessoal;
    this.check_favorito = check_favorito;
  }
}

const contactList = document.getElementById("contact-list");
const addContactForm = document.getElementById("add-contact-form");

document.addEventListener("DOMContentLoaded", listContacts);

// Event listener para o envio do formulário
addContactForm.addEventListener("submit", submitContact);

function listContacts() {
  // Busca contatos na API
  fetchContacts()
    .then((contacts) => {
      renderContacts(contacts);
    })
    .catch((error) => {
      console.error("Houve um problema ao buscar os contatos:", error);
    });
}

function submitContact(event) {
  event.preventDefault(); // Evita o envio padrão do formulário

  const formData = new FormData(addContactForm);
  const contactData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    photo: formData.get("photo") || "https://via.placeholder.com/100", // Foto padrão
    bio: formData.get("bio"),
    pagina_pessoal: formData.get("pagina_pessoal"),
    tipo_contato: formData.get("tipo_contato"),
    check_favorito: formData.get("check_favorito"),
  };

  addContact(contactData)
    .then(() => {
      return fetchContacts();
    })
    .then((contacts) => {
      renderContacts(contacts);
      addContactForm.reset(); // Limpa os campos do formulário
    })
    .catch((error) => {
      console.error("Houve um problema ao adicionar o contato:", error);
    });
}

// Função para buscar contatos na API
function fetchContacts() {
  return (
    fetch(
      "https://agenda-de-contatos-84164-default-rtdb.firebaseio.com/contacts.json"
    )
      // https://imd0404-webi-default-rtdb.firebaseio.com/contacts.json
      .then((response) => {
        if (!response.ok) {
          throw new Error("Resposta de rede não foi ok");
        }
        return response.json();
      })
      .then((contacts) => {
        const contactsList = [];
        for (let key in contacts) {
          const contact = new Contact({
            id: key,
            name: contacts[key].name,
            phone: contacts[key].phone,
            email: contacts[key].email,
            photo: contacts[key].photo,
            bio: contacts[key].bio,
            pagina_pessoal: contacts[key].pagina_pessoal,
            tipo_contato: contacts[key].tipo_contato,
            check_favorito: contacts[key].check_favorito,
          });

          //contacts.push({ id: key, ...data[key] });
          contactsList.push(contact);
        }
        return contactsList;
      })
  );
}

function emailMask(email) {
  var emailMasked = email.replace(/([^@\.])/g, "*").split("");
  var previous = "";
  for (i = 0; i < emailMasked.length; i++) {
    if (i <= 1 || previous == "." || previous == "@") {
      emailMasked[i] = email[i];
    }
    previous = email[i];
  }
  return emailMasked.join("");
}

// Função para adicionar contato na API
function addContact(contactData) {
  return fetch(
    "https://agenda-de-contatos-84164-default-rtdb.firebaseio.com/contacts.json",
    // https://imd0404-webi-default-rtdb.firebaseio.com/contacts.json
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Resposta de rede não foi ok");
    }
  });
}

// Função para renderizar contatos na página
function renderContacts(contacts) {
  contactList.innerHTML = ""; // Limpa os contatos existentes

  // Sempre vai renderizar os contatos em ordem alfabetica
  contacts.sort(function (a, b) {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    return nameA.localeCompare(nameB);
  });

  contacts.forEach((contact) => {
    const contactCard = createContactCard(contact);
    contactList.appendChild(contactCard);
  });
}

function phoneMask(phone) {
  return phone
    .replace(/\D/g, "")
    .replace(/^(\d)/, "($1")
    .replace(/^(\(\d{2})(\d)/, "$1) $2")
    .replace(/(\d{4})(\d{1,5})/, "$1-$2")
    .replace(/(-\d{5})\d+?$/, "$1");
}

// Função para criar o card de contato
function createContactCard(contact) {
  const contactCard = document.createElement("div");
  contactCard.className = "hidden";
  contactCard.classList.add("contact");
  contactCard.style =
    "border: 5px solid #6200EE; border-style: dashed; padding: 10px; margin-bottom: 10px;";

  const photo = document.createElement("img");
  photo.src = contact.photo;
  photo.alt = contact.name;
  photo.style.width = "100px";
  photo.style.height = "100px";
  photo.style.borderRadius = "50%";

  const name = document.createElement("h3");
  name.textContent = contact.name;

  const phone = document.createElement("p");
  phoneMask(phone.textContent);
  phone.textContent = `Telefone: ${phoneMask(contact.phone)}`;
  // phone.textContent = `Telefone: ${contact.phone}`;

  const email = document.createElement("p");
  email.textContent = `Email: ${contact.email}`;

  const biografia = document.createElement("p");
  biografia.textContent = `${contact.bio}`;

  const site_contato = document.createElement("a");
  site_contato.textContent = `${contact.pagina_pessoal}`;
  site_contato.href = contact.pagina_pessoal;
  site_contato.target = "_blank";

  const tipo = document.createElement("p");
  tipo.textContent = `Tipo de contato: ${contact.tipo_contato}`;
  contactCard.classList.add(contact.tipo_contato);

  const botao_favorita = document.createElement("button");
  botao_favorita.textContent = "⭐️";
  botao_favorita.className = "btn btn-outline-light";
  botao_favorita.style = "margin: 10px";

  const estrela = document.createElement("p");
  estrela.textContent = "☆ ★ ✮ ★ ☆☆ ★ ✮ ★ ☆★";
  estrela.classList.add("estrela");

  // contactCard.classList.add(contact.check_favorito);

  // botao de favoritar
  botao_favorita.addEventListener("click", function (e) {
    const estrelaAtual = contactCard.querySelector(".estrela");
    if (estrelaAtual) {
      // Se estiver presente, remove a estrela e as classes
      contactCard.removeChild(estrelaAtual);
      contactCard.classList.remove("estrela");
      contactCard.classList.remove("favorito");

      //alerta de que a operação deu certo
      alert("Contato retirado dos favoritos.");
      contact.check_favorito = "nao_favorito";
      console.log(contact.check_favorito);
    } else {
      // Se não estiver presente, adiciona a estrela e as classes
      contactCard.appendChild(estrela);
      contactCard.classList.add("estrela");
      contactCard.classList.add("favorito");

      //alerta de que a operação deu certo
      alert("Contato adicionado aos favoritos");
      contact.check_favorito = "favorito";
      console.log(contact.check_favorito);
    }
  });

  // botao de editar
  const botao_edita = document.createElement("button");
  botao_edita.textContent = `Editar contato`;
  botao_edita.className = "btn btn-outline-light";

  botao_edita.addEventListener("click", function (e) {
    var input = document.getElementById("name");
    input.value = contact.name;
    input.readOnly = true;
    var inputPhone = document.getElementById("phone");
    inputPhone.value = contact.phone;
    phoneMask(inputPhone.value);
    var inputEmail = document.getElementById("email");
    inputEmail.value = contact.email;
    var inputBio = document.getElementById("bio");
    inputBio.value = contact.bio;
    var inputPaginaPessoal = document.getElementById("pagina_pessoal");
    inputPaginaPessoal.value = contact.pagina_pessoal;
    var inputPhoto = document.getElementById("photo");
    inputPhoto.value = contact.photo;
    var inputTipo = document.getElementById("tipo_contato");
    inputTipo.value = contact.tipo_contato;
    var inputCheck = document.getElementById("check_favorito");
    inputCheck.value = contact.check_favorito;

    alert("Edição para fazer.");
    const submitToEdit = document.getElementById("botao_submit");
    submitToEdit.textContent = "EDITAR";

    submitToEdit.addEventListener("click", function () {
      alert("Edição realizada");
      submitToEdit.textContent = "Adicionar Contato";
    });
  });

  // botao de deletar
  const botao_deleta = document.createElement("button");
  botao_deleta.textContent = `Deletar contato`;
  botao_deleta.style = "margin: 10px";
  botao_deleta.className = "btn btn-outline-light";

  botao_deleta.addEventListener("click", function () {
    if (confirm("Tem certeza que deseja deletar esse contato?")) {
      deleteContact(contact.id)
        .then(() => {
          return fetchContacts();
        })
        .then((contacts) => {
          renderContacts(contacts);
        })
        .catch((error) => {
          console.error("Houve um problema ao deletar o contato:", error);
        });
    }
    alert("Contato deletado");
  });

  const checkbox = document.getElementById("check_favorito");

  contactCard.appendChild(photo);
  contactCard.appendChild(name);
  // contactCard.appendChild(site_contato);
  contactCard.appendChild(phone);
  contactCard.appendChild(email);
  contactCard.appendChild(biografia);
  contactCard.appendChild(tipo);
  contactCard.appendChild(botao_favorita);
  contactCard.appendChild(botao_edita);
  contactCard.appendChild(botao_deleta);

  if (!(contact.check_favorito !== "favorito")) {
    contactCard.appendChild(estrela);
    contactCard.classList.add("estrela");
    contactCard.classList.add(contact.check_favorito);
  }

  return contactCard;
}

function deleteContact(contactId) {
  return fetch(
    `https://agenda-de-contatos-84164-default-rtdb.firebaseio.com/contacts/${contactId}.json`,
    {
      method: "DELETE",
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Resposta de rede não foi ok");
    }
  });
}

filterSelection("all");
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("hidden");
  if (c == "all") c = "";

  for (i = 0; i < x.length; i++) {
    showRemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) showAddClass(x[i], "show");
  }
}

function showAddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

function showRemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

var btnContainer = document.getElementById("filters");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
