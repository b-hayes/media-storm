
/**
 * @author Daniel Richardson and Brad Hayes
 * Created by dandaman on 29/7/17.
 *
 *
 * Backend API for searching tweets from Twitter based on certain conditions to find tweets from people within an earthquake
 * zone. These tweets will be displayed in the applications.
 */


// credentials for twitter api
const accessToken = "icNZWaoOvwjGIknimKODwwn4j";
const accessTokenSecret = "ItbA7XFZJO9mNTuRVWGOF1iMbUgw2HAWhQNClv1MLcaNYxGp3c";
const OAuth = require('oauth').OAuth;

/***
 * TwitterHelper provides a useful way to search for posts on twitter feeds using Oauth and application tokens.
 * This method is currently limited to 15 records and 450 twitter requests per 15 minute window.
 *
 * @type {{oauth: *, getTest: TwitterHelper.getTest, getParamaters: TwitterHelper.getParamaters, getData: TwitterHelper.getData}}
 */
TwitterHelper = {
    /***
     * This is the oauth setup object used as part of the request to Twitter.
     */
    oauth: new OAuth (
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        accessToken,
        accessTokenSecret,
        '1.0A',
        null,
        'HMAC-SHA1'
    ),

    /**
     * This method is just a test method, and it is hard coded currently to retrieve tweets using the keyword 'govhack'.
     * @returns {Promise}
     */
    getTest: function() {

        // return a promise while we do async stuff
        return new Promise((resolve, reject) => {

            // make an async call
            this.oauth.get(
                'https://api.twitter.com/1.1/search/tweets.json?q=%40govhack',
                this.accessToken,
                this.accessTokenSecret,
                function (error, data, res) {
                    if (error){
                        reject(error);
                        return error;

                    } else {
                        resolve(data);
                        return data;
                    }
                });
        });
    },

    /**
     * This method is an over-loader method to provide the getData() method with any number of parameters for flexibility
     * in which arguments to provide it.
     *
     * @param date, the date parameter is the date we wish to collect up-to and including to allow data to be cherry picked.
     * @param geolocation, object containing lon, lat and radius area in which to search for twitter feeds.
     * @returns {string}, the query string that will be sent to Twitter.
     */
    getParamaters: function (date, geolocation) {


        let parameters = 'q=govhack OR earthquakes OR weather';

        if (typeof geolocation !== "undefined") {
            parameters =  parameters + '&geocode=' + geolocation.latitude + "," + geolocation.longitude + "," + geolocation.radius + "km";
        }
        if (typeof date !== "undefined") {
            parameters = parameters + '&until=' + date;
        }


        console.log(parameters);

        return parameters;
    },

    /***
     * This method processes the arguments passed to it and generates and sends a query to Twitter to request results.
     * NOTE: this method is limited to 15 records per query and has an upper limit 450 queries per 15 minutes.
     *
     * @param date, is the date to stop returning results once reached. I.e. give me all x records up-to x date.
     * @param geolocation, lon, lat, radius of where the tweet was made.
     * @returns {Promise}
     */
    getData: function(date, geolocation) {
        //console.log('Fetching tweets for ' + date + " within " + radius + " kilometres of " + longitude + " : " + latitude);

        const params = this.getParamaters(date, geolocation);

        // return a promise while we do async stuff
        return new Promise((resolve, reject) => {

             var url = 'https://api.twitter.com/1.1/search/tweets.json?' + params;

            //var url = 'https://api.twitter.com/1.1/search/tweets.json?q=catsORdogs';

            console.log(url);

            // make an async call
            this.oauth.get(
                url,
                this.accessToken,
                this.accessTokenSecret,
                function (e, data, res) {
                    if (e){
                        console.log("something don fucked up");
                        reject(e);
                        return e;

                    } else {
                        resolve(data);
                        return data;
                    }
                });
        });
    },

};



