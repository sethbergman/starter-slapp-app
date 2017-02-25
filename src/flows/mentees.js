const Airtable = require('airtable')

module.exports = (app) => {
  let slapp = app.slapp
  Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: process.env.AIRTABLE_API_KEY,
      base: process.env.AIRTABLE_BASE
  })

  slapp.command('/mentees', /.*/, (msg) => {
    var lines = msg.body.text.split(os.EOL).map((it) => { return it.trim() })

    base('Mentees').select({
        view: "Without Mentors",
        fields: "Assigned?"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            console.log('Retrieved', record.get('Slack User'))
        })

        fetchNextPage()

    if (message.text){
           let mentees = [];
           let assignedFilter = message.text;
           new Promise( ( resolve, reject ) => {
             base('Mentees').select({
               view: 'Without Mentors',
               filterByFormula: `SEARCH("${assignedFilter}", {Assigned?}) === false`
              }).firstPage(function(err, records) {
                 if (err) { console.error(err); reject( err ); }

                 records.forEach(function(record) {
                     mentees.push('@' + record.get('Slack User'))

                 })

                 resolve( mentees )
             })
           }).then( mentees => msg.respond(message, '*Mentees without ' +assignedFilter+ ':*\n' + mentees.join("\n")))
           }
           function done(err) {
             if (err) { console.error(err); return; }
        }
    })
  })
}
