"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const Schedule = require("../models/schedule");
const scheduleNewSchema = require("../schemas/scheduleNew.json");
const scheduleUpdateSchema = require("../schemas/scheduleUpdate.json");
const createSchedules = require("../helpers/createSchedule");
const Schedule_Group = require("../models/schedule_group");

const router = express.Router({ mergeParams: true });


/** POST / { job } => { job }
 *
 * job should be { title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */

router.post("/:username/generating", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, scheduleNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const schedules = await createSchedules(req.body.username, req.body.schedule_name, req.body.schedule_date, req.body.schedule_start_time, req.body.schedule_end_time);
    return res.status(201).json({ schedules });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { jobs: [ { id, title, salary, equity, companyHandle, companyName }, ...] }
 *
 * Can provide search filter in query:
 * - minSalary
 * - hasEquity (true returns only jobs with equity > 0, other values ignored)
 * - title (will find case-insensitive, partial matches)

 * Authorization required: none
 */

// get all schedules by this user

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const schedules = await Schedule_Group.getGroupsByUsername(req.params.username);
    return res.json({ schedules });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username/group", ensureCorrectUser, async function (req, res, next) {
  try {
    const groups = await Schedule_Group.getGroups(req.params.username);
    return res.json({ groups });
  } catch (err) {
    return next(err);
  }
});

router.post("/:username/group", ensureCorrectUser, async function (req, res, next) {
  try {
    const schedules = await Schedule_Group.create(req.body);
    return res.json({ schedules });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username/group/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const schedules = await Schedule_Group.getByGroupId(req.params.id);
    return res.json({ schedules });
  } catch (err) {
    return next(err);
  }
});

/** GET /[jobId] => { job }
 *
 * Returns { id, title, salary, equity, company }
 *   where company is { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: none
 */

router.get("/:username/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const schedules = await Schedule.getSchedule(req.params.id);
    return res.json({ schedules });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[jobId]  { fld1, fld2, ... } => { job }
 *
 * Data can include: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */

router.patch("/:username/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, scheduleUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Schedule.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:username/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await Schedule.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
