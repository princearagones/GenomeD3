// Sample routines to initialize the plot for rendering
// and add some basic functionality.

// Initialize the defaults for the chart such as
// the genome size, the div container to put the
// SVG object in, what function to call during a
// double click and the initial chart size.
var tracks = [];

var track1 = {
	    trackName: "track2",
	    visible: true,
	    trackType: "stranded",
	    inner_radius: 335,
	    outer_radius: 365,
	    centre_line_stroke: "grey",
	    showLabels: true,
	    showTooltip: true,
	    items: []
	    };

var chrlength = [43270923,35937250,	36413819,35502694,29958434,31248787,29697621,28443022,23012720,23207287,29021106,27531856];
//

var resolution = 250000;


tracks.push(track1);
var track2 = JSON.parse(JSON.stringify(track1));
track2.inner_radius -= 15;
track2.outer_radius -= 15;
var track3 = JSON.parse(JSON.stringify(track2));
track3.inner_radius -= 15;
track3.outer_radius -= 15;
tracks.push(track2);
tracks.push(track3);

id = 0;

var chromtracks = {
	trackName: "track1",
	trackType: "stranded",
	visible: true,
	inner_radius: 365,
	outer_radius: 415,
	trackFeatures: "complex",
	featureThreshold: 0,
	mouseclick: "islandPopup",
	mouseover_callback: "islandPopup",
	mouseout_callback: "islandPopupClear",
	linear_mouseclick: "linearPopup",
	showLabels: true,
	showTooltip: true,
	genomesize: 373245519,
	linear_mouseclick: "linearClick",
	items: [ //these are real data of the length of each chromosome of a rice, incrementing from previous lengths
								 {id: 1, start:0, end:43270923, name:"Chromosome 1", strand: -1, type:"Chromosome"},
								 {id: 2, start:43270923, end:79208173, name:"Chromosome 2", strand: -1, type:"Chromosome"},
								 {id: 3, start:79208173, end:115621992, name:"Chromosome 3", strand: -1, type:"Chromosome"},
								 {id: 4, start:115621992, end:151124686, name:"Chromosome 4", strand: -1, type:"Chromosome"},
								 {id: 5, start:151124686, end:181083120, name:"Chromosome 5", strand: -1, type:"Chromosome"},
								 {id: 6, start:181083120, end:212331907, name:"Chromosome 6", strand: -1, type:"Chromosome"},
								 {id: 7, start:212331907, end:242029528, name:"Chromosome 7", strand: -1, type:"Chromosome"},
								 {id: 8, start:242029528, end:270472550, name:"Chromosome 8", strand: -1, type:"Chromosome"},
								 {id: 9, start:270472550, end:293485270, name:"Chromosome 9", strand: -1, type:"Chromosome"},
								 {id: 10, start:293485270, end:316692557, name:"Chromosome 10", strand: -1, type:"Chromosome"},
								 {id: 11, start:316692557, end:345713663, name:"Chromosome 11", strand: -1, type:"Chromosome"},
								 {id: 12, start:345713663, end:373245519, name:"Chromosome 12", strand: -1, type:"Chromosome"}]
};


var asyncLoop = function(o){
    var i=-1,
        length = o.length;

    var loop = function(){
        i++;
        if(i==length){o.callback(); return;}
        o.functionToLoop(loop, i);
    }
    loop();//init
}

var maxchrlen_ins = 0,maxchrlen_del = 0,maxchrlen_inv = 0;
var trackName = $("#trackName").val();

