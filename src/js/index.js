var addedLayer = false;
var trkNames = [];
var newtrack = {}

function addLayer(){
	if($("#addLayer :checked").length > 3){
		alert("Rendering problem might occur on multiple traits");
	}

	if(addedLayer == true){
		newtrack.items = [];
		trkNames = [];
	} 
	else {
	 addedLayer = true;
	  // var newtrack = JSON.parse(JSON.stringify(track1));
	  newtrack = 
	  		{ trackName: "track5",
			trackType: 'glyph',
			glyphType: 'circle',
			radius: 300,
			pixel_spacing: 15,
			linear_pixel_spacing: 5,
		        glyph_buffer: 5,
		        linear_glyph_buffer: 5,
			glyphSize: 10,
			linear_glyphSize: 50,
			linear_height: 100,
			linear_mouseclick: 'linearPopup',
			showTooltip: true,
			items: [
				// {id: 1, bp: 100000, type: 'vfdb', name: 'vfdb1'},
				// {id: 2, bp: 5000000, type: 'adb', name: 'adb1'},
				// {id: 3, bp: 5100000, type: 'adb', name: 'adb2'},
				// {id: 4, bp: 5200000, type: 'vfdb', name: 'vfdb2'},
				// {id: 5, bp: 5300000, type: 'adb', name: 'adb3'},
				// {id: 6, bp: 5400000, type: 'vfdb', name: 'vfdb4'},
				// {id: 7, bp: 5500000, type: 'adb', name: 'adb4'},
				// {id: 8, bp: 5600000, type: 'adb', name: 'adb5'},
				// {id: 9, bp: 15600000, type: 'adb', name: 'adb6'},
				// {id: 10, bp: 25600000, type: 'adb', name: 'adb7'},
				// {id: 11, bp: 356000000, type: 'adb', name: 'db8'},
				// {id: 12, bp: 356000005, type: 'adb', name: 'adb9'},
				// {id: 13, bp: 55600000, type: 'adb', name: 'adb13'},
				// {id: 14, bp: 55700000, type: 'adb', name: 'adb14'},
				// {id: 15, bp: 55600000, type: 'adb', name: 'db15'},
				// {id: 16, bp: 10000000, type: 'adb', name: 'adb16'},
				// {id: 17, bp: 10001000, type: 'vfdb', name: 'adb17'},
				// {id: 18, bp: 500000000, type: 'adb', name: 'adb18'},
				// {id: 19, bp: 500005000, type: 'vfdb', name: 'db19'},
				// {id: 20, bp: 500006005, type: 'vfdb', name: 'adb20'},

		           ]
			      }

	  tracks.splice(tracks.length-1,0,newtrack);


	}

	
 
  $("#addLayer :checked").each(function(){
  	trkNames.push($(this).val());
  });



  h = 720;
  rx = w / 2 -15;
  ry = h / 2;
  render();
}

