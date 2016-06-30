(function(){
track = [];
readFile("data/real/IRIS_313-15897.DEL", track);
function readFile(file ,track){
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
                  if(data != ""){
                      var obj = {}
                      var str = data.split("\t");
                      for(i=0;i<str.length;i++){
                        obj.chr = parseInt(str[0].replace('chr',''));
                        obj.start = parseInt(str[1]);
                        obj.end = parseInt(str[2]);

                        obj.type = str[3];
                        obj.import = [];
                        obj.strand = 1;
                        obj.name = str[0]+'.'+str[1]+'.'+str[3];
                      }
                        track.push(obj);
                  }
                });
                console.log(track[0]);
            }
        }
    }
    rawFile.send(null);
}
return track;
})();
