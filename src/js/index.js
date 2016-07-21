var addedLayer = false;

function addLayer(){
  addedLayer = true;
  var newtrack = JSON.parse(JSON.stringify(track1));
  tracks.splice(tracks.length-1,0,newtrack);
  var newtrack2 = JSON.parse(JSON.stringify(track1));
  tracks.splice(tracks.length-1,0,newtrack2);
  console.log("Add layer clicked!");
  h = 720;
  rx = w / 2 -15;
  ry = h / 2;
  render();
}
