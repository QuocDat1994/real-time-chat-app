const users = [];

const getUserById = (id) => {
  return users.find((user) => user.id === id);
};

const getUserByRoom = (room) => {
  return users
    .filter((user) => user.room === room)
    .map((user) => user.username)
    .sort();
};

const joinRoom = (id, username, room) => {
  users.push({
    id,
    username,
    room,
  });
};

const leaveRoom = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = {
  joinRoom,
  leaveRoom,
  getUserById,
  getUserByRoom,
};
