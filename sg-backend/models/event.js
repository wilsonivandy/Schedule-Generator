"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Event {
   
  static async create(data) {
    try {
      const result = await db.query(
                `INSERT INTO events 
                  (username, event_name, event_start_time, event_duration, event_end_time, 
                    event_location, event_priority, event_isFlexible)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING 
                  id, username, event_name, event_start_time, event_duration, event_end_time, 
                  event_location, event_priority, event_isFlexible`,
              [data.username, data.event_name, data.event_start_time, data.event_duration, data.event_end_time,
                data.event_location, data.event_priority, data.event_isFlexible]);
      return result.rows[0];
    } catch (err) {
      throw new BadRequestError("Please Verify The Data")
    }
    
  }

     static async timeSortedEvents(username) {
      const result = await db.query(
        `SELECT 
            id, username, event_name, event_start_time, event_end_time, event_duration, 
           event_location, event_priority, event_isFlexible
         FROM events
         WHERE username=$1
         ORDER BY event_start_time`,
      [username]);
      return result.rows;
    }
  
        /** Find all events, sorted by time 
     *
     * Returns [{ username, event_name, event_start_time, event_duration, event_location, priority }, ...]
     *
     * */ 
  
  
     static async prioritySortedEvents(username) {
      const result = await db.query(
        `SELECT
              id, username, event_name, event_start_time, event_duration, 
              event_location, event_priority, event_isFlexible
         FROM events
         WHERE username=$1
         ORDER BY event_priority DESC`,
       [username]);
     return result.rows;
    }
  
    /** Find event, given input of username and event_name
     *
     * 
     * Returns { username, event_name, event_start_time, event_duration, event_location, priority }
     * */
  
    static async getEvent(id) {
      const result = await db.query(
        `SELECT
            id, username, event_name, event_start_time, event_duration, 
            event_location, event_priority, event_isFlexible
         FROM events
         WHERE id=$1`,
       [id]);
     return result.rows[0];
    }

   static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,{});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE events
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING 
                          username, event_name, event_start_time, event_duration, 
                          event_location, event_priority, event_isFlexible`;
    const result = await db.query(querySql, [...values, id]);
    const event = result.rows[0];

    if (!event) throw new NotFoundError(`No event found: ${id}`);

    return event;
  }


  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM events
           WHERE id = $1
           RETURNING id`,
        [id]);
    const event = result.rows[0];

    if (!event) throw new NotFoundError(`No event: ${id}`);
  }
}

module.exports = Event;
