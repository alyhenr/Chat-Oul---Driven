// Token HUB
axios.defaults.headers.common["Authorization"] = "19bSCmBLbMRnsIejs68nlLxx";

// URL's a serem utilizadas para as requesições
const urlParticipants =
  "https://mock-api.driven.com.br/api/vm/uol/participants";
const urlMessages = "https://mock-api.driven.com.br/api/vm/uol/messages";
const urlStatus = "https://mock-api.driven.com.br/api/vm/uol/status";

// Tela de login
const loginScreen = document.querySelector(".login");
// Input de login
const login = document.querySelector(".login input");
// Botão de login
const btnLogin = document.querySelector(".login button");
// Armazenando o container html onde as menssagens serão renderizadas
const container = document.querySelector(".container");
// Menu com usuários online
const hiddenMenu = document.querySelector(".menu");
// Botão para fechar o menu dos usuários
const closeMenu = document.querySelector("#close");
// Variável para o nome do usuário
let userName;

// ------------------------------------------------------
// Funções criadas para as funcionalidades do projeto:

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
  const messageContent = document.querySelector("#message").value;

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
  document.querySelector("#message").value = "";

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

      // Adicionando o event listener para a tecla enter enviar mensagens também
      document.querySelector("#message").addEventListener("keypress", (ev) => {
        if (ev.key === "Enter" && ev.currentTarget.value != "") {
          sendMessage();
        }
      });

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

// Inicializando os eventos para o login do usuários
login.addEventListener("keypress", (ev) => {
  // O botão de login é liberado quando a pessoa digita algum nome
  btnLogin.disabled = false;
  // Habilitando a escolha do nome para a tecla "Enter"
  if (ev.key === "Enter" && login.value != "") {
    userName = login.value;
    loginScreen.classList.add("hidden");
    // Chamando a função para entrar no bate papo
    enterChatRoom(userName);
  }
});

btnLogin.addEventListener("click", () => {
  if (login.value != "") {
    userName = login.value;
    loginScreen.classList.add("hidden");
    // Chamando a função para entrar no bate papo
    enterChatRoom(userName);
  }
});

// Botão para fechar o menu com os usuários online, quando aberto
closeMenu.addEventListener("click", () => {
  hiddenMenu.classList.add("hidden");
});
