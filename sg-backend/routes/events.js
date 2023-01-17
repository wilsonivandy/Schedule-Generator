"use strict";

/** Routes for input events. */

const jsonschema = require("jsonschema");
const express = require("express");
const router = new express.Router();

const { BadRequestError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");

const eventNewSchema = require("../schemas/eventNew.json");
const eventUpdateSchema = require("../schemas/eventUpdate.json");
const Event = require("../models/event");

/**
 * @route POST /api/events/:username
 * @desc Create a new event for the specified user.
 * @access Private (only for the specified user)
 * @param {string} username - The username of the user
 * @param {Object} req.body - The event details
 * @param {string} req.body.name - The name of the event
 * @param {string} req.body.description - The description of the event
 * @param {Date} req.body.startTime - The start time of the event
 * @param {Date} req.body.endTime - The end time of the event
 * @param {string} req.body.location - The location of the event
 * @param {number} req.body.priority - The priority of the event (1-5)
 * @returns {Object} 201 - The created event
 * @returns {Error} 400 - Invalid request body
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 */

router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, eventNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const event = await Event.create(req.body);
    return res.status(201).json({ event });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/events/[id]  =>  { events }
 *
 *  Event is { username, event_name, event_start_time, event_duration, event_location, priority }
 * 
 * Authorization required: ensureCorrectUser
 */
router.get("/:username/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const event = await Event.getEvent(req.params.id);
    return res.json({ event });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/events  =>
 *   { events: [ { username, event_name, event_start_time, event_duration, event_location, priority }, ...] }
 *
 * Authorization required: ensureCorrectUser
 */

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const events = await Event.timeSortedEvents(req.params.username);
    if (events.length === 0) {
      return res.json({ error: "No events made so far!"})
    }
    return res.json({ events });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username]/events/[id] { fld1, fld2, ... } => { event }
 *
 * Patches event data.
 *
 * fields can be: { event_name, event_start_time, event_duration, event_location, priority }
 *
 * Returns { username, event_name, event_start_time, event_duration, event_location, priority }
 *
 * Authorization required: ensureCorrectUser
 */

router.patch("/:username/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, eventUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const event = await Event.update(req.params.id, req.body);
    return res.json({ event });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[username]/events/[id]  =>  { deleted: id }
 *
 * Authorization: ensureCorrectUser
 */

router.delete("/:username/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await Event.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
