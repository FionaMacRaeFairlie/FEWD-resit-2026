const familyorganiserDAO = require("../models/foModel.js");
const userDAO = require("../models/userModel.js");
const utils = require("../lib/utils.js");
// const bcrypt = require("bcrypt");
const db = new familyorganiserDAO("./data/events.db");
db.init();

exports.json_events_endpoint = (req, res) => {
  db.getAllEvents().then((list) => {
    res.json(list);
  });
};

exports.json_users_endpoint = (req, res) => {
  userDAO.getAllUsers().then((users) => {
    res.json(users);
  });
};

exports.process_new_user = (req, res, next) => {
  const user = req.body.username;
  const password = req.body.password;
  const family = req.body.familyId;
  const role = req.body.role;
  const saltHash = utils.genPassword(password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = {
    user: user,
    hash: hash,
    salt: salt,
    role: role,
    familyId: family || "family_1", // Default family if not provided
  };

  console.log(newUser);

  userDAO.create(newUser, function (err, user) {
    res.json({ success: true, user: user });
  });
};

exports.family_events_endpoint = (req, res) => {
  const familyId = req.user.familyId;
  db.getAllEvents().then((list) => {
    const familyEvents = list.filter((event) => event.familyId === familyId);
    res.json(familyEvents);
  });
};

exports.new_event_entry = (req, res) => {
  userDAO.getAllUsersInFamily(req.family).then((users) => {
    const participantList = users.map((user) => user.user);
    res.render("newEvent", {
      title: "Family Events",
      user: req.user,
      users: participantList,
    });
  });
};
exports.post_new_event = (req, res) => {
  if (false) {
    res
      .status(400)
      .json({ msg: "Events must be associated with an administrator." });
    return;
  }
  db.addEvent(
    req.body.title,
    req.body.date,
    req.body.startTime,
    req.body.endTime,
    req.body.location,
    req.body.requiredItems,
    req.body.username,
    req.body.userfamily
  );

  res.json({ success: true, msg: "event added" });
};

exports.handle_login = (req, res) => {
  console.log(req.body);
  const currentUser = req.body.username;
  const currentUserFamily = req.body.familyId;

  userDAO.lookup(currentUser, currentUserFamily, (err, user) => {
    if (err) {
      console.error("Lookup error:", err);
      return res.status(500).send("Internal server error");
    }

    if (!user) {
      console.log("No such user");
      return res.status(401).send("No User");
    }

    if (!utils.validPassword(req.body.password, user.hash, user.salt)) {
      console.log("Password mismatch");
      return res.status(401).send("Password Incorrect");
    }

    console.log("Login successful!");
    const tokenObject = utils.issueJWT(user);
    return res.status(200).json({
      success: true,
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      username: user.username,
      userrole: user.role,
      userfamily: user.familyId,
    });
  });
};

exports.show_edit_event = (req, res) => {
  const eventId = req.params.id;
  const currentUser = req.user;
  const currentUserFamily = req.family;
  let familyMembers = [];

  userDAO.getAllUsersInFamily(currentUserFamily).then((users) => {
    familyMembers = users.map((user) => user.user);
  });

  userDAO.lookup(currentUser, currentUserFamily, (err, user) => {
    if (err || !user) return res.status(403).send("Error");
    db.getEventById(eventId)
      .then((event) => {
        if (!event) {
          res.status(404).send("Event not found");
          return;
        }
        if (event.organiser !== currentUser) {
          return res.status(403).send("Forbidden");
        }
        res.json(event);
      })
      .catch((err) => {
        res.status(500).json({ success: false, error: err });
      });
  });
};

// Update event
exports.update_event = (req, res) => {
  const eventId = req.body._id;
  const currentUser = req.user;
  const updateData = {
    event: req.body.event,
    requiredItems: req.body.requiredItems,
    location: req.body.location,
    date: req.body.date,
    organiser: req.body.organiser,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    familyId: req.body.familyId,
  };
  db.updateEvent(eventId, updateData);
};

// Delete event
exports.delete_event = (req, res) => {
  const eventId = req.body._id;
  console.log(eventId);
  db.deleteEvent(eventId);
};

// User Management Functions
exports.show_user_management = (req, res) => {
  userDAO
    .getAllUsers()
    .then((users) => {
      familyUsers = users.filter((user) => user.familyId === req.family);
      res.render("userManagement", {
        title: "Manage Family Members",
        users: familyUsers,
        user: req.user,
      });
    })
    .catch((err) => {
      console.log("Error fetching users:", err);
      res.status(500).send("Error retrieving users");
    });
};

exports.add_new_family_member = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role || "member";
  family = req.family || "family_1"; // Default family if not provided

  if (!username || !password) {
    res.status(400).send("Username and password required");
    return;
  }

  userDAO.lookup(username, family, (err, existingUser) => {
    if (existingUser && existingUser.familyId === family) {
      res.status(400).send(`User ${username} already exists`);
      return;
    }

    userDAO.addUser(username, password, role, family);
    res.redirect("/manage-users");
  });
};

exports.delete_user = (req, res) => {
  const id = req.body._id;
  console.log(id);
  userDAO
    .deleteUser(id)
    .then((numDeleted) => {
      if (numDeleted === 0) {
        res.status(404).send("User not found");
        return;
      }
      res.redirect("/manage-users");
    })
    .catch((err) => {
      console.log("Error deleting user:", err);
      res.status(500).send("Error deleting user");
    });
};

// Show user details
exports.show_user_details = (req, res) => {
  const username = req.params.user;
  userDAO.lookup(username, req.family, (err, userDetails) => {
    if (err || !userDetails) {
      res.status(404).send("User not found");
      return;
    }
    res.render("editUser", {
      title: `User Details - ${username}`,
      user: userDetails,
    });
  });
};

exports.edit_user = (req, res) => {
  const userIdForEdit = req.params._id;

  const currentUser = req.user;
  userDAO.getUserById(userIdForEdit, (err, user) => {
    if (err || !currentUser) return res.status(403).send("Forbidden");
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.render("editUser", {
      title: "Edit User",
      user: user,
    });
  });
};

exports.update_user = (req, res) => {
  const userIdForEdit = req.body._id;
  const updateData = {
    user: req.body.username,
    role: req.body.role,
    _id: userIdForEdit,
  };

  userDAO
    .updateUser(userIdForEdit, updateData)
    .then((numUpdated) => {
      if (numUpdated === 0) {
        res.status(404).send("User not updated");
        return;
      }
      res.redirect("/manage-users");
    })
    .catch((err) => {
      console.log("Error updating user:", err);
      res.status(500).send("Error updating event");
    });
};
