//
// Slack slash commands, edit from here down
//


controller.on('slash_command', function (slashCommand, message) {

    switch (message.command) {
        case "/echo": //handle the `/echo` slash command. We might have others assigned to this app too!
            // The rules are simple: If there is no text following the command, treat it as though they had requested "help"
            // Otherwise just echo back to them what they sent us.

            // but first, let's make sure the token matches!
            if (message.token !== process.env.SLACK_VERIFY_TOKEN) {
                console.log('Bad token', message.token);
                return; //just ignore it.
            }

            // if no text was supplied, treat it as a help command
            if (message.text === "" || message.text === "help") {
                slashCommand.replyPrivate(message,
                    "I echo back what you tell me. " +
                    "Try typing `/echo hello` to see.");
                return;
            }

            // If we made it here, just echo what the user typed back at them
            //TODO You do it!
            slashCommand.replyPrivate(message, "1", function() {
                slashCommand.replyPrivate(message, "2").then(slashCommand.replyPrivate(message, "3"));
            });

            break;

        /* Meetup Events */
        case "/oc": //handle the `\oc` command. This will build out into events
            if (message.token !== process.env.SLACK_VERIFY_TOKEN) {
                console.log('Bad token', message.token);
                return;
            }
            // return all events from the Events airtable
            if (message.text == 'events'){
                let events = [];
                new Promise( ( resolve, reject ) => {
                    base('Events').select({
                        view: 'Main View'
                    }).firstPage(function(err, records) {
                        if (err) { console.error(err); reject( err ); }

                        records.forEach(function(record) {
                            if (record.get('Notes') === undefined){
                                console.log('Notes: undefined');
                            } else {
                                events.push(record.get('Name') + ': ' + record.get('Notes') + ', ' + record.get('Channel'));
                            }

                        });

                        resolve( events );
                    });
                }).then( events => slashCommand.replyPublic(message, '*OC Events:*\n' + events.join("\n\n")));
            }

            break;

        /* example: /mentees <language> */
        // TODO: handle casing to reduce burden on correct syntax
        // TODO: Create standard function to build queries
        case "/mentees":
            if (message.token !== process.env.SLACK_VERIFY_TOKEN) {
                console.log('Bad token', message.token);
                return;
            }
            // return all events from the Events airtable
            if (message.text){
                let mentees = [];
                let languageFilter = message.text;
                new Promise( ( resolve, reject ) => {
                    base('Mentees').select({
                        view: 'Main View',
                        filterByFormula: `SEARCH("${languageFilter}", {Language}) >= 0`
                    }).firstPage(function(err, records) {
                        if (err) { console.error(err); reject( err ); }

                        records.forEach(function(record) {
                            mentees.push('@' + record.get('Slack User'));

                        });

                        resolve( mentees );
                    });
                }).then( mentees => slashCommand.replyPublic(message, '*Mentees requesting ' +languageFilter+ ':*\n' + mentees.join("\n")));
            }

            break;


        /* example: /mentors <language> */
        case "/mentors":
            if (message.token !== process.env.SLACK_VERIFY_TOKEN) {
                console.log('Bad token', message.token);
                return;
            }
            // return all events from the Events airtable
            if (message.text){
                let mentors = [];
                let languageFilter = message.text;
                new Promise( ( resolve, reject ) => {
                    base('Mentors').select({
                        view: 'Main View',
                        // filterByFormula: `{Skillsets} = "${languageFilter}"`
                        filterByFormula: `SEARCH("${languageFilter}", {Skillsets}) >= 0`
                    }).firstPage(function(err, records) {
                        if (err) { console.error(err); reject( err ); }

                        records.forEach(function(record) {
                            mentors.push('@' + record.get('Slack Name'));

                        });

                        resolve( mentors );
                    });
                }).then( mentors => slashCommand.replyPublic(message, '*Mentors for ' +languageFilter+ ':*\n' + mentors.join("\n")));
            }

            break;

        default:
            slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + " yet.");

    }

});
