"use strict";

const { SchemaError } = require("jsonschema");
const db = require("../db");
const { NotFoundError, BadRequestError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const Event = require("./event");


/** Related functions for companies. */

class Schedule {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   **/
   
  static async create(username, schedule_date, schedule_start_time, schedule_end_time) {
      const numEvents = await Event.timeSortedEvents(username);
      if (numEvents.length < 2) {
        throw new BadRequestError("Must create at least two events")
      } 
      const result = await db.query(
              `INSERT INTO schedules
                (username, schedule_date, schedule_start_time, schedule_end_time)
              VALUES ($1, $2, $3, $4)
              RETURNING 
              id, username, schedule_date, schedule_start_time, schedule_end_time`,
            [username, schedule_date, schedule_start_time, schedule_end_time]);
      
      let schedule = result.rows[0];
      schedule.events = [];
      return schedule;
    }
  
  
        /** Find all events, sorted by time 
     *
     * Returns [{ username, event_name, event_start_time, event_duration, event_location, priority }, ...]
     *
     * */ 
  
  
     static async getAllUsername(username) {
        const result = await db.query(
            `SELECT 
                id, username, schedule_date, schedule_start_time, schedule_end_time
             FROM schedules
             WHERE username=$1`,
          [username]);
        return result.rows;
    }
  
    /** Find event, given input of username and event_name
     *
     * 
     * Returns { username, event_name, event_start_time, event_duration, event_location, priority }
     * */
  
    static async getSchedule(id) {
        const result = await db.query(
            `SELECT 
                id, username, schedule_date, schedule_start_time, schedule_end_time
             FROM schedules
             WHERE id=$1`,
          [id]);

          const eventsRes = await db.query(
            `SELECT
                e.id,
                e.event_name, 
                se.event_start_time, 
                e.event_duration, 
                se.event_end_time, 
                e.event_location, 
                e.event_isFlexible, 
                e.event_priority, 
                se.event_order 
            FROM schedule_events se 
              LEFT JOIN events e 
                ON se.event_id = e.id 
              LEFT JOIN schedules s 
                ON se.schedule_id = s.id
            WHERE s.id=$1
            ORDER BY se.event_order`,
          [id],
      );
        let schedule = result.rows[0];
        schedule.events = eventsRes.rows;

        return schedule;
    }

    static async getEvents(id) {
      const result = await db.query(
        `SELECT 
            schedule_id, event_id, event_order, event_start_time, event_end_time
         FROM schedule_events
         WHERE schedule_id=$1`,
      [id]);
      return result.rows;
    }

    static async addEvent(schedule_id, event_id, event_order, event_start_time, event_end_time) {
      const result = await db.query(
        `INSERT INTO schedule_events
          (schedule_id, event_id, event_order, event_start_time, event_end_time)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING 
          schedule_id, event_id, event_order, event_start_time, event_end_time`,
        [schedule_id, event_id, event_order, event_start_time, event_end_time]);
      
      const event = result.rows[0];
      if (!event) throw new NotFoundError(`No event: ${event_id} in schedule ${schedule_id}`);

      return event;
    }

    static async removeEvent(schedule_id, event_id) {
      const result = await db.query(
            `DELETE
             FROM schedule_events
             WHERE schedule_id = $1 AND event_id = $2
             RETURNING schedule_id, event_id, event_order, event_start_time, event_end_time`,
          [schedule_id, event_id]);
      const event = result.rows[0];
  
      if (!event) throw new NotFoundError(`No event: ${event_id} in schedule ${schedule_id}`);

      return event;
    }

   static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,{});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE schedules
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING 
                      id, username, schedule_date, schedule_start_time, schedule_end_time`;
    const result = await db.query(querySql, [...values, id]);
    const schedule = result.rows[0];

    if (!schedule) throw new NotFoundError(`No schedule found: ${id}`);

    return schedule;
  }

  /** Delete given schedule from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM schedules
           WHERE id = $1
           RETURNING id`,
        [id]);
    const schedule = result.rows[0];

    if (!schedule) throw new NotFoundError(`No schedule: ${id}`);
  }
}

module.exports = Schedule;
