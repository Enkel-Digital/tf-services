/**
 * Express Router for user related routes like creating a new user and updating their details/tags
 * Mounted on /user
 * @author JJ
 * @module User routes
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:user");

/**
 * Get details of a specific user and bot
 * @todo Auth protect this API
 * @name GET /user/:botID/:app_UUID
 * @param {Number} botID which bot does this user below to
 * @param {String} app_UUID which bot does this user below to
 * @returns {object}
 */
router.get("/:botID/:app_UUID", async (req, res) => {
  try {
    const { botID, app_UUID: userID } = req.params;

    const user = await SQLdb("users").where({ botID, app_UUID: userID });
    if (!user) throw new Error("User does not exist");

    // Insert tags directly onto the user object
    user.tags = await SQLdb("userTags").where({ userID: user.id });

    res.status(200).json({ ok: true, user });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;
