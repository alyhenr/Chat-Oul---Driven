// Token HUB
axios.defaults.headers.common["Authorization"] = "bk8mTTWZl6dSDpoGXZGMJauO";

// URL's a serem utilizadas para as requesições
const urlParticipants =
  "https://mock-api.driven.com.br/api/v6/uol/participants";
const urlMessages = "https://mock-api.driven.com.br/api/vm/uol/messages";
const urlStatus = "https://mock-api.driven.com.br/api/vm/uol/status";

// Armazenando o container html onde as menssagens serão renderizadas
const container = document.querySelector(".container");

// Pedindo o nome do usuário
const userName = prompt("Digite seu nome");

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
  });
}

// GET request para checar os participantes ativos no chat
function retrievePartcipants() {
  axios.get(urlParticipants).then((res) => {});
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
function sendMessage(isNewLogin) {
  const content = isNewLogin
    ? "Entra na sala..."
    : document.querySelector("input").value;

  // Limpando o campo para digitar após a menssagem ser enviada
  document.querySelector("input").value = "";

  axios
    .post(urlMessages, {
      from: userName,
      to: "Todos",
      text: content,
      type: "message",
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err.response));
}

// Entrando no chat
function enterChatRoom() {
  axios
    .post(urlParticipants, {
      name: userName,
    })
    .then(() => {
      // Menssagem de "entrou na sala" é enviada
      sendMessage(true);
    })
    .catch((err) => {
      console.log(err.response);
      alert("Esse nome já está em uso, digite outro.");
      window.location.reload();
    });

  retrieveMessages();
}

// Chamando a função para entrar no bate papo
enterChatRoom();

// Atualizando a lista de participantes e menssagens a cada 2s
setInterval(() => {
  retrievePartcipants();
  retrieveMessages();
}, 2000);

// Mantendo a conexão, post request para o status
setInterval(() => {
  axios
    .post(urlStatus, {
      name: userName,
    })
    .catch((err) => {
      console.log(err.response);
    });
}, 5000);
