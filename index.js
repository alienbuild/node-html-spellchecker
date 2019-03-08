// Requires
const fs = require('fs');
const cheerio = require('cheerio');
const spell = require('spell-checker-js');

// Load dictionary
spell.load('./en-modified.txt')

// Options
const input = './directory/';
let counter = 0;

// Read Directory
fs.readdir(input, function(err, items) {
    for (var i=0; i<items.length; i++) {
    	const filename = items[i];
        // Read HTML file
		fs.readFile('./directory/' + items[i], 'utf-8', function(err, contents) { 
			// Throw it into the inspector, with the file name. 
			inspectFile(contents, filename);  
		});

    }
});

// Run Spellchecker
function inspectFile(contents, filename) {
	const $ = cheerio.load(contents);
	// Grab all the text nodes in the HTML file
	let text = $('body').text();

	// Remove null and empty lines
	text.replace(/[\r\n]+/g, '');
	text = text.replace(/[0-9]/g, '');

	// Create array
	const theArray = text.split(' ');

	// Filter empty arrays
	const filtered = theArray.filter(function (el) {
		if (el != '' || '\n') {
			return el;
		}
	});

	// For each word run nspell
	filtered.forEach((word, index) => {
		if (word.length > 3) {
			// Perform spellcheck on 'word'
			const check = spell.check(word);
			// Tell us what you've flagged.
			if (check != '') {
				counter++
				console.log(check + ' - ' + filename);
			}
		}
	});

}
