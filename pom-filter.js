/* Filter for comparing teams */

var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

window.setTimeout(function() {
	jQuery.noConflict();

	function Update(){
		var team1 = jQuery("input[name='email']").val();
		var team2 = jQuery("input[name='password']").val();
		
		jQuery("tr").each( function() {
			var teamName = jQuery(this).find("a[href*='team']").text().toLowerCase();
			if( (!team1 || !teamName.match(team1)) && (!team2 || !teamName.match(team2)) ) {
				jQuery(this).find("a[href*='team']").parents("tr").hide();
			} else {
				jQuery(this).find("a[href*='team']").parents("tr").show();
			}
		});
	}
	
	jQuery("input[name='email']").keyup(Update)
	jQuery("input[name='password']").prop('type','text').keyup(Update)
}, 2500);
