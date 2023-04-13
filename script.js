// Token HUB
axios.defaults.headers.common["Authorization"] = "bnqTMsCpHBK64o4k1Q48yF3u";

// URL's a serem utilizadas para as requesições
const urlParticipants =
  "https://mock-api.driven.com.br/api/vm/uol/participants";
const urlMessages = "https://mock-api.driven.com.br/api/vm/uol/messages";
const urlStatus = "https://mock-api.driven.com.br/api/vm/uol/status";

// Armazenando o container html onde as menssagens serão renderizadas
const container = document.querySelector(".container");

const userName = prompt("Qual seu nome?");

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
  const data = {
    from: userName,
    to: "Todos",
    text: document.querySelector("input").value,
    type: "message",
  };

  // Limpando o campo para digitar após a menssagem ser enviada
  document.querySelector("input").value = "";

  axios
    .post(urlMessages, data)
    .then((res) => console.log(res))
    .catch((err) => console.log(err.response));

  retrieveMessages();
}

// Entrando no chat
function enterChatRoom() {
  axios
    .post(urlParticipants, {
      name: userName,
    })
    .then((res) => {
      console.log(res);
    })
    .catch(() => {
      alert("Esse nome já está em uso, digite outro.");
      window.location.reload();
    });

  retrieveMessages();
}

// Chamando a função para entrar no bate papo
enterChatRoom();

// GET request para checar os participantes ativos no chat
function retrievePartcipants() {
  axios.get(urlParticipants).then((res) => {});
}

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
    .catch(() => {});
}, 5000);
