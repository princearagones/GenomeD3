/*
  Program Description: This program read input from raw files found in data/real
*/



var tracks = [];

//readFile("data/real/IRIS_313-15897.DUP", tracks);
// readFile("data/real/IRIS_313-15897.DEL", tracks);
// readFile("data/real/IRIS_313-15897.INS", tracks);
// readFile("data/real/IRIS_313-15897.INV", tracks);

function readFile(file ,tracks){
  var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
              //creates a track on each iteration for a track
              var track1 = {
              trackName: "track2",
              visible: true,
              trackType: "stranded",
              centre_line_stroke: "grey",
              showLabels: true,
              trackFeatures: "complex",
              featureThreshold: 373245519,
              showTooltip: true
              }
              //dynamically appending tracks on the circular view
              if(tracks.length == 0){
                track1.outer_radius = 365;
              }else {
                track1.outer_radius = tracks[tracks.length-1].inner_radius+10;
              }

              track1.inner_radius = track1.outer_radius - 20;

              var track = [];
                var allText = rawFile.responseText;
                var id = 0;
                allText.split("\n").forEach(function(data){ //parsing
                  if(data != ""){
                      id++;
                      var obj = {}
                      var str = data.split("\t");
                      for(i=0;i<str.length;i++){
                        obj.chr = parseInt(str[0].replace('chr',''));
                        obj.start = parseInt(str[1]);
                        obj.end = parseInt(str[2]);
                        obj.id = id;

                        obj.type = str[3];
                        obj.import = [];
                        obj.strand = 1;
                        obj.name = str[0]+'.'+str[1]+'.'+str[3];
                      }
                        if(obj.end-obj.start>=100)track.push(obj);
                  }
                });

                //append tracks to the array of tracks
                track1.items = track;
                tracks.push(track1);

            }
        }
    }
    rawFile.send(null);
}
