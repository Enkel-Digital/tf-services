/**
 * Base seed file to populate the DB with.
 * @author JJ
 */

exports.seed = async function (knex) {
  const yesno = require("yesno");
  if (
    !(await yesno({
      question:
        "Are you sure you want to continue and seed DB with random test data?",
    }))
  )
    return;

  /**
   * Inserts seed entries
   * Unlike most tutorials, table contents are not deleted first before seeding.
   * Since the DB is usually teared down first and a new DB is created before seeding it.
   * And also because of some Foreign Key constraints if there are any existing data.
   */

  await knex("organisations").insert({
    name: "TEST ORG",
    email: "teletif@enkeldigital.com",
    verified_email: true,
    verified_phone: true,
    verified: true,
  });

  await knex("developerAccounts").insert({
    organisationID: 1,
    admin: true,
    email: "teletif@enkeldigital.com",
    name: "Tester",
  });

  await knex("bots").insert({
    createdBy: 1,
    token: process.env.BOT_TOKEN,
    organisationID: 1,
    name: "teletif test bot",
    description: "Bot for testing teletif services",
  });

  await knex("users").insert([
    {
      botID: 1,
      app_UUID: "tester_account",
      t_chat_id: undefined,
    },
  ]);

  await knex("userTags").insert([
    {
      userID: 1,
      tag: "timezone/sgt",
    },
    {
      userID: 1,
      tag: "new",
    },
  ]);
};
