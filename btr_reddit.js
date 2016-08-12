import { Meteor } from 'meteor/meteor';
import r from 'nraw';

Meteor.startup(() => {

		Meteor.methods({
			/**
			* Search reddit 
			*
			* @param {string} searchInput - what to search reddit for
			*/			
			getSearchResults(searchInput, wsid){				
				rdit.subreddit("all").search(searchInput, 
					Meteor.bindEnvironment((data) => {
						data['data']['children'].map(status => {
							console.log(status);
							Reddit.insert({
								subreddit: status.subreddit,
								id: status.id,
								title: status.title,
								author: status.author,
								score: status.score,
								num_comments: status.num_comments,
								ups: status.ups,
								downs: status.downs,
								created: status.created,					
							})
						})					
					})
				)				
			},			
			
			/**
			* Get comments from a specific subreddit and thread
			*
			* @param {string} sub - subreddit name
			* @param {string} thread   - thread 32 ID
			*/
			getThreadComments: function(sub, thread){
				rdit.subreddit(sub).post(thread,
					Meteor.bindEnvironment((data) => {
						var myData = data[1]['data']['children']
						myData.map(status => {
							Reddit.insert({
								subreddit: status.data.subreddit,
								author: status.data.author,
								score: status.data.score,
								ups: status.data.ups,
								downs: status.data.downs,
								body: status.data.body,
								created: status.data.created,
								edited: status.data.edited						
							})
						})								
					})
				)				
			},
			
			/**
			* Get top 25 posts from specific subreddit
			*
			* @param {string} sub - subreddit name
			*/
			getSubreddit: function(sub){
				rdit.subreddit(sub,
					Meteor.bindEnvironment((data) => {				
						data['data']['children'].map(status => {
							Reddit.insert({
								domain: status.data.domain,
								subreddit: status.data.subreddit,
								id: status.data.id,
								title: status.data.title,
								author: status.data.author,
								url: status.data.url,
								score: status.data.score,
								ups: status.data.ups,
								downs: status.data.downs,
								num_comments: status.data.num_comments,
								created: status.data.created							
							})
						})
					})
				)
			},

			/**
			* Get users most recent posts
			*
			* @param {string} userName - Reddit user name
			*/
			getUser: function(userName){
				rdit.user(userName,
					Meteor.bindEnvironment((data) => {
						data['data']['children'].map(status => {
							Reddit.insert({
								subreddit: status.data.subreddit,
								link_url: status.data.link_url,
								link_title: status.data.link_title,
								link_id: status.data.link_id,
								link_author: status.data.link_author,
								body: status.data.body,
								edited: status.data.edited,
								score: status.data.score,
								ups: status.data.ups,
								downs: status.data.downs,
								created: status.data.created   
							})
						})
					})
				)
			},			
		
	})
});