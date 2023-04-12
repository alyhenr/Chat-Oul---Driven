const urlParticipants =
  "https://mock-api.driven.com.br/api/v6/uol/participants";
const urlMessages = "https://mock-api.driven.com.br/api/vm/uol/messages";
const urlStatus = "https://mock-api.driven.com.br/api/vm/uol/status";
const urlSendMessage = "https://mock-api.driven.com.br/api/vm/uol/messages";

const container = document.querySelector(".container");

const user = prompt("Digite o seu nome");

// Token HUB
axios.defaults.headers.common["Authorization"] = "vqz5hauIujNzhFXvvpxQ8PMq";

function renderMessages(res) {
  res.data.forEach((object) => {
    const from = object.from;
    const to = object.to;
    const text = object.text;
    const time = object.time;

    container.innerHTML += `
      <p><span>${time}</span> ${from} para ${to}: ${text}</p>
    `;
  });
}

function getMessages() {
  axios
    .get(urlMessages)
    .then(renderMessages)
    .catch((err) => {});
}

function enterChatRoom() {
  axios
    .post(urlParticipants, {
      name: user,
    })
    .then(() => {
      // Update Status every 5 secondes
      setInterval(() => {
        axios.post(urlStatus, {
          name: user,
        });
      }, 5000);
    })
    .catch(enterChatRoom);

  getMessages();
}

function sendMessage() {
  const content = document.querySelector("input").value;
  console.log(content);
  console.log(user);
  axios
    .post(urlSendMessage, {
      from: user,
      to: "Todos",
      text: content,
      type: "message",
    })
    .then((res) => console.log(res));
}
