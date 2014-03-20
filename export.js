function Node(value) {
	if( value ) {
		if( $("#"+value).find('.teamName').length ) {
			this.val = $("#"+value).find('.teamName').text();
		} else {
			this.val = $("#"+value).text();
		}
	} else {
		this.val = null;
	}
	this.lookup = value;
	this.Top = null;
	this.Bottom = null;
}

var champion = new Node( "winningTeamPick" );
champion.Top = new Node( "5-6-1-Top" );
champion.Top.Top = new Node( "5-5-1-Top" );
champion.Top.Bottom = new Node( "5-5-1-Bottom" );
champion.Bottom = new Node( "5-6-1-Bottom" );
champion.Bottom.Top = new Node( "5-5-2-Top" );
champion.Bottom.Bottom = new Node( "5-5-2-Bottom" );

ParseTree(champion.Top.Top, 1, 4, 1);
ParseTree(champion.Top.Bottom, 2, 4, 1);
ParseTree(champion.Bottom.Top, 3, 4, 1);
ParseTree(champion.Bottom.Bottom, 4, 4, 1);

function ParseTree(parent, region, depth, height) {

	if( depth == 0 ) {
		return;
	}
	
	parent.Top = new Node(region+"-"+depth+"-"+height+"-Top");
	parent.Bottom = new Node(region+"-"+depth+"-"+height+"-Bottom");
	
	ParseTree(parent.Top, region, depth-1, (height*2)-1); // Top
	ParseTree(parent.Bottom, region, depth-1, (height*2)); // Bottom

}
