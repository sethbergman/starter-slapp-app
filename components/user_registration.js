var debug = require('debug')('botkit:user_registration');

module.exports = function(controller) {

    /* Handle event caused by a user logging in with oauth */
    controller.on('oauth:success', function(payload) {

        debug('Got a successful login!', payload);
        if (!payload.identity.team_id) {
            debug('Error: received an oauth response without a team id', payload);
        }
        controller.storage.teams.get(payload.identity.team_id, function(err, team) {
            if (err) {
                debug('Error: could not load team from storage system:', payload.identity.team_id, err);
            }

            var new_team = false;
            if (!team) {
                team = {
                    id: payload.identity.team_id,
                    createdBy: payload.identity.user_id,
                    url: payload.identity.url,
                    name: payload.identity.team,
                };
                var new_team= true;
            }

            team.bot = {
                token: payload.bot.bot_access_token,
                user_id: payload.bot.bot_user_id,
                createdBy: payload.identity.user_id,
                app_token: payload.access_token,
            };

            var octobot = controller.spawn(team.bot);

            testbot.api.auth.test({}, function(err, bot_auth) {
                if (err) {
                    debug('Error: could not authenticate bot user', err);
                } else {
                    team.bot.name = bot_auth.user;

                    // add in info that is expected by Botkit
                    testbot.identity = bot_auth;
                    testbot.team_info = team;

                    // Replace this with your own database!


                    var Store = require('jfs');

            module.exports = function(config) {

                if (!config) {
                    config = {
                        path: './',
                    };
                }

                var teams_db = new Store(config.path + '/teams', {saveId: 'id'});
                var users_db = new Store(config.path + '/users', {saveId: 'id'});
                var channels_db = new Store(config.path + '/channels', {saveId: 'id'});

                var objectsToList = function(cb) {
                    return function(err, data) {
                        if (err) {
                            cb(err, data);
                        } else {
                            cb(err, Object.keys(data).map(function(key) {
                                return data[key];
                            }));
                        }
                    };
                };

                var storage = {
                    teams: {
                        get: function(team_id, cb) {
                            teams_db.get(team_id, cb);
                        },
                        save: function(team_data, cb) {
                            teams_db.save(team_data.id, team_data, cb);
                        },
                        delete: function(team_id, cb) {
                            teams_db.delete(team_id.id, cb);
                        },
                        all: function(cb) {
                            teams_db.all(objectsToList(cb));
                        }
                    },
                    users: {
                        get: function(user_id, cb) {
                            users_db.get(user_id, cb);
                        },
                        save: function(user, cb) {
                            users_db.save(user.id, user, cb);
                        },
                        delete: function(user_id, cb) {
                            users_db.delete(user_id.id, cb);
                        },
                        all: function(cb) {
                            users_db.all(objectsToList(cb));
                        }
                    },
                    channels: {
                        get: function(channel_id, cb) {
                            channels_db.get(channel_id, cb);
                        },
                        save: function(channel, cb) {
                            channels_db.save(channel.id, channel, cb);
                        },
                        delete: function(channel_id, cb) {
                            channels_db.delete(channel_id.id, cb);
                        },
                        all: function(cb) {
                            channels_db.all(objectsToList(cb));
                        }
                    }
                };

                return storage;
            };



                    controller.storage.teams.save(team, function(err, id) {
                        if (err) {
                            debug('Error: could not save team record:', err);
                        } else {
                            if (new_team) {
                                controller.trigger('create_team', [octobot, team]);
                            } else {
                                controller.trigger('update_team', [octobot, team]);
                            }
                        }
                    });
                }
            });
        });
    });


    controller.on('create_team', function(bot, team) {

        debug('Team created:', team);

        // Trigger an event that will establish an RTM connection for this bot
        controller.trigger('rtm:start', [bot.config]);

        // Trigger an event that will cause this team to receive onboarding messages
        controller.trigger('onboard', [bot, team]);

    });


    controller.on('update_team', function(bot, team) {

        debug('Team updated:', team);
        // Trigger an event that will establish an RTM connection for this bot
        controller.trigger('rtm:start', [bot]);

    });

}
