var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app		= express(); 

	app.get('/scrape', function(req, res){
	
		//the url to scrape from
	url = 'http://www.imdb.com/title/tt2488496/';



		// guidelines for scraping: 
		// 1# Find a unique element or attribute on the DOM that will help you single out the data you need
		// 2# If no unique element exists on the particular tag, find the closest tag that does and set that as your starting point
		// 3#If needed, traverse the DOM to get to the data you would like to extract
		request(url, function(error, response, html){

			//check for errors
			if(!error){
				var $ = cheerio.load(html);

				//intitalizing varibled that stores data
				var title, release, ratings;
				var json = { title: "", release: "", ratings: ""};

				//using unuque header class as a starting point.
				$('.title_wrapper').filter(function(){

					var data = $(this);

					//navigate to the text inside the child element
					title = data.children().first().text(), 
					title = title.substring(0, title.indexOf('('));

					release = data.children().children().first().text(); //filter('a').text(); 
					release = release.replace('(', '');
					release = release.replace(')', '');

					//$('#fruits').children('.pear').text()
					//$('li').filter('.orange').attr('class');

					json.title = title; 
					json.release = release; 

				})
			

			$('.ratingValue').filter(function(){
				var data = $(this);
				rating = data.children().text(); 

				json.ratings = rating; 
			})
		}

		// To write to the system we will use the built in 'fs' library.
		// In this example we will pass 3 parameters to the writeFile function
		// Parameter 1 :  output.json - this is what the created filename will be called
		// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
		// Parameter 3 :  callback function - a callback function to let us know the status of our function

		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
			console.log("File succesfully written! - Check you project directory for the puput.json file");
		})

		res.send('Check your console');

		})
	})

app.listen('8081');
console.log("Magic happens on port 8081");
exports  = module.exports = app; 