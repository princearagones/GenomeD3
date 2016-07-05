var tracks = [];
var max = [];
var chrlength = [];
var maxlen = 0;
var resolution = 7 //index of 100000 resolution
var data = [];
var trackish = [];

function readJBrowse(){
	for(i=1;i<=12;i++){
		var path = 'data/tracks/msu7indelsv2/'
		var chr = i < 10 ? ('chr0'+i.toString()) : ('chr'+i.toString());
		var td = '/trackData.json'
		var hist = '/hist-100000-0.json'

		// $.ajax({
		// 	url: path+chr+td,
		// 	type: "GET",
		// 	dataType: "json",
		// 	contentType: 'application/json; charset=utf-8',
	 //        success: function (response) {
	 //            max.push(response.histograms.stats[resolution].max);
	 //            chrlength.push(response.intervals.maxEnd);
		// 		maxlen = Math.max.apply(null,max);
	 //        },
	 //        error: function (response) {
	 //            alert("Error");
	 //        }
	 //    });

	 //    $.ajax({
		// 	url: path+chr+hist,
		// 	type: "GET",
		// 	dataType: "json",
		// 	contentType: 'application/json; charset=utf-8',
	 //        success: function (response) {
	 //       		data.push(response);
	 //        },
	 //        error: function (response) {
	 //            alert("Error");
	 //        }
	 //    })

	 	// d3.json(path+chr+td,function(response){
  	// 		max.push(response.histograms.stats[resolution].max);
	  //       chrlength.push(response.intervals.maxEnd);
			// maxlen = Math.max.apply(null,max);
	 	// })

	 	// d3.json(path+chr+hist,function(response){
  	// 		data.push(response);
	 	// })

	 	$.getJSON(path+chr+td,function(response){
	 		 max.push(response.histograms.stats[resolution].max);
	         chrlength.push(response.intervals.maxEnd);
	         maxlen = Math.max.apply(null,max);
	 	})
	 	$.getJSON(path+chr+hist,function(response){
	 		 data.push(response);
	 	})
	}
	 $(function() {
	 	// $.getScript("src/js/circularplot.js", null);
	 	// $.getScript("src/js/linearplot.js", null);
	 	// $.getScript("src/js/linearbrush.js", null);
	 	// $.getScript("src/js/circularsample.js", null);
	 	// $.getScript("src/js/lineardemo.js", null);
	 	// $.getScript("d3/d3.layout.mod.js", null);
	 	// $.getScript("d3/d3.js", null);
	 	// $.getScript("src/js/packages.js", null);
	 	// $.getScript("makeRibbons.js", null);

		var track1 = {
	    trackName: "track2",
	    visible: true,
	    trackType: "stranded",
	    inner_radius: 315,
	    outer_radius: 365,
	    centre_line_stroke: "grey",
	    showLabels: true,
	    showTooltip: true
	    };

		for(i=0;i<12;i++){
			for(j=0;j<data[i].length;j++){
				obj = {};
				obj.chr = i+1;
				obj.start = j*100000;
				obj.end = (obj.start+100000) > chrlength[i] ? chrlength[i] : obj.start+100000;
				obj.count = data[i][j];
				obj.opacity = obj.count / maxlen;
				obj.strand = 1;
				obj.type = 'DEL';
				trackish.push(obj);
			}
		}
		track1.items = trackish;
		tracks.push(track1);
	});
}
