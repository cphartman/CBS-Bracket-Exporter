// Standings Exporter

var currentYear = (new Date()).getFullYear();
var startYear = 2012;
var endYear = currentYear;

// People change names so this maps their old names to their most recent
var alias = {

};

playerList = {};

function ParseYearPage(year) {
	
	// Loop up until the final year
	if( year > endYear ) {
		console.log(playerList);
		console.log(JSON.stringify(playerList));
		return;
	}

	// Current year uses 0,1,2,3,4,5,6 for rounds, not the actual year
	var url = year;
	if( year == currentYear ) {
		url = 6;
	}

	// Load the standings page
	var $i = $("<iframe src='/brackets/standings/"+url+"'>").appendTo('body');
	$i.load( function(){

		var $ = $i.get(0).contentWindow.jQuery;

		// Get rows in first data table not title or label
		var $standingRows = $($("table.data")[0]).find("tr:not(.title,.label)");
		
		// Loop each row in the standings table
		$standingRows.each(function(){

			var $this = $(this);

			// Ignore any extra lines in the table
			if($this.find("td").length != 7 ) {
				return true;
			}

			// Extract table text
			var rank = $this.find("td:nth-child(1)").text();
			var name = $this.find("td:nth-child(2)").text();
			var score = $this.find("td:nth-child(3)").text();
			var correct = $this.find("td:nth-child(4)").text();
			var champion = $this.find("td:nth-child(5)").text();
			
			// Check if this is a 2nd entry from the same player
			var secondEntry = name.match("(2)");
			name = name.replace("(1)","").replace("(2)","").trim();
			
			// Normalize players who changed names
			if( alias[name] ) {
				name = alias[name];
			}

			// Initialize player
			if( !playerList[name] ) {
				playerList[name] = {};
			}

			// Initialize year
			if( !playerList[name][year] ) {
				playerList[name][year] = [];
			} else {
				secondEntry = true;
			}

			// Add player row
			playerList[name][year][ (secondEntry?1:0) ] = {
				rank: rank,
				score: score,
				correct: correct,
				champion: champion
			};
		});

		// Progress Counter
		console.log(year + " complete");

		// Parse the next year
		ParseYearPage(year+1);
	});
}

ParseYearPage(startYear);
