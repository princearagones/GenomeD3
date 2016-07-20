var trackMap = {
	tracks : [
		{
			name: "IRIS_313-15897",
			value: "msu7indelsv2",
			instrack: "msu7indelsv2",
			deltrack: "msu7snpsv2",
			invtrack: "snp3k",
			traduptrack: "tra1.txt"
		},
		{
			name: "Nipponbare SNPs v2",
			instrack: "msu7snpsv2",
			deltrack: "snp3k",
			invtrack: "msu7indelsv2",
			traduptrack: "tra2.txt"
		},
		{
			name: "3k Genomes Core SNPs v1",
			instrack: "snp3k",
			deltrack: "msu7indelsv2",
			invtrack: "msu7snpsv2",
			traduptrack: "tra3.txt"
		}
	]
};

var mappingCircleName = {};
var mappingTRAfile = {};
var mappingTracks = {}

trackMap.tracks.forEach(function(tr){
	mappingCircleName[tr.instrack] = tr.name;
	mappingTRAfile[tr.name] = tr.traduptrack;

	mappingTracks[tr.name] = [tr.instrack,tr.deltrack,tr.invtrack]

	
	var option = document.createElement("option")
	option.value = tr.name;
	option.innerHTML = tr.name;
	document.getElementById("trackName").appendChild(option);
})



