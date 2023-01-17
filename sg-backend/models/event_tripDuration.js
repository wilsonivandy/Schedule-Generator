"use strict";

const db = require("../db");

/** Related functions for companies. */

class Event_TripDuration {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   **/
   
  static async create(data) {
    const result = await db.query(
          `INSERT INTO event_tripDurations 
            (event_id1, event_id2, trip_duration, trip_distance)
           VALUES ($1, $2, $3, $4)
           RETURNING 
           event_id1, event_id2, trip_duration, trip_distance`,
        [data.event_id1, data.event_id2, data.trip_duration, data.trip_distance]);
    return result.rows[0];;
  }

  /** Find all jobs (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - minSalary
   * - hasEquity (true returns only jobs with equity > 0, other values ignored)
   * - title (will find case-insensitive, partial matches)
   *
   * Returns [{ id, title, salary, equity, companyHandle, companyName }, ...]
   * */

    /** Find all events, sorted by time 
   *
   * Returns [{ username, event_name, event_start_time, event_duration, event_location, priority }, ...]
   *
   * */ 


     static async getTripDuration(event_id1, event_id2) {
      const result = await db.query(
        `SELECT trip_duration
         FROM event_tripDurations
         WHERE (event_id1=$1 AND event_id2=$2) OR (event_id1=$2 AND event_id2=$1)`,
      [event_id1, event_id2]);

      if (result.rows[0]) {
        return result.rows[0].trip_duration;
      } else {
        return null;
      }
    }

    static async getTripDistance(event_id1, event_id2) {
      const result = await db.query(
        `SELECT trip_distance
         FROM event_tripDurations
         WHERE (event_id1=$1 AND event_id2=$2) OR (event_id1=$2 AND event_id2=$1)`,
      [event_id1, event_id2]);

      if (result.rows[0]) {
        return result.rows[0].trip_distance;
      } else {
        return null;
      }
    }
}

module.exports = Event_TripDuration;
