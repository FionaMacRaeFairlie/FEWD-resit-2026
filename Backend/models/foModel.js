const nedb = require("gray-nedb");
class FamilyOrganiser {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new nedb({ filename: dbFilePath, autoload: true });
      console.log("DB connected to " + dbFilePath);
    } else {
      this.db = new nedb();
      console.log("Events DB connected to database");
    }
  }

  init() {
    this.db.count({}, (err, count) => {
      if (err || count > 0) {
        console.log("Events database already initialized or error occurred");
        return;
      }

      const defaultEvents = [
        {
          event: "Family Dinner",
          date: "2026-06-08",
          startTime: "18:00",
          endTime: "20:00",
          location: "Home",
          requiredItems: ["Ingredients"],
          organiser: "Emma",
          familyId: "Smith",
        },
        {
          event: "Gym",
          date: "2026-06-10",
          startTime: "10:00",
          endTime: "11:00",
          location: "Local Gym",
          requiredItems: ["Trainers", "Water Bottle"],
          organiser: "John",
          familyId: "Smith",
        },
        {
          event: "School Sports Day",
          date: "2026-06-12",
          startTime: "09:00",
          endTime: "13:00",
          location: "School Field",
          requiredItems: ["Sports kit", "Snacks"],
          organiser: "Sophie",
          familyId: "Smith",
        },
        {
          event: "Shopping Trip",
          date: "2026-06-15",
          startTime: "13:00",
          endTime: "16:00",
          location: "City Centre",
          requiredItems: ["Wallet"],
          organiser: "Emma",
          familyId: "Smith",
        },
        {
          event: "Dentist Appointment",
          date: "2026-06-18",
          startTime: "11:30",
          endTime: "12:30",
          location: "Dental Clinic",
          requiredItems: ["Health Card"],
          organiser: "John",
          familyId: "Smith",
        },
        {
          event: "Movie Night",
          date: "2026-06-20",
          startTime: "19:00",
          endTime: "21:30",
          location: "Living Room",
          requiredItems: ["Snacks"],
          organiser: "Sophie",
          familyId: "Smith",
        },
        {
          event: "Park Picnic",
          date: "2026-06-22",
          startTime: "12:00",
          endTime: "15:00",
          location: "Local Park",
          requiredItems: ["Picnic Blanket", "Food"],
          organiser: "Emma",
          familyId: "Smith",
        },
        {
          event: "Football Practice",
          date: "2026-06-25",
          startTime: "17:00",
          endTime: "18:30",
          location: "Sports Centre",
          requiredItems: ["Kit", "Boots"],
          organiser: "Tom",
          familyId: "Smith",
        },
        {
          event: "Laundry",
          date: "2026-06-27",
          startTime: "10:00",
          endTime: "11:00",
          location: "Home",
          requiredItems: ["Laundry Detergent"],
          organiser: "Emma",
          familyId: "Smith",
        },
        {
          event: "Family BBQ",
          date: "2026-06-30",
          startTime: "16:00",
          endTime: "20:00",
          location: "Back Garden",
          requiredItems: ["Food", "Drinks"],
          organiser: "John",
          familyId: "Smith",
        },
      ];

      this.db.insert(defaultEvents);

      console.log(
        "Events database initialized with June 2026 Smith family events"
      );
    });
  }

  addEvent(
    event,
    date = null,
    startTime,
    endTime,
    location,
    requiredItems,
    username,
    familyId
  ) {
    let newEvent = {
      event: event,
      date: date || new Date().toISOString().split("T")[0],
      startTime: startTime,
      endTime: endTime,
      location: location,
      requiredItems: requiredItems,
      organiser: username,
      familyId: familyId,
    };
    console.log("Event created", newEvent);

    this.db.insert(newEvent, (err, doc) => {
      if (err) {
        console.log("Error inserting document", event);
      } else {
        console.log("document inserted into the database", doc);
      }
    });
  }

  getAllEvents() {
    // return a Promise object, which can be resolved or rejeted
    return new Promise((resolve, reject) => {
      // use the find() function of the database to get the data,
      // error first callback function, err for error, entries for event data
      this.db.find({}, (err, events) => {
        // if errors occur reject promise
        if (err) {
          reject(err);
        } else {
          resolve(events);
        }
      });
    });
  }

  getUpcomingEvents() {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split("T")[0];
      this.db.find({ date: { $gte: today } }, (err, events) => {
        if (err) {
          reject(err);
        } else {
          // Sort by date and time
          events.sort((a, b) => {
            if (a.date === b.date) {
              return a.startTime.localeCompare(b.startTime);
            }
            return a.date.localeCompare(b.date);
          });
          resolve(events);
          console.log("getUpcomingEvents() returns: ", events);
        }
      });
    });
  }

  getEventsByUser(organiser) {
    return new Promise((resolve, reject) => {
      this.db.find({ organiser: organiser }, (err, events) => {
        if (err) {
          reject(err);
        } else {
          resolve(events);
          console.log(`getEventsByUser(${organiser}) returns: `, events);
        }
      });
    });
  }

  deleteEvent(eventId) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: eventId }, {}, (err, numRemoved) => {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
          console.log(
            `Event ${eventId} deleted, ${numRemoved} documents removed`
          );
        }
      });
    });
  }

  updateEvent(eventId, updateData) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: eventId },
        { $set: updateData },
        {},
        (err, numReplaced) => {
          if (err) {
            reject(err);
          } else {
            resolve(numReplaced);
            console.log(
              `Event ${eventId} updated, ${numReplaced} documents modified`
            );
          }
        }
      );
    });
  }

  getEventById(eventId) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: eventId }, (err, event) => {
        if (err) {
          reject(err);
        } else {
          resolve(event);
          console.log(`getEventById(${eventId}) returns: `, event);
        }
      });
    });
  }
}
module.exports = FamilyOrganiser;
