
function makeRibbons(){
  //TODO binning data to ribbons
  var ribbons = [];
  var numOfPoints = 180;
  var genLen = 373245519;
  var chrLen = Math.ceil(genLen / numOfPoints);
  var file= "data/real/IRIS_313-15897.TRA"
  for(i=0;i<numOfPoints;i++){
    var ribbon = {};
    ribbon.name = "segment "+i;
    ribbon.start= i*chrLen + 1;
    ribbon.end= ribbon.start + chrLen -1;
    ribbon.imports=[];
    ribbons.push(ribbon);
  }
  //console.log(ribbons);

  var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                allText.split("\n").forEach(function(data){
                  if(data!=""){
                    var arr = data.split("\t");
                    var source_start = chromtracks.items[parseInt(arr[0].replace('chr',''))-1].start + parseInt(arr[1]);
                    var target_start = chromtracks.items[parseInt(arr[3].replace('chr',''))-1].start + parseInt(arr[4]);
                    if(!ribbons[Math.floor(source_start/chrLen)].imports.contains(ribbons[Math.floor(target_start/chrLen)].name))ribbons[Math.floor(source_start/chrLen)].imports.push(ribbons[Math.floor(target_start/chrLen)].name);
                  }
                });
                
            }
        }
    }
    rawFile.send(null);

  console.log(ribbons);
  return ribbons;
}