//this function forces "get" method to be asynchronous
//this have 2 loops. first loops get the max count of genome in all chromosomes for color opacity
//the second one, read file from data (local or fomr JBrowse)
function render(){
	$(".se-pre-con").fadeIn("slow");
	maxchrlen_ins = 0,maxchrlen_del = 0,maxchrlen_inv = 0;
	resolution = $("#res1").is(":checked") === true ? 250000:100000;
	var trackValue = $("#trackName").val();
	var insTrackName = "", delTrackName = "", invTrackName = "";
	for(k=0;k<trackMap.tracks.length;k++){
		if(trackMap.tracks[k].name == trackValue){
			insTrackName = trackMap.tracks[k].instrack;
			delTrackName = trackMap.tracks[k].deltrack;
			invTrackName = trackMap.tracks[k].invtrack;
		}
		console.log(insTrackName,delTrackName,invTrackName)
	}
	tracks[0].items = [];
	tracks[1].items = [];
	tracks[2].items = [];
	asyncLoop({
    length : 12,
    functionToLoop : function(loop, i){
    var path = 'http://172.29.4.215:8080/jbrowse-dev2/data/tracks/';
		var td = '/trackData.json';
		var hist = '/hist-'+resolution.toString()+'-0.json';
        setTimeout(function(){
            var chr = i < 9 ? ('/chr0'+(i+1).toString()) : ('/chr'+(i+1).toString());
			d3.json(path+insTrackName+chr+td, function(response){findMax(response, (i+1),resolution,"ins")});
			d3.json(path+delTrackName+chr+td, function(response){findMax(response, (i+1),resolution,"del")});
			d3.json(path+invTrackName+chr+td, function(response){findMax(response, (i+1),resolution,"inv")});
            loop();
        },50);

        //console.log(maxchrlen);
    },
    callback : function(){
    	console.log(maxchrlen_ins,maxchrlen_del,maxchrlen_inv)
      	asyncLoop({
		    length : 13,
		    functionToLoop : function(loop, i){
		    var path = 'http://172.29.4.215:8080/jbrowse-dev2/data/tracks/';
				var td = '/trackData.json';
				var hist = '/hist-'+resolution.toString()+'-0.json';

		        setTimeout(function(){
		            var chr = i < 9 ? ('/chr0'+(i+1).toString()) : ('/chr'+(i+1).toString());
		            if(i!=12){
						d3.json(path+insTrackName+chr+hist, function(response){readonebyone(response, (i+1),chr,"INS",0,maxchrlen_ins)});
						d3.json(path+delTrackName+chr+hist, function(response){readonebyone(response, (i+1),chr,"DEL",1,maxchrlen_del)});
						d3.json(path+invTrackName+chr+hist, function(response){readonebyone(response, (i+1),chr,"INV",2,maxchrlen_inv)});
		            }
		            loop();
		        },10);
		    },
		    callback : function(){
		    	//these force updates svg rendered
		        var genomesize = 373245519;
				var circularlayout = {genomesize: genomesize,
						      container: "#circularchart",
						      dblclick: "doubleClick",
				                      w: 800, h: 800
				        };
				$.getScript("d3/d3-tip.js", function(){

					var cTrack = new circularTrack(circularlayout, tracks);

					if('undefined' !== typeof linearTrack) {
					    console.log("Attaching linear track");
					    cTrack.attachBrush(linearTrack);
					    cTrack.showBrush();
					}

					if('undefined' !== typeof brush) {
					    console.log("Attaching linear track brush");
					    cTrack.attachBrush(brush);
					}
					$.getScript("makeRibbons.js");
					updateFrame = false;
					linearTrack.displayStranded(tracks[0], 0);
					linearTrack.displayStranded(tracks[1], 0);
					linearTrack.displayStranded(tracks[2], 0);
					linearTrack.update(100000,200000,null);
					linearTrack.rescale();
					linearTrack.update(0,20000000,null);
					linearTrack.rescale();
					});
					document.getElementById('jbrowse').src = pathSrc + chrSrc + '%3A' + globalVisStart + '..' + globalVisEnd + tail1Src + trackRenderSrc + tail2Src;
					updateFrame = true;
				     $(".se-pre-con").fadeOut("slow");
		    }
		});
    }
});
}

render();

//compares 2 numbers, puts max to maxchrlen
function findMax(response, i,resolution,type){
	var idx = 0;
	//looks for the data for 100000 bins
	for(j=0;j<response.histograms.stats.length;j++){
		if('undefined' === typeof response.histograms.stats[j].basesPerBin)continue;
		if(response.histograms.stats[j].basesPerBin === resolution.toString()){
			idx = j;
		}
	}
	var count = count > response.histograms.stats[idx].max ? count : response.histograms.stats[idx].max;
	switch(type){
		case "ins": maxchrlen_ins = count; break;
		case "del": maxchrlen_del = count; break;
		case "inv": maxchrlen_inv = count; break;
	}
}

//reads data from JSON
function readonebyone(response, i,chr, type, idx, count){
	for(j=0;j<response.length;j++){
		var obj = {};
		obj.chr = i;
		obj.realStart = j*resolution;
		obj.start = obj.realStart+ chromtracks.items[i-1].start;
		obj.id = id;
		id++;
		obj.end = (obj.start+resolution) > chrlength[i-1]+chromtracks.items[i-1].start ? chrlength[i-1]+chromtracks.items[i-1].start : obj.start+resolution;
		obj.realEnd = obj.end - chromtracks.items[i-1].start;
		obj.count = response[j];
		obj.name = obj.start.toString() + '-' +obj.end.toString()+'\nCount: '+obj.count;
		obj.strand = 1;
		obj.type = type; //only for color purposes
		obj.max = count;
		tracks[idx].items.push(obj);
		// var cloneObj = JSON.parse(JSON.stringify(obj));
		// cloneObj.type= 'INS';
		// tracks[1].items.push(cloneObj);
		// cloneObj = JSON.parse(JSON.stringify(obj));
		// cloneObj.type= 'INV';
		// tracks[2].items.push(cloneObj);
	}
}


