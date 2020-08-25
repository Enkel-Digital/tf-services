/*

the notifier service

will have a webhook to trigger this service to start running. The webhook user will be the scheduler service
when this service starts up, this will see the request ID from the scheduler service.
read the request from the request DB
get all users' chatIDs from the userDB
send out the notifications to every specified user based on the request spec (a json perhaps to specify how and who to send notifications)

*/

require("dotenv").config();

const { PollingBot, shortHands } = require("../src/index");
const bot = new PollingBot(process.env.BOT_TOKEN);
const tapi = bot.tapi;

// @todo Dont repeat this...
// Set the list of commands first on startup
shortHands.setCommands(tapi, [
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show the help menu" },
  { command: "settings", description: "Edit settings of bot" },
  { command: "unsub", description: "Unsubscribe from all notifications" },
]);

bot.addShortHand(shortHands.replyMessage);
bot.addShortHand(shortHands.getCommand);

// Simple mock DB
const DB = {
  chatIDs: [],
};

// SQL way of finding chatIDs for a specific request
// DB("users")
//   .join("userTags", "users.id", "=", "userTags.userID")
//   .where({ appID })
//   .where(() => {
//     where({ tag1 })
//       .orWhere({ tag2 })
//       .orWhere({ tag2 })
//       .orWhere({ tag2 })
//       .orWhere({ tag2 });
//   })
//   .select("chatIDs");

/**
 * Handler for start commands, where users register their
 */
bot.addHandler(async function (update) {
  const startCommands = this.getCommand("start");
  // Skip this handler if there is no start command
  if (!startCommands) return;

  // If the arguement for the first start command is null (empty) and no need to await too.
  if (!startCommands[0]) return this.replyMessage("Invalid register UUID");

  // register the user
  // @todo Handle re-registrations, should not have double registration
  console.log(startCommands[0][0]);
  DB.chatIDs.push(update.message.chat.id);
  return this.replyMessage("Successfully registered for notifications!");
});

/**
 * Handler for unsub commands, where users request to unsubscribe for notifications
 */
bot.addHandler(async function (update) {
  const unsubCommands = this.getCommand("unsub");
  // Skip this handler if there is no unsub command
  if (!unsubCommands) return;

  // Remove the user
  const index = DB.chatIDs.indexOf(update.message.chat.id);
  if (index > -1) {
    DB.chatIDs.splice(index, 1);
    this.replyMessage("Successfully unsubscribed from notifications!");
  } else this.replyMessage("User was not registered previously");
});

// Demo "notif" sending, once every 10 seconds send notif to all registered users
setInterval(function () {
  console.log("Sending new notif!");

  DB.chatIDs.forEach((chatID) =>
    tapi("sendMessage", {
      chat_id: chatID,
      text: "Notif!",
    })
  );
}, 10000);

app.post("/:BOT_TOKEN", function (req, res) {
  bot._onUpdate(update);
  // since this one cannot respond right, what about
  webhookBot.apiCall();
});

bot.startPolling(0);
