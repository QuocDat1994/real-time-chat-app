const socket = io();

const LEAVE_BTN = document.querySelector("#leave-btn");
const SEND_FORM = document.querySelector("#send-form");
const SEND_INPUT = document.querySelector("#input-message");
const USER_LIST = document.querySelector("#user-list");
const MESSAGE_LIST = document.querySelector("#message-list");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// ===========================================
socket.emit("JOIN_ROOM", { username, room });

socket.on("NEW_USER", (data) => {
  appendMessage(data);
});

socket.on("CHAT_MESSAGE", (data) => {
  appendMessage(data);
});

socket.on("USER_LEAVE", (data) => {
  appendMessage(data);
});

socket.on("USER_LIST", (data) => {
  updateUserList(data);
});

// ===========================================
LEAVE_BTN.addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  }
});

SEND_FORM.addEventListener("submit", function (e) {
  e.preventDefault();
  socket.emit("SEND_MESSAGE", SEND_INPUT.value);
  SEND_INPUT.value = "";
});

// ===========================================
const appendMessage = (data) => {
  const { username, time, message } = data;
  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message");
  messageDiv.innerHTML = `
    <img
      class="message__avatar"
      src="${getAvatar(username)}"
      alt="${username}-avatar"
    />
    <div class="message__username">${username}</div>
    <div class="message__time">${time}</div>
    <div class="message__text">${message}</div>
  </div>`;

  MESSAGE_LIST.appendChild(messageDiv);

  // Scroll down
  MESSAGE_LIST.scrollTop = MESSAGE_LIST.scrollHeight;
};

const updateUserList = (data) => {
  USER_LIST.innerHTML = "";
  USER_LIST.innerHTML = data
    .map((username) => `<li>${username}</li>`)
    .join(" ");
};

const getAvatar = (username) => {
  const name = username.replace(" ", "+");
  return `https://ui-avatars.com/api/?name=${name}&background=random`;
};
