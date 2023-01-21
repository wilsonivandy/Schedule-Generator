
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

describe("Create an event", function () {
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
      expect(event.event_name).toEqual("testEvent");
      expect(event.event_duration).toEqual(120);
      
  
      const result = await db.query(
            `SELECT 
                username, event_name, event_start_time, event_duration, event_end_time, 
                event_location, event_priority, event_isFlexible
             FROM events
             WHERE username = 'u1'`);
      expect(result.rows[0].event_name).toEqual("testEvent");
      expect(result.rows[0].event_duration).toEqual(120);
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

describe("Get Events", function () {
    const event1 = {
      username: "u1",
      event_name: "testEvent1",
      event_start_time: new Date("2023-01-17T08:00:00.000Z"),
      event_duration: 30,
      event_end_time: new Date("2023-01-17T08:30:00.000Z"),
      event_location: "place_id:nadii8ley892qhxciajbc7i6b",
      event_priority: 3,
      event_isFlexible: false
    };

    const event2 = {
      username: "u1",
      event_name: "testEvent2",
      event_start_time: new Date("2023-01-17T09:00:00.000Z"),
      event_duration: 60,
      event_end_time: new Date("2023-01-17T10:00:00.000Z"),
      event_location: "place_id:nadii8ley892qhxciajbc7i6b",
      event_priority: 3,
      event_isFlexible: false
    }

    test("GetEvent", async function () {
      let event = await Event.create(event1);
      let getEvent = await Event.getEvent(event.id);

      expect(getEvent.event_name).toEqual("testEvent1");
      expect(getEvent.event_duration).toEqual(30);

    })

    test("timeSortedEvents", async function () {
      await Event.create(event1);
      await Event.create(event2);

      let firstEvent = new Date("2023-01-17T08:00:00.000Z");
      let secondEvent = new Date("2023-01-17T09:00:00.000Z");

      const events = await(Event.timeSortedEvents("u1"));
      expect(events.length).toBeGreaterThan(0);
      expect(events[0].event_start_time).toEqual(firstEvent);
      expect(events[1].event_start_time).toEqual(secondEvent);
    });
});

describe("Update Events", function () {
  const event1 = {
    username: "u1",
    event_name: "testEvent1",
    event_start_time: new Date("2023-01-17T08:00:00.000Z"),
    event_duration: 30,
    event_end_time: new Date("2023-01-17T08:30:00.000Z"),
    event_location: "place_id:nadii8ley892qhxciajbc7i6b",
    event_priority: 3,
    event_isFlexible: false
  };

  test("update event", async function () {
    let event = await Event.create(event1);
    expect(event.event_name).toEqual("testEvent1");
    let data = {
      event_name: "newEvent1"
    }
    let updatedEvent = await Event.update(event.id, data);

    expect(updatedEvent.event_name).toEqual("newEvent1");
  })
});

describe("Remove Events", function () {
  const event1 = {
    username: "u1",
    event_name: "testEvent1",
    event_start_time: new Date("2023-01-17T08:00:00.000Z"),
    event_duration: 30,
    event_end_time: new Date("2023-01-17T08:30:00.000Z"),
    event_location: "place_id:nadii8ley892qhxciajbc7i6b",
    event_priority: 3,
    event_isFlexible: false
  };

  const event2 = {
    username: "u1",
    event_name: "testEvent2",
    event_start_time: new Date("2023-01-17T09:00:00.000Z"),
    event_duration: 60,
    event_end_time: new Date("2023-01-17T10:00:00.000Z"),
    event_location: "place_id:nadii8ley892qhxciajbc7i6b",
    event_priority: 3,
    event_isFlexible: false
  }

  test("remove event", async function () {
    let newEvent1 = await Event.create(event1);
    let newEvent2 = await Event.create(event2);
    let events = await Event.timeSortedEvents("u1");
    expect(events.length).toEqual(2);
    expect(events[0].event_name).toEqual("testEvent1");

    await Event.remove(newEvent1.id);
    events = await Event.timeSortedEvents("u1");
    expect(events.length).toEqual(1);
    expect(events[0].event_name).toEqual("testEvent2");
  })
});