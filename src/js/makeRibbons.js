function makeRibbons(){
  //TODO binning data to ribbons
  var ribbons = [];
  var numOfPoints = 180;
  var genLen = 373245519;
  var chrLen = Math.ceil(genLen / numOfPoints);
  for(i=0;i<numOfPoints;i++){
    var ribbon = {};
    ribbon.start= i*chrLen + 1;
    ribbon.end= ribbon.start + chrLen -1;
    ribbon.imports=[];
    ribbons.push(ribbon);
  }
  console.log(ribbons);
}
makeRibbons();
