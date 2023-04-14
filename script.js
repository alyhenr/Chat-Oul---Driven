// Token HUB
axios.defaults.headers.common["Authorization"] = "FmwapjukXtQjz0rEIouU5AMC";

// URL's a serem utilizadas para as requesições
const urlParticipants =
  "https://mock-api.driven.com.br/api/vm/uol/participants";
const urlMessages = "https://mock-api.driven.com.br/api/vm/uol/messages";
const urlStatus = "https://mock-api.driven.com.br/api/vm/uol/status";

// Elementos do DOM a serem utilizados:
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
// Overlay para fechar o menu dos usuários também
const overlay = document.querySelector(".overlay");
// ---------------------------------------------------
// Variáveis a serem usada:
// Variável para o nome do usuário
let userName;
// Variável para o nome da pessoa a receber a mensagem
let personName = "Todos";
// Variável para indicar se a mensagem é publica ou privada
let messageVisibility;
// ------------------------------------------------------
// Funções criadas para as funcionalidades do projeto:

// Selecionando se a mensagem é pública ou privada
function messageType(visibility) {
  document.querySelectorAll(".visibility").forEach((div) => {
    div.querySelector(".check").classList.add("hidden");
  });
  visibility.querySelector(".check").classList.remove("hidden");
  switch (visibility.id) {
    case "public":
      messageVisibility = "message";
      break;

    case "private":
      messageVisibility = "private_message";
      break;

    default:
      messageVisibility = "status";
      break;
  }
}

// Selecionando uma pessoa para mandar menssagem
function selectedPerson(person) {
  const everyone = document.querySelector(".everyone");
  if (person != everyone) {
    everyone.querySelector('[data-test="check"]').classList.add("hidden");
  }
  document
    .querySelectorAll('.online-users [data-test="check"]')
    .forEach((user) => {
      user.classList.add("hidden");
    });
  // Salvando o nome da pessoa
  personName = person.querySelector("h2").textContent;
  // Adicionando ion-icon de check
  person.querySelector(".check").classList.remove("hidden");
}

// Renderizando os usuários online quando o menu é clicado
function renderPartcipants(users) {
  hiddenMenu.classList.remove("hidden");
  const person = hiddenMenu.querySelector(".online-users .person");
  person.innerHTML = "";

  // Renderizando no HTML
  users.forEach((user) => {
    person.innerHTML += `
      <li data-test="participant" onclick="selectedPerson(this)">
        <ion-icon name="person-circle"></ion-icon>
        <h2>${user.name}</h2>
        <ion-icon data-test="check" class="hidden check" name="checkmark-circle"></ion-icon>
      </li>
    `;
  });
}

// GET request para checar os participantes ativos no chat
function retrievePartcipants() {
  if (arguments.length > 0) {
    if (arguments[0].name === "people") {
      hiddenMenu.classList.remove("hidden");
    }
  }
  axios.get(urlParticipants).then((res) => {
    const users = res.data;
    if (!hiddenMenu.classList.contains("hidden")) {
      renderPartcipants(users);
    }
  });
}

// Renderizando as menssagens no container html
function renderMessages(res) {
  container.innerHTML = "";
  res.forEach((object, i) => {
    const { from } = object;
    const { to } = object;
    const { text } = object;
    const { time } = object;
    const { type } = object;

    const backgroundColor =
      type === "status"
        ? "#DCDCDC"
        : type === "private_message"
        ? "#FFDEDE"
        : "#FFF";

    container.innerHTML += `
      <div data-test="message" id="m-${i + 1}">
        <p style="background-color: ${backgroundColor}">
          <span class="time">(${time})</span> <strong>${from}</strong> 
            para <strong>${to}</strong>: ${text}
        </p>
      </div>
    `;
  });
  // Scroll para a ultima mensagem renderizada
  container.querySelector(`#m-${res.length}`).scrollIntoView();
}

// GET request para pegar as menssagens do servidor
function retrieveMessages() {
  axios
    .get(urlMessages)
    .then((res) => {
      // Filtrando menssagems que são reservadas para outros usuaŕios
      // const filteredMessages = res.data.filter((message) => {
      //   if (message.type === "private_message") {
      //     if (message.from !== userName && message.to !== userName)
      //       return false;
      //   }
      //   return true;
      // });
      renderMessages(res.data);
    })
    .catch(() => {
      alert("Erro ao carregar as mensagems, entre novamente no bate papo.");
      window.location.reload();
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
    to: personName != "Todos" ? personName : "Todos",
    text: messageContent,
    type: messageVisibility != undefined ? messageVisibility : "message",
  };

  // Limpando o input de digitar após a menssagem ser enviada
  document.querySelector("#message").value = "";

  axios.get(urlParticipants).then((res) => {
    // 1.
    // Verifica se o usuário ainda está conectado na sala
    // (em caso de ficar usando outra aba e deixar o chat aberto,
    //   o chat continua aparacendo mas a conexão é perdido e o post na url
    //   de estatus retorna status code 400 (Bad Request))
    if (!res.data.map((user) => user.name).includes(userName)) {
      alert("Reconecte-se na sala.");
      window.location.reload();
    }
    //  2.
    // Verifica se o destinatáio ainda está online:
    if (personName != "Todos") {
      if (!res.data.map((user) => user.name).includes(personName)) {
        alert("Esse usuário não está mais online...");
        window.location.reload();
      }
    }

    // Se o usuário está online, a mensagem é postada
    axios
      .post(urlMessages, data)
      .then(retrieveMessages)
      .catch(() => {
        window.location.reload();
      });
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
          .catch(() => window.location.reload());
      }, 5000);
      // Atualizando a lista de menssagens a cada 3s
      setInterval(() => {
        retrieveMessages();
      }, 2000);
      // Atualizando a lista de participantes a cada 10s
      setInterval(() => {
        retrievePartcipants();
      }, 10000);
    })
    .catch(() => {
      // Recarrega página em caso de erro
      window.location.reload();
    });
}

// Inicializando os eventos para o login do usuários:
login.addEventListener("keypress", (ev) => {
  // O botão de login é liberado quando a pessoa digita algum nome
  btnLogin.disabled = false;
  // Habilitando a escolha do nome para a tecla "Enter"
  if (ev.key === "Enter" && login.value != "") {
    userName = login.value;
    loginScreen.classList.add("hidden");
    // Chamando a função para entrar no bate papo
    enterChatRoom();
  }
});
// Botão de login
btnLogin.addEventListener("click", () => {
  if (login.value != "") {
    userName = login.value;
    loginScreen.classList.add("hidden");
    // Chamando a função para entrar no bate papo
    enterChatRoom();
  }
});
// -----------------------------------------------
// Menu lateral:
// Botão para fechar o menu com os usuários online, quando aberto
// (para o ion-icon x e o overlay)
[closeMenu, overlay].forEach((element) => {
  element.addEventListener("click", () => {
    hiddenMenu.classList.add("hidden");

    // Se ao fechar o menu lateral uma pessoa tiver sido selecionada
    // para receber a mensagem, isso fica indicado no placholder do input de mensagem
    if (personName != "Todos") {
      document.querySelector("#message").placeholder = `Escreva aqui
        Enviando para ${personName} (${
        messageVisibility === "message" ? "publicamente" : "reservadamente"
      })
        `;
    }
  });
});
