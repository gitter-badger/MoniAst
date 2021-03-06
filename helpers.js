const Rx = require('rx');
const User = require('./models/user');

const ROLE_CLIENT = require('./constants').ROLE_CLIENT;
const ROLE_ADMIN = require('./constants').ROLE_ADMIN;

exports.isAdminExists = function isAdminExists() {
  User.find({}, (err, users) => {
    if (err) {
      return console.log('Error with DB!');
    }

    if (users.length === 0) {
      createDefaultAdmin();
    }
  });
};

function createDefaultAdmin() {
  const username = 'admin';
  const firstName = 'default';
  const lastName = 'admin';
  const password = 'admin';
  const role = ROLE_ADMIN;
  const sip = '0';

  const user = new User({
    username,
    password,
    role,
    profile: { firstName, lastName },
    sip
  });

  user.save((err, user) => {
    if (err) {
      console.log('error with creating default user:', err);
    }

    console.log('Created default user: admin/admin');
  });

}

exports.getList = function getList(ami, action, lastEvent, callback) {
  let stream = new Rx.Subject();

  ami.action(
    {
      action
    },
    function(err, res) {
      if (err) {
        return callback(err, null);
      }

      const f = function(evt) {
        if (evt.actionid === res.actionid) {
          if (evt.event === lastEvent) {
            stream.onCompleted();
          } else {
            stream.onNext(evt);
          }
        }
      };

      ami.on('managerevent', f);

      let stream2 = stream.toArray();

      stream2.subscribe(
        function(x) {
          callback(null, x);
        },
        function(e) {
          callback(e, null);
        },
        function() {
          ami.removeListener('managerevent', f);
        }
      );
    }
  );
};

exports.convertDurationToSeconds = function convertDurationToSeconds(str) {
  const hash = {
    0: 3600,
    1: 60,
    2: 1
  };

  return str.split(':').reduce((sum, item, i) => {
    return +sum + +item * hash[i];
  }, 0);
};

// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    username: request.username,
    role: request.role,
    sip: request.sip || 0
  };

  return getUserInfo;
};

exports.getRole = function getRole(checkRole) {
  let role;

  switch (checkRole) {
    case ROLE_ADMIN: role = ROLE_ADMIN; break;
    case ROLE_CLIENT: role = ROLE_CLIENT; break;
    default: role = ROLE_CLIENT;
  }

  return role;
};

/**
 * Normalize a port into a number, string, or false.
 */

exports.normalizePort = function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};


