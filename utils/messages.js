const moment = require("moment");

const getFormatData = (username, message) => {
  return {
    username,
    message,
    time: moment().format("h:mm a"),
  };
};

const getWelcomeMessage = (room) => {
  return `Welcome to room ${room}!`;
};

const getJoinMessage = (username) => {
  return `${username} has joined the chat`;
};

const getLeaveMessage = (username) => {
  return `${username} has left the chat`;
};

module.exports = {
  getFormatData,
  getJoinMessage,
  getLeaveMessage,
  getWelcomeMessage,
};
