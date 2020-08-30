require("dotenv").config();

const { PollingBot, shortHands } = require("yatbl");
const bot = new PollingBot(process.env.BOT_TOKEN);
const tapi = bot.tapi;

// @todo Dont repeat this... this should be ran for each bot, ON their bot token registration event.
// Set the list of commands first on startup
shortHands.setCommands(tapi, [
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show the help menu" },
  { command: "settings", description: "Edit settings of bot" },
  { command: "unsub", description: "Unsubscribe from all notifications" },
]);

bot.addShortHand(shortHands.replyMessage);

// Simple mock DB
const DB = {
  chatIDs: [],
};

/**
 * Handler for start commands, where users register their
 */
bot.onCommand("start", function (parsedCommand) {
  // If the arguement for the first start command is null (empty) and no need to await too.
  if (!parsedCommand[0]) return this.replyMessage("Invalid registration UUID");

  // register the user
  // @todo Handle re-registrations, should not have double registration
  console.log("User registration token:", parsedCommand[0][0]);
  DB.chatIDs.push(update.message.chat.id);
  return this.replyMessage("Successfully registered for notifications!");
});

/**
 * Handler for unsub commands, where users request to unsubscribe for notifications
 */
bot.onCommand("unsub", function (parsedCommand, update) {
  // using chat id instead of from id, allow grp notifs, so like unsub from grp instead of just a user
  console.log("unsub:", update.message.from.id);
  console.log("unsub:", update.message.chat.id);

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

bot.startPolling(0);
