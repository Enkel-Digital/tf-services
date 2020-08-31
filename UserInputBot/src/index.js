require("dotenv").config();

const SQLdb = require("@enkeldigital/ce-sql");

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

/**
 * Handler for start commands, where users register their
 */
bot.onCommand("start", async function (parsedCommand, update) {
  try {
    const deepLinkingArgs = parsedCommand[0];

    // If the arguement for the first start command is null (empty) and no need to await too.
    if (!deepLinkingArgs)
      return this.replyMessage("Invalid registration link!");

    // register the user
    // @todo Handle re-registrations, should not have double registration
    console.log("User registration token:", deepLinkingArgs[0]);
    console.log("User's chat ID:", update.message.chat.id);

    // @todo Parse and verify token before using its data
    const token = deepLinkingArgs[0];

    const pendingUser = await SQLdb("pending_users")
      .where({ token })
      .select("botID", "app_UUID");

    // Ensure that there is a valid pending user
    if (!pendingUser)
      throw new Error("Invalid token! Contact app developer for help"); // @todo Might allow devs to customize error message

    // Insert the preset values of pending user along with the telegram chat ID
    await SQLdb("users").insert({
      botID: pendingUser.botID,
      app_UUID: pendingUser.app_UUID,
      t_chat_id: update.message.chat.id,
    });

    // Delete the pending user row once the user has completed onboarding and data is inserted into "users" table
    await SQLdb("pending_users").where({ token }).del();

    this.replyMessage("Successfully registered for notifications!");
  } catch (error) {
    // @todo log the error
    console.error("Registration failed with: ", error.message);
    return this.replyMessage("Registration failed!");
  }
});

/**
 * Handler for unsub commands, where users request to unsubscribe for notifications
 */
bot.onCommand("unsub", async function (_, update) {
  try {
    // using chat id instead of from id, allow grp notifs, so like unsub from grp instead of just a user
    console.log("unsub:", update.message.from.id);
    console.log("unsub:", update.message.chat.id);

    // Remove the user
    // @todo Actually when the user is unsubbing, we need to somehow figure out which bot they unsub from too, not unsub from all bots...
    await SQLdb("users")
      .where({
        // @todo To get this value from token too instead of hardcoding it
        botID: 1,
        t_chat_id: update.message.chat.id,
      })
      .del();

    this.replyMessage("Successfully unsubscribed from notifications!");

    // Handle if user is not subbed, we should be able to tell and let them know that they were not subbed in the first place
    // this.replyMessage("User was not registered previously");
  } catch (error) {
    // @todo log the error
    console.error("Registration failed with: ", error.message);
    return this.replyMessage("Registration failed!");
  }
});

// Demo "notif" sending, once every 10 seconds send notif to all registered users
setInterval(async function () {
  console.log("Sending new notif!");

  const users = await SQLdb("users").select();

  const chatIDs = users.map((user) => user.t_chat_id);

  chatIDs.forEach((chatID) =>
    tapi("sendMessage", {
      chat_id: chatID,
      text: "Notif!",
    })
  );
}, 10000);

bot.startPolling(0);
