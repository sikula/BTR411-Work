import { Meteor } from 'meteor/meteor';
import Google from 'googleapis';

Meteor.startup(() => {
	
	const youtubeKey = '< ADD YOUR YOUTUBE API KEY HERE >';
  
	Meteor.methods({
		
		/**
		* takes youtube video Link and add comments to the youtube collection
		*
		* @param {string} videoLink - full Youtube video URL
		*/
		getComments: function(videoLink){
			var videoId = videoLink.split('watch?v=')[1].split('&')[0];
			var theUrl =  'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=' + videoId + '&maxResults=100&key=' + youtubeKey;
			HTTP.call('GET', theUrl, function(error, result){
				if(!error){
					result['data']['items'].map(status => {
							Youtube.insert({
							"author"  : status.snippet.topLevelComment.snippet.authorDisplayName,
							"profileImage"   : status.snippet.topLevelComment.snippet.authorProfileImageUrl,
							"channelUrl" : status.snippet.topLevelComment.snippet.authorChannelUrl,
							"likeCount"    : status.snippet.topLevelComment.snippet.likeCount,
							"time"	: status.snippet.topLevelComment.snippet.publishedAt,
							"textDisplay"        : status.snippet.topLevelComment.snippet.textDisplay
						})
					})
				}
				if(error)
					console.log(error)
			})
		},	
	})	
});
