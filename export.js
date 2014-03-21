/* Export CBS bracket data to json */

var $s = $("<iframe src='/brackets/standings'>").load( function(){ParseStandings()} ).appendTo('body');
var playerLinks = [];
var playerIndex = 0;

function ParseStandings() {
	$output = $("<textarea id='output'></textarea>");
	$output.css({
		position: "fixed",
		top: "0",
		left: "0",
		width: "100%",
		height: "700px",
		overflow: "auto",
		"white-space": "nowrap",
		"z-index": "999999"
	});
	$("body").append($output);
	$output.append("$brackets = array();\n");

	playerLinks = $s.get(0).contentWindow.jQuery('table.data td a');
	
	ParsePlayer(0);
}

function ParsePlayer(playerIndex) {
	if( playerIndex == playerLinks.length ) {
		return;
	}
	
	console.log( parseInt((playerIndex/playerLinks.length)*100,10) + "%" );
	
	$this = $(playerLinks[playerIndex]);
	url = $this.prop('href');
	name = $this.text();

	$i = $("<iframe src='"+url+"'>").appendTo('body');
	var root = false;
	
	$i.load( function(){
		function Node(value) {
			if( value ) {
				if( $i.get(0).contentWindow.jQuery("#"+value).find('.teamName').length ) {
					this.val = $i.get(0).contentWindow.jQuery("#"+value).find('.teamName').text();
				} else {
					this.val = $i.get(0).contentWindow.jQuery("#"+value).text();
				}
			} else {
				this.val = null;
			}
		}

		function ParseTree(parent, region, depth, height) {

			if( depth == 0 ) {
				return;
			}
			
			parent.Top = new Node(region+"-"+depth+"-"+height+"-Top");
			parent.Bottom = new Node(region+"-"+depth+"-"+height+"-Bottom");
			
			ParseTree(parent.Top, region, depth-1, (height*2)-1); // Top
			ParseTree(parent.Bottom, region, depth-1, (height*2)); // Bottom

		}
		
		root = new Node( "winningTeamPick" );
		root.Score = $i.get(0).contentWindow.jQuery("#finalGameScoreTxt").val();
		root.Top = new Node( "5-6-1-Top" );
		root.Top.Top = new Node( "5-5-1-Top" );
		root.Top.Bottom = new Node( "5-5-1-Bottom" );
		root.Bottom = new Node( "5-6-1-Bottom" );
		root.Bottom.Top = new Node( "5-5-2-Top" );
		root.Bottom.Bottom = new Node( "5-5-2-Bottom" );

		ParseTree(root.Top.Top, 1, 4, 1);
		ParseTree(root.Top.Bottom, 2, 4, 1);
		ParseTree(root.Bottom.Top, 3, 4, 1);
		ParseTree(root.Bottom.Bottom, 4, 4, 1);
		
		$i.remove();

		var json = JSON.stringify(root).replace(/[']/, "\\'");

		$("#output").val( $("#output").val()+"$brackets['"+name+"'] = json_decode('"+json+"',1);\n");
		
		ParsePlayer(playerIndex+1);
	});
}
