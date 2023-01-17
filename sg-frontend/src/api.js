import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ScheduleGeneratorApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ScheduleGeneratorApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  static async createEvent(username, data) {
    let res = await this.request(`events/${username}`, data, "post");
    return res.event;
  }

  /** Get details on a company by handle. */

  static async getEvents(username) {
    let res = await this.request(`events/${username}`);
    return res.events;
  }

   /** Get details on a company by handle. */
  static async getEvent(username, id) {
    let res = await this.request(`events/${username}/${id}`);
    return res.event;
  }

  static async removeEvent(username, id) {
    await this.request(`events/${username}/${id}`, {}, "delete");
  }

  static async editEvent(username, id, data) {
    await this.request(`events/${username}/${id}`, data, "patch");
  }

  static async generateSchedule(username, data) {
    let res = await this.request(`schedules/${username}/generating`, data, "post");
    return res.schedules;
  }

  static async getGroups(username) {
    let res = await this.request(`schedules/${username}/group`);
    return res.groups;
  }

  static async getSchedulesByGroupId(username, groupId) {
    let res = await this.request(`schedules/${username}/group/${groupId}`);
    return res.schedules;
  }

  static async getSchedules(username) {
    let res = await this.request(`schedules/${username}`);
    return res.schedules;
  }

  static async getSchedule(username, id) {
    let res = await this.request(`schedules/${username}/${id}`);
    return res;
  }

  static async removeSchedule(username, id) {
    let res = await this.request(`schedules/${username}/${id}`, {}, "delete");
    return res;
  }

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token
  }

  static async signUp(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token
  }

  static async saveProfile(username, data) {
    await this.request(`users/${username}`, data, "patch");
  }

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }
}

export default ScheduleGeneratorApi