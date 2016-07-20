// Program description: Retrieves data for TRA transactions


function makeRibbons(){
  var ribbons = []; //3733
  var numOfPoints = 374;
  var genLen = 373245519;
  var chrLen = Math.ceil(genLen / numOfPoints);
  var value = $("#trackName").val()
  var file= "http://oryzasnp.org/iric-portal-static/tra/"+mappingTRAfile[value];
  console.log(value);
  console.log(file);
    //bin creation
  for(i=0;i<numOfPoints;i++){
    var ribbon = {};
    ribbon.name = "segment"+i;
    ribbon.start= i*chrLen + 1;
    ribbon.end= ribbon.start + chrLen -1;
    ribbon.imports=[];
    ribbon.source=[];
    ribbon.details=[];
    ribbon.type=[];
    ribbons.push(ribbon);
  }

  var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                Math.floor((Math.random() * 1000) + 1);
                var allText = rawFile.responseText;
                allText.split("\n").forEach(function(data){
                  if(data!=""){ //parsing
                    var arr = data.split("\t");
                    var source_start = chromtracks.items[parseInt(arr[0].replace('chr',''))-1].start + parseInt(arr[1]);
                    var target_start = chromtracks.items[parseInt(arr[3].replace('chr',''))-1].start + parseInt(arr[4]);
                    ribbons[Math.floor(source_start/chrLen)].imports.push(ribbons[Math.floor(target_start/chrLen)].name);
                    ribbons[Math.floor(target_start/chrLen)].source.push(ribbons[Math.floor(source_start/chrLen)].name);
                    ribbons[Math.floor(source_start/chrLen)].type.push(arr[6].toLowerCase());

                    //this is obtained for translocation details
                    var obj = {
                      fromChr: parseInt(arr[0].replace('chr','')),
                      fromStart: parseInt(arr[1]),
                      fromEnd: parseInt(arr[2]),
                      toChr: parseInt(arr[3].replace('chr','')),
                      toStart: parseInt(arr[4]),
                      toEnd: parseInt(arr[5]),
                      type: arr[6].toLowerCase(),
                      segmentFrom: "segment"+Math.floor(source_start/chrLen),
                      segmentTo: "segment"+Math.floor(target_start/chrLen)
                    }
                    obj.class = "red";
                    ribbons[Math.floor(source_start/chrLen)].details.push(obj);
                    var obj2 = JSON.parse(JSON.stringify(obj));
                    obj2.class = "green"
                    ribbons[Math.floor(target_start/chrLen)].details.push(obj2);

                  }
                });

            }
        }
    }
    rawFile.send(null);

  // console.log(ribbons);
  return ribbons;
}