//sync length to the circle for rad computation
for(i=0;i<tracks.length-1;i++){
	tracks[i].items.forEach(function(tr){
		tr.start += chromtracks.items[tr.chr-1].start;
		tr.end += chromtracks.items[tr.chr-1].start;
		tr.size = tr.end - tr.start;
	});
}


tracks.push(chromtracks);


var genomesize = 373245519;
var circularlayout = {genomesize: genomesize,
		      container: "#circularchart",
		      dblclick: "doubleClick",
                      w: 800, h: 800
        };

// The actual initialization call which takes two
// parameters, the layout (above) for the plot and
// the dataset to visualize (from data.js, a json
// data structure)
// var request = new XMLHttpRequest();
// request.open("GET", "sampdata.json",false);
// request.send(null)
// var tracks = JSON.parse(request.responseText);
// console.log(tracks);


var cTrack = new circularTrack(circularlayout, tracks);
//console.log(cTrack);

if('undefined' !== typeof linearTrack) {
    console.log("Attaching linear track");
    cTrack.attachBrush(linearTrack);
    cTrack.showBrush();
}

if('undefined' !== typeof brush) {
    console.log("Attaching linear track brush");
    cTrack.attachBrush(brush);
}

// Now some callbacks to make the interactive functionality work.

// Attached to the onchange callback for the GC Plot checkbox,
// call the plot to add/remove the GC Plot as needed
function updateGC(cb) {
    if(cb.checked) {
	cTrack.showTrack("gcplot");
    } else {
	cTrack.hideTrack("gcplot");
    }
}

// Attached to strand track checkbox, call the plot to
// add/remove the inner stranded track
function updateStrand(cb) {
    if(cb.checked) {
	cTrack.showTrack("track1");
    } else {
	cTrack.hideTrack("track1");
    }
}

// Attached to the contig gap checkbox, call the plot to
// add/remove the contig gap squiggles
function updateGaps(cb) {
    if(cb.checked) {
	cTrack.showTrack("gapTrack");
    } else {
	cTrack.hideTrack("gapTrack");
    }
}

// Attached to the ADB glyph checkbox, call the plot to
// add/remove only the ADB type of glyph
function updateAdb(cb) {
    if(cb.checked) {
	cTrack.showGlyphTrackType("track5", "adb");
    } else {
	cTrack.hideGlyphTrackType("track5", "adb");
    }
}

// Attached to the resize plot button, call the plot to
// resize the plot to 650px diameter
function resizePlot() {
    cTrack.resize(650);
}
function saveImage() {
    cTrack.savePlot(4.0, "islandviewer.png", "tracks.css", 'png');
}

// Demo of the hover over timer, we had to
// do it this way to get around IE <9 not supporting
// parameters to the function called by setTimeout()
//
// If you have over an island, the console log will
// display the callback parameters when the timer expires
//
// The callback for hover (along with click) are defined in
// the data definition for each track in the dataset (data.js)
var timer;
var d_callback;
function islandPopup(d) {
    d_callback = d;
    timer = setTimeout(function() {console.log(d_callback);}, 1000);
}

function islandPopupClear(d) {
    clearTimeout(timer);
}

// Callback defined at the top of this file, for
// double clicks on the plot
function doubleClick(plotid, bp) {
    // If we have an attached linear plot, we're going
    // to refocus the zoomed area, otherwise we'll just
    // alert the user that a double click happened
    if('undefined' !== typeof linearTrack) {
        var halfBP = (cTrack.brushEndBP - cTrack.brushStartBP) /2;

	var newStart = Math.max(0, (bp - halfBP));
	var newEnd = Math.min(genomesize, (bp + halfBP));

        console.log("Moving zoom area to: " + newStart + ", " + newEnd);
        cTrack.moveBrushbyBP(newStart,
                             newEnd);
        linearTrack.update(newStart, newEnd);
    } else {
      alert("Double click! From " + plotid + " at " + bp + " bp" )
      console.log("double click!");
      console.log(plotid);
      console.log(bp);

    }
}
