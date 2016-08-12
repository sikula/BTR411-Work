import { Meteor } from 'meteor/meteor';
import { Services } from '/lib/services';
import Twitter from 'twit';
import moment from 'moment';


Meteor.startup(() => {
	const twitterHandler = new Twitter({
		consumer_key:         '< ADD YOUR TWITTER API KEYS HERE >',
		consumer_secret:      '< ADD YOUR TWITTER API KEYS HERE >',
		access_token:         '< ADD YOUR TWITTER API KEYS HERE >',
		access_token_secret:  '< ADD YOUR TWITTER API KEYS HERE >',
	});


	Meteor.methods({
		/**
		 * Searches  with the Twitter API
		 *
		 * @param {string} apiType - sets the API type, (REST)
		 * @param {string} query   - the query string used in search
		 */
		getTwitterResults(apiType, query) {
			if(apiType === 'rest'){
				twitterHandler.get('search/tweets', {q: query, lang: 'en', count: 100, exclude: 'retweets'},
					Meteor.bindEnvironment((err, response) => {
						Meteor.call('insertRestAPIResults', response);
					})
				)
			}

			if(apiType === 'stream'){
				var stream = twitterHandler.stream('statuses/filter', {track: [query]})
				stream.on('tweet', function (tweet){
					console.log(tweet);
				})
			}
		},

		/**
		 * Inserts results into the Tweets collection from REST API
		 *
		 * @param {string} twitterResults - Object returned by Twitter API call
		 */
		insertRestAPIResults (twitterResults) {
			twitterResults.statuses.map(status => {
					Tweets.insert({
						created_at: Meteor.call('formatTwitterTime', status.created_at),
						user_name: status.user.name,
						screen_name: status.user.screen_name,
						location: status.user.location,
						retweets: status.retweet_count,
						image: status.user.profile_image_url_https,
					})
			})
		},


		/**
		 * Returns information about the user specified by user_id or screen_name
		 *
		 * @param {string} screen_name - screen name to search for
		 */
		getUserInfo(screen_name){
			twitterHandler.get('users/show', { screen_name: screen_name },
				(error, data, response) => {
					if(!error){
						console.log(data)
					}
					if(error){
						console.log(error);
					}
				})
		},


		/**
		 * Converts Twitter's timestamp to a simpler format
		 *
		 * @param {string} timeToFormat - a string representation of a Date to convert to a different format
		 */
		formatTwitterTime(timeToFormat) {
			let oldFormat = 'ddd MMM D hh:mm:ss Z YYYY'
			let newFormat = 'YYYY/MM/DD HH:mm:ss'
			return moment(timeToFormat, oldFormat).format(newFormat)
		},


  })
});