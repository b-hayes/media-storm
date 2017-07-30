Meteor.methods({

    /**
     *
     * CALL THIS LIKE THIS FROM CLIENT
     *
     * Meteor.call('getData', ID, function(err, data) { }
     *
     * @param id
     * @returns {*}
     */
    getData: function(id){
        //console.log(id);
        return MyHelper.getData(id);
    },

    /***
     * Interface between client and server TwitterHelper for searching and returning tweets.
     *
     * @param id, the earth quake's id to get the date and geolocation data to search twitter.
     * @returns {*}
     */
    getTwitter: function (id) {

        var quake = Helpers.getQuake(id);


        console.log(typeof(quake));
        console.log(quake.Latitude);


        // const geolocation = {
        //     latitude: quake['Latitude'],
        //     longitude: quake['Longitude'],
        //     radius: '1000'
        // };


       // return TwitterHelper.getData('earth quake', quake['UTC Date'] );
    },

    /**
     *
     * Client code should call this server method to avoid CORS restrictions
     */
    crossDomainProxy: function(url, options, method) {

        /*
         // how to use this from client code
         Meteor.call('crossDomainProxy', url, null, "GET", function(err, response) {

         if(err || !responses) {
         console.log(err);
         }
         else {
         // do something ith response
         });
         */

        this.unblock();

        var params = {
            headers: {
                Accept: "text/javascript, application/xml, text/xml, text/html, */*"
            }
        };

        if(options) _.extend(params, options);

        try {
            return HTTP.call(method, url, params);
        }
        catch (e) {
            throw new Meteor.Error(500, 'Error 500: Get request failed', e);
        }
    }
});
