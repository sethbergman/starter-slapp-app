module.exports = function(controller) {

    if (process.env.DASHBOT_API_KEY) {
      var dashbot = require('dashbot')(process.env.DASHBOT_API_KEY).slack;
      controller.middleware.receive.use(dashbot.receive);
      controller.middleware.send.use(dashbot.send);
      controller.log.info(EVENTS, INFO);
    } else {
      controller.log.info('No DASHBOT_API_KEY specified.');
    }

}
