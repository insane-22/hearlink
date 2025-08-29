const userState = {};

export function getUserState(userId) {
  if (!userState[userId]) userState[userId] = { step: "init" };
  return userState[userId];
}

export function resetUserState(userId) {
  userState[userId] = { step: "init" };
}
