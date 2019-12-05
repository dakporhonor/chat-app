// jshint esversion: 9
const users = [];

const addUser = ({
  id,
  username,
  room
}) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate user data
  if (!username || !room) {
    return {
      error: "Username and room are required!"
    };
  }

  // check for existing user
  const existingUser = users.find(user => {
    return user.username === username && user.room === room;
  });

  if (existingUser) {
    return {
      error: "Username already in use!"
    };
  }
  const user = {
    id,
    username,
    room
  };
  users.push(user);
  return {
    user
  };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
//   return users.filter(user => {
//     return user.id !== id;
//   });
// };

const getUser = id =>
  users.find(user => {
    return user.id === id;
  });

const getUsersInRoom = roomName =>
  users.filter(user => {
    return user.room === roomName;
  });

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};