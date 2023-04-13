// Token HUB
axios.defaults.headers.common["Authorization"] = "UdTri9RJtgkvEKKKOxYYRVs2";

// URL's a serem utilizadas para as requesições
const urlParticipants =
  "https://mock-api.driven.com.br/api/vm/uol/participants";
const urlMessages = "https://mock-api.driven.com.br/api/vm/uol/messages";
const urlStatus = "https://mock-api.driven.com.br/api/vm/uol/status";

// Armazenando o container html onde as menssagens serão renderizadas
const container = document.querySelector(".container");
// Menu com usuários online
const hiddenMenu = document.querySelector(".menu");

const userName = prompt("Digite seu nome");

// Selecionando uma pessoa para mandar menssagem
function selectedPerson(person) {
  // Salvando o nome da pessoa
  const personName = person.querySelector("h2").textContent;
  // Adicionando ion-icon de check
  person.querySelector(".hidden").classList.toggle("hidden");
}

// Renderizando os usuários online quando o menu é clicado
function renderPartcipants(users) {
  hiddenMenu.classList.remove("hidden");
  const person = hiddenMenu.querySelector(".online-users .person");
  person.innerHTML = "";

  // Renderizando no HTML
  users.forEach((user) => {
    person.innerHTML += `
      <li onclick="selectedPerson(this)">
        <ion-icon name="person-circle"></ion-icon>
        <h2>${user.name}</h2>
        <ion-icon class="hidden" name="checkmark-circle"></ion-icon>
      </li>
    `;
  });
}

// GET request para checar os participantes ativos no chat
function retrievePartcipants() {
  axios.get(urlParticipants).then((res) => {
    const users = res.data;
    renderPartcipants(users);
  });
}

// Renderizando as menssagens no container html
function renderMessages(res) {
  container.innerHTML = "";
  res.data.forEach((object) => {
    const from = object.from;
    const to = object.to;
    const text = object.text;
    const time = object.time;

    container.innerHTML += `      
      <p>
        <span class="time">(${time})</span> <strong>${from}</strong> 
          para <strong>${to}</strong>: ${text}
      </p>
    `;

    container.scroll(0, 50000);
  });
}

// GET request para pegar as menssagens do servidor
function retrieveMessages() {
  axios
    .get(urlMessages)
    .then(renderMessages)
    .catch((err) => {
      console.log(err);
    });
}

// Enviando menssagem
function sendMessage() {
  const messageContent = document.querySelector("input").value;
  if (messageContent == "") {
    return;
  }

  const data = {
    from: userName,
    to: "Todos",
    text: messageContent,
    type: "message",
  };

  // Limpando o campo para digitar após a menssagem ser enviada
  document.querySelector("input").value = "";

  axios
    .post(urlMessages, data)
    .then(retrieveMessages)
    .catch(() => {
      window.location.reload();
    });
}

// Entrando no chat
function enterChatRoom() {
  axios
    .post(urlParticipants, {
      name: userName,
    })
    .then(() => {
      // Fazendo um get request para renderizar as menssagens imediatament após entrar na sala
      retrieveMessages();

      // Mantendo a conexão a cada 5s, post request para url de status
      setInterval(() => {
        axios
          .post(urlStatus, {
            name: userName,
          })
          .then((res) => console.log(res));
      }, 5000);

      // Atualizando a lista de menssagens a cada 2s
      setInterval(() => {
        retrieveMessages();
      }, 2000);
    })
    .catch(() => {
      alert("Esse nome já está em uso, digite outro.");
      window.location.reload();
    });
}

// Chamando a função para entrar no bate papo
enterChatRoom();