//the next part are partly lifted from
//https://bl.ocks.org/mbostock/7607999
//only modified for program use

 var ribbons = makeRibbons();
    var w = 900,
    h = 820,
    rx = w / 2 -15,
    ry = h / 2,
    m0,
    rotate = 0;

    var splines = [];

    var cluster = d3.layout.cluster()
    .size([360, ry - 120])

    var bundle = d3.layout.bundle();

    var line = d3.svg.line.radial()
    .interpolate("bundle")
    .tension(.80)
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

    var svg = d3.select("svg#circularchart_svg").append("svg:svg")
    .attr("top", "140px")
    .attr("width", w)
    .attr("height", w)
    .append("svg:g")
    .attr("transform", "translate(" + rx + "," + (ry+20) + ")");

    svg.append("svg:path")
    .attr("class", "arc")
    .attr("d", d3.svg.arc().outerRadius(ry - 120).innerRadius(0).startAngle(0).endAngle(2 * Math.PI))
    //.on("mousedown", mousedown);

    var nodes = cluster.nodes(packages.root(ribbons)),
      links = packages.imports(nodes),
      splines = bundle(links);
      console.log(splines);
    var path = svg.selectAll("path.link")
      .data(links)
      .enter().append("svg:path")
      .attr("class", function(d) {
        var flagDUP=0, flagTRA=0;
        for(i=0;i<d.source.imports.length;i++){
          if(d.source.imports[i] == d.target.key){
            if(d.source.type[i] == "dup"){
              flagDUP = 1;
            }
            else flagTRA = 1;
          }
        }
        var className
        if(flagDUP == 1 && flagTRA == 1) className = "dup_tra";
        else if (flagDUP == 1) className = "dup";
        else if (flagTRA == 1) className = "tra"

        return "link source-" + d.source.key + " target-" + d.target.key +" "+className;
      })
      .attr("d", function(d, i) { return line(splines[i]); })
      .on("mouseover", function(d){
          this.classed("target", true);
      });

    svg.selectAll("g.node")
      .data(nodes.filter(function(n) { return !n.children; }))
    .enter().append("svg:g")
      .attr("class", "node")
      .attr("id", function(d) { return "node-" + d.key; })
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
    .append("svg:text")
      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
      .text(function(d) { return "........."; })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    d3.select("input[type=range]").on("change", function() {
    line.tension(this.value / 100);
    path.attr("d", function(d, i) { return line(splines[i]); });
    });

    // d3.select(window)
    // .on("mousemove", mousemove)

    function mouse(e) {
    return [e.pageX - rx, e.pageY - ry];
    }

    function mousemove() {
    if (m0) {
    var m1 = mouse(d3.event),
        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;
    div.style("-webkit-transform", "translateY(" + (ry - rx) + "px)rotateZ(" + dm + "deg)translateY(" + (rx - ry) + "px)");
    }
    }

    function mouseup() {
    if (m0) {
    var m1 = mouse(d3.event),
        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;

    rotate += dm;
    if (rotate > 360) rotate -= 360;
    else if (rotate < 0) rotate += 360;
    m0 = null;

    div.style("-webkit-transform", null);

    svg
        .attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
      .selectAll("g.node text")
        .attr("dx", function(d) { return (d.x + rotate) % 360 < 180 ? 8 : -8; })
        .attr("text-anchor", function(d) { return (d.x + rotate) % 360 < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return (d.x + rotate) % 360 < 180 ? null : "rotate(180)"; });
    }
    }

    function mouseover(d) {
    svg.selectAll("path.link.target-" + d.key)
      .classed("target", true)
      .each(updateNodes("source", true));

    svg.selectAll("path.link.source-" + d.key)
      .classed("source", true)
      .each(updateNodes("target", true));


    document.getElementById("info").innerHTML = d.key + "</br>Start: " + d.start + "</br>End: "+ d.end;

      $("#detailsTable tr").remove();
      d.details.forEach(function(det){
        var tr = document.createElement('tr');
        tr.className = det.class == "red" ? "trred" : "trgreen";
        var type = document.createElement('td');
        type.innerHTML = det.type.toUpperCase();
        var ch1 = document.createElement('td');
        ch1.innerHTML = 'Chr'+det.fromChr;
        var s1 = document.createElement('td');
        s1.innerHTML = det.fromStart;
        var e1 = document.createElement('td');
        e1.innerHTML = det.fromEnd;
        var ch2 = document.createElement('td');
        ch2.innerHTML = 'Chr'+det.toChr;
        var s2 = document.createElement('td');
        s2.innerHTML =det.toStart;
        var e2 = document.createElement('td');
        e2.innerHTML =det.fromStart;
        tr.appendChild(type);
        tr.appendChild(ch1);
        tr.appendChild(s1);
        tr.appendChild(e1);
        tr.appendChild(ch2);
        tr.appendChild(s2);
        tr.appendChild(e2);
        document.getElementById("detailsTable").appendChild(tr);
      })
    }

    function mouseout(d) {
    svg.selectAll("path.link.source-" + d.key)
      .classed("source", false)
      .each(updateNodes("target", false));

    svg.selectAll("path.link.target-" + d.key)
      .classed("target", false)
      .each(updateNodes("source", false));
    }

    function updateNodes(name, value) {
    return function(d) {
    if (value) this.parentNode.appendChild(this);
    svg.select("#node-" + d[name].key).classed(name, value);
    };
    }

    function cross(a, b) {
    return a[0] * b[1] - a[1] * b[0];
    }

    function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
    }
