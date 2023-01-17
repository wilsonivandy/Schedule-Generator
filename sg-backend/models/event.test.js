
const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Event = require("./event.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create an event", function () {
    const newEvent = {
      username: "u1",
      event_name: "testEvent",
      event_start_time: new Date("2023-01-17T08:00:00.000Z"),
      event_duration: 120,
      event_end_time: new Date("2023-01-17T08:00:00.000Z"),
      event_location: "place_id:nadii8ley892qhxciajbc7i6b",
      event_priority: 3,
      event_isFlexible: false
    };
  
    test("valid event", async function () {
      let event = await Event.create(newEvent);
      expect(event).toEqual({
        username: "u1",
        event_name: "testEvent",
        event_start_time: new Date("2023-01-17T08:00:00.000Z"),
        event_duration: 120,
        event_end_time: new Date("2023-01-17T08:00:00.000Z"),
        event_location: "place_id:nadii8ley892qhxciajbc7i6b",
        event_priority: 3,
        event_isflexible: false
      });
  
      const result = await db.query(
            `SELECT 
                username, event_name, event_start_time, event_duration, event_end_time, 
                event_location, event_priority, event_isFlexible
             FROM events
             WHERE username = 'u1'`);
      expect(result.rows).toEqual([
        {
            username: "u1",
            event_name: "testEvent",
            event_start_time: new Date("2023-01-17T08:00:00.000Z"),
            event_duration: 120,
            event_end_time: new Date("2023-01-17T08:00:00.000Z"),
            event_location: "place_id:nadii8ley892qhxciajbc7i6b",
            event_priority: 3,
            event_isflexible: false
        },
      ]);
    });
  
    test("bad request event", async function () {
      try {
        await Event.create({
            username: "u1",
            event_start_time: new Date("2023-01-17T08:00:00.000Z"),
            event_duration: 120,
            event_end_time: new Date("2023-01-17T08:00:00.000Z"),
            event_location: "place_id:nadii8ley892qhxciajbc7i6b",
            event_priority: 3,
            event_isFlexible: false
          });
        // fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });
  