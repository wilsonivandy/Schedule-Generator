"use strict";

const db = require("../db");

/** Related functions for companies. */

class Schedule_Group {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   **/

  static async createGroup(username, chosen_id) {
    const result = await db.query(
        `INSERT INTO groups
              (username, chosen_id)
         VALUES ($1, $2)
         RETURNING 
              id, username, chosen_id`,
        [username, chosen_id]);
      return result.rows[0];
  }

  static async getGroups(username) {
    const result = await db.query(
        `SELECT 
        id, username, chosen_id
        FROM groups
        WHERE username=$1
        ORDER BY id`,
        [username]);
    return result.rows;
  }
   
  static async addSchedule(data) {
    const result = await db.query(
      `INSERT INTO schedule_groups
            (group_id, schedule_id, username, schedule_name, schedule_date, schedule_start_time, schedule_end_time, total_distance, total_duration)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING 
            group_id, schedule_id, username, schedule_name, schedule_date, schedule_start_time, schedule_end_time, total_distance, total_duration`,
            [data.group_id, data.schedule_id, data.username, data.schedule_name, data.schedule_date, data.schedule_start_time, data.schedule_end_time, data.total_distance, data.total_duration]);

    return result.rows[0];
  }

  static async getGroupsByUsername(username) {
    const result = await db.query(
        `SELECT 
            group_id, schedule_id, username, schedule_name, schedule_date, schedule_start_time, schedule_end_time, total_distance, total_duration
        FROM schedule_groups
        WHERE username=$1
        ORDER BY group_id`,
        [username]);
    return result.rows;
  }

  static async getByGroupId(id) {
    const result = await db.query(
        `SELECT 
            group_id, schedule_id, username, schedule_name, schedule_date, schedule_start_time, schedule_end_time, total_distance, total_duration
        FROM schedule_groups
        WHERE group_id=$1`,
    [id]);
    return result.rows;
  }

  static async getByGroupDate(date) {
    const result = await db.query(
        `SELECT 
            group_id, schedule_id, username, schedule_name, schedule_date, schedule_start_time, schedule_end_time, total_distance, total_duration
        FROM schedule_groups
        WHERE schedule_date=$1`,
    [date]);
    return result.rows;
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
}

module.exports = Schedule_Group;