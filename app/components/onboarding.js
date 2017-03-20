var debug = require('debug')('botkit:onboarding');

module.exports = function(controller) {

    controller.on('onboard', function(bot) {

        debug('Octobot is spinning up an onboarding experience!');

        if (controller.config.studio_token) {
            bot.api.im.open({user: bot.config.createdBy}, function(err, direct_message) {
                if (err) {
                    debug('Error sending onboarding message:', err);
                } else {
                    controller.studio.run(bot, 'onboarding', bot.config.createdBy, direct_message.channel.id).catch(function(err) {
                        debug('Error: encountered an error loading onboarding script from Botkit Studio:', err);
                    });
                }
            });
        } else {
            bot.startPrivateConversation({user: bot.config.createdBy},function(err,convo) {
              if (err) {
                console.log(err);
              } else {"'I am an eight armed chatbot designed to help you and your team be more productive. Teach me the legend of your ways, oh code wizard. :octocat:'";
                convo.say();
                convo.say('Go ahead and /invite me to a channel so that I can be of use, and maybe even help you keep your team in good spirits!');

              }
            });
        }
    });

}
