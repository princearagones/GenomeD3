// Sample routines to initialize the plot for rendering
// and add some basic functionality.

// Initialize the defaults for the chart such as
// the genome size, the div container to put the
// SVG object in, what function to call during a
// double click and the initial chart size.


var chromtracks = {
	trackName: "track1",
	trackType: "stranded",
	visible: true,
	inner_radius: 365,
	outer_radius: 415,
	trackFeatures: "complex",
	featureThreshold: 7000000,
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
}
tracks.push(chromtracks);

tracks[0].items.forEach(function(tr){
	tr.start += chromtracks.items[tr.chr-1].start;
	tr.end += chromtracks.items[tr.chr-1].start;
	tr.size = tr.end - tr.start;
});

var genomesize = tracks[1].genomesize;
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
