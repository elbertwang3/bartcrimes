
const d3 = require('d3');
const L = require('leaflet');
var moment = require('moment');
const chroma = require('chroma-js');
const d3legend = require('d3-svg-legend');
var timeheatmap = require('./timeheatmap');
var linechart = require('./weeks');


console.log(d3legend)

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
const mobile = window.mobilecheck()


const heatmap = d3.select('#time-heatmap')
const weekschart = d3.select('#weeks-chart')
const input = document.getElementById("myinput")

const when = d3.select(".when")
const overtime = d3.select(".overtime")
// restrict panning outside of California
var max_zoom_deg = 15;
var min_zoom_deg = 10;
//const voronoiRadius = 100;
/*var corner1 = L.latLng(38.117916, -122.967946),
corner2 = L.latLng(37.443776, -121.403753),
bounds = L.latLngBounds(corner1, corner2);*/

// initialize map with center position and zoom levels
module.exports.map = L.map("map-leaflet", {
	center: [37.78, -122.41],
	zoom: 10.25,
	zoomSnap: 0,
  minZoom: min_zoom_deg,
  maxZoom: max_zoom_deg,
  //maxBounds: bounds,
  scrollWheelZoom: false,
});

module.exports.map.zoomControl.setPosition('topright');

L.svg().addTo(module.exports.map)

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(module.exports.map)

/*L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map)*/

var crimetypes = ['Auto Theft/Burglary',
'Bicycle Theft',
'Grand Theft/Pickpocket',
'Assault/Battery',
'Robbery',
'Weapon Involved',
'Narcotics',
'Public Intoxication',  
'Sex Crime',
'Vandalism',
'Trespassing',
'Kidnapping',
'Homicide']

/*var crimetypecounts = [{type: 'Auto Theft/Burglary' , count: d['autothefts']},
	{type: 'Bicycle Theft' , count: d['bicyclethefts']},
	{type: 'Grand Theft/Pickpocket' , count: d['grandthefts']},
	{type: 'Assault/Battery' , count: d['assaults']},
	{type: 'Robbery' , count: d['robberies']},
	{type: 'Weapon Involved' , count: d['weapons']},
	{type: 'Narcotics' , count: d['narcotics']},
	{type: 'Public Intoxication' , count: d['intoxications']},
	{type: 'Sex Crime' , count: d['sexcrimes']},
	{type: 'Vandalism' , count: d['vandalisms']},
	{type: 'Trespassing' , count: d['trespassings']},
	{type: 'Kidnapping' , count: d['kidnappings']},
	{type: 'Homicide' , count: d['homicides']}]*/

var volumetooltip = d3.select("#map-leaflet")
	.append("div")
	.attr("class","volumetooltip")
	//.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
	.on("click",function(){
	  volumetooltip.style("visibility","hidden");
});

volumetooltip.append("div")
	.attr("class", "tooltip-header")
volumetooltip.append("div")
	.attr("class", "avg-weekday-exits")
volumetooltip.append("div")
	.attr("class", "tooltip-description")
volumetooltip.append("div")
	.attr("class", "crimesbytype-header")
	.text("Crimes by type")


var tableheaders = volumetooltip.append("div")
	.attr("class", "table-headers")
tableheaders.selectAll(".table-header")
	.data(["Type", "Count", "Rank"])
	.enter()
	.append("div")
	.attr("class", d => `table-header ${d.toLowerCase()}`)
	.text(d => d)


var typetable = volumetooltip.append("div")
.attr("class", "type-table")

var tablerow = typetable.selectAll(".table-row")
	.data(crimetypes)
	.enter()
	.append("div")
	.attr("class", "table-row")

tablerow.append("div")
.attr("class", "table-type")

tablerow.append("div")
.attr("class", "table-count")

tablerow.append("div")
.attr("class", "table-rank")

//tablerow.append()


var typetable = volumetooltip.append("div")
	.attr("class", "crimesbytype-table")

var tablerow = typetable.selectAll("div")
	.data(crimetypes)
	.enter()
	.append("div")
	.attr("class", "table-row")

tablerow.append("div")
	.attr("class", "type-column column")

tablerow.append("div")
	.attr("class", "count-column column")

tablerow.append("div")
	.attr("class", "rank-column column")

var dateFetched = moment('2018-07-25')
counts = groupbystations_data.map(d => d['Count_Star']).sort((a,b) => b-a)
autothefts = groupbystations_data.map(d => d['autothefts']).sort((a,b) => b-a)
bicyclethefts = groupbystations_data.map(d => d['bicyclethefts']).sort((a,b) => b-a)
grandthefts = groupbystations_data.map(d => d['grandthefts']).sort((a,b) => b-a)
assaults = groupbystations_data.map(d => d['assaults']).sort((a,b) => b-a)
robberies = groupbystations_data.map(d => d['robberies']).sort((a,b) => b-a)
weapons = groupbystations_data.map(d => d['weapons']).sort((a,b) => b-a)
narcotics = groupbystations_data.map(d => d['narcotics']).sort((a,b) => b-a)
intoxications = groupbystations_data.map(d => d['intoxications']).sort((a,b) => b-a)
sexcrimes = groupbystations_data.map(d => d['sexcrimes']).sort((a,b) => b-a)
vandalisms = groupbystations_data.map(d => d['vandalisms']).sort((a,b) => b-a)
trespassings = groupbystations_data.map(d => d['trespassings']).sort((a,b) => b-a)
kidnappings = groupbystations_data.map(d => d['kidnappings']).sort((a,b) => b-a)
homicides = groupbystations_data.map(d => d['homicides']).sort((a,b) => b-a)

groupbystations_data.map(d => {
	/*var dateStationOpened = moment.max(moment('2006-03-01'),moment(d['date']))
	dayDiff = dateFetched.diff(dateStationOpened)
	d['daysopen'] = Math.ceil(dayDiff/86400000)
	d['crimesperdaysopen'] = d['Count_Star'] / d['daysopen']*/
	d['countsrank'] = counts.lastIndexOf(d['Count_Star']) + 1
	d['autotheftsrank'] = autothefts.lastIndexOf(d['autothefts']) + 1
	d['bicycletheftsrank'] = bicyclethefts.lastIndexOf(d['bicyclethefts']) + 1
	d['grandtheftsrank'] = grandthefts.lastIndexOf(d['grandthefts']) + 1
	d['assaultsrank'] = assaults.lastIndexOf(d['assaults']) + 1
	d['robberiesrank'] = robberies.lastIndexOf(d['robberies']) + 1
	d['weaponsrank'] = weapons.lastIndexOf(d['weapons']) + 1
	d['narcoticsrank'] = narcotics.lastIndexOf(d['narcotics']) + 1
	d['intoxicationsrank'] = intoxications.lastIndexOf(d['intoxications']) + 1
	d['sexcrimesrank'] = sexcrimes.lastIndexOf(d['sexcrimes']) + 1
	d['vandalismsrank'] = vandalisms.lastIndexOf(d['vandalisms']) + 1
	d['trespassingsrank'] = trespassings.lastIndexOf(d['trespassings']) + 1
	d['kidnappingsrank'] = kidnappings.lastIndexOf(d['kidnappings']) + 1
	d['homicidesrank'] = homicides.lastIndexOf(d['homicides']) + 1
	return d
})
/*groupbystations_data.sort(function(x, y){
   return d3.ascending(x['crimesperdaysopen'], y['crimesperdaysopen']);
})
console.log(groupbystations_data)*/

const maxCount = d3.max(groupbystations_data, d => d.Count_Star)
let colorScale = chroma.scale('OrRd').domain([0,maxCount])
var volumeScale = d3.scaleSqrt()
	.domain([0,maxCount])
	.range([1, 40])
//let volumeScale = chroma.scale('OrRd').domain([0,maxCount])
//let circleSize = 15


var rankColorScale = d3.scaleLinear()
	.domain([1,24,48])
	.range(['#d73027', '#b8b8b8', '#1a9850'])

var formatNumber = d3.format(",")

var svg = d3.select("#map-leaflet")
	.select("svg")


var g = svg.append("g");

var volumes = g.append("g")
	.attr("class", "volumes")


/*const voronoiDiagram = d3.voronoi()
          .x(d => map.latLngToLayerPoint([d.latitude, d.longitude]).x))
          .y(d => map.latLngToLayerPoint([d.latitude, d.longitude]).y)
          .size([window.innerWidth, window.innerHeight])(groupbystations_data);*/
var volumeg = volumes.selectAll("volume-g")
	.data(groupbystations_data)
	.enter()
	.append("g")
	//.attr("transform", d => `translate(${projection([d['longitude'], d['latitude']])[0]}, ${projection([d['longitude'], d['latitude']])[1]})`)



var volumeCircle = volumeg
	.append("circle")
	.attr("class", "volume-circle")
	.attr("r", d => volumeScale(d['Count_Star']))
	//.attr("fill", d => colorScale(d['Count_Star']))
	//.attr("stroke", d => d3.color(colorScale(d['Count_Star'])).darker(1))
	.on('click', d => {
		input.value = d['station_name']
		timeheatmap.chart.cut(d['station_name'])
		heatmap.call(timeheatmap.chart)
		when.text(`When do crimes occur at ${d['station_name']}?`)
		linechart.lchart.cut(d['station_name'])
		weekschart.call(linechart.lchart)
		overtime.text(`Has crime decreased at ${d['station_name']}?`)
	})
  .on('mousemove', d => mouseMoveHandler(d))
  .on('mouseout', () => {
    // hide the highlight circle when the mouse leaves the chart
    volumetooltip.style("visibility", "hidden")
  });

function mouseMoveHandler(d) {

	var crimetypecounts = [{type: 'Auto Theft/Burglary', count: d['autothefts'], rank: d['autotheftsrank']},
	{type: 'Bicycle Theft', count: d['bicyclethefts'], rank: d['bicycletheftsrank']},
	{type: 'Grand Theft/Pickpocket', count: d['grandthefts'], rank: d['grandtheftsrank']},
	{type: 'Assault/Battery', count: d['assaults'], rank: d['assaultsrank']},
	{type: 'Robbery', count: d['robberies'], rank: d['robberiesrank']},
	{type: 'Weapon Involved', count: d['weapons'], rank: d['weaponsrank']},
	{type: 'Narcotics', count: d['narcotics'], rank: d['narcoticsrank']},
	{type: 'Public Intoxication', count: d['intoxications'], rank: d['intoxicationsrank']},
	{type: 'Sex Crime', count: d['sexcrimes'], rank: d['sexcrimesrank']},
	{type: 'Vandalism', count: d['vandalisms'], rank: d['vandalismsrank']},
	{type: 'Trespassing', count: d['trespassings'], rank: d['trespassingsrank']},
	{type: 'Kidnapping', count: d['kidnappings'], rank: d['kidnappingsrank']},
	{type: 'Homicide', count: d['homicides'], rank: d['homicidesrank']}]

	crimetypecounts.sort(function(x, y){
   return d3.descending(x['count'], y['count']);
	})

	volumetooltip
		.style("visibility", "visible")
		.style("top", () => {
			tooltipheight = volumetooltip.node().getBoundingClientRect().height
			bottomcutoff = window.innerHeight - tooltipheight/2 - 20
			topcutoff = tooltipheight/2 + 20
		  if (d3.event.clientY <= bottomcutoff && d3.event.clientY >= topcutoff) {
        return (d3.event.clientY - tooltipheight/2) + "px"
      } else if (d3.event.clientY > bottomcutoff) {
      	return (d3.event.clientY - tooltipheight) + "px"
      } else {
        return (d3.event.clientY) + "px"
      } 
		})
		.style("left", () => {
			tooltipwidth = volumetooltip.node().getBoundingClientRect().width
			if (mobile || window.innerWidth <= 600) {
        const offset = (window.innerWidth - tooltipwidth)/2
        console.log(offset)
        return offset + "px"

      } else {
        if (d3.event.clientX + tooltipwidth + 30 >= window.innerWidth) {
          return (d3.event.clientX - tooltipwidth - 30) +"px"
        } else {
          return (d3.event.clientX + 30) +"px"
        }
      }
			
		})





//sortbycount
    				

  volumetooltip.select(".tooltip-header")
  	.text(d['name'])

  volumetooltip.select(".avg-weekday-exits")
  	.text(`Average weekday ridership by exits: ${formatNumber(d['avgweekdayridership'])} passengers`)


  volumetooltip.select(".tooltip-description")
  	.text(() => moment(d['date']).isBefore(moment('2006-03-01')) ? `${formatNumber(d['Count_Star'])} (${ordinal(d['countsrank'])}) incidents have taken place at ${d['name']} station since BART Crimes began recording crimes on March 1, 2006.` : `${d['Count_Star']} incidents have taken place at ${d['name']} station since it opened on ${d['date']}.`)

  tablerowEnter = typetable.selectAll(".table-row")
  	.data(crimetypecounts)

  tablerow = tablerowEnter
  	.enter()
  	.append("div")
  .merge(tablerow)

 	tablerow.select(".type-column")
 		.text(d => {
 			return d['type']
 		})

 	tablerow.select(".count-column")
 		.text(d => {
 			return d['count']
 		})
 	tablerow.select(".rank-column")
 		.text(d => `${ordinal(d['rank'])}/48`)
 		.style("color", d => rankColorScale(d['rank']))

}



/*volumeg
	.append("text")
	.attr("class", "volume-text")
	.text(d => d['name'])*/

function update() {
  volumeCircle
  	.attr("cx", d => module.exports.map.latLngToLayerPoint([d.latitude, d.longitude]).x)
  	.attr("cy", d => module.exports.map.latLngToLayerPoint([d.latitude, d.longitude]).y)
  	//.attr("r",function(d) { return (volumeScale(d['Count_Star'])/window.innerWidth)*Math.pow(2, module.exports.map.getZoom())})
}

module.exports.map.on("viewreset", update);
module.exports.map.on("zoom",update);
update();
/*var width = window.innerWidth,
    height = 1200;
    margin = {top: 50, right: 25, bottom: 25, left: 25},
    chartWidth = width - margin.left - margin.right
    chartHeight = height - margin.top - margin.bottom

var moveRoutes = [[3,3],[4,-3],[0,6],[0,0],[8,6],[0,0]];
var trackColors = ['#FCCC0A', '#FF6319', '#00933C', '#EE352E', '#0039A6', '#A7A9AC']
//order = [antioch, fremont/rich, fremont/dalycity, richmond/millbrae, dub/daly city, oakland airport]
//colors = [yellow, orange,green,red,blue,,grey]

// red D2000F MTA #EE352E
// blue2B309C #0039A6
// yello FFAF22 #FCCC0A
// orange FF5400 #FF6319
// green 00AA4E #00933C

console.log(stations_data)
console.log(incidents_data)
console.log(tracks_geo)
console.log(stations_geo)
console.log(groupbystations_data)
var svg = d3.select(".volumemap").append("svg")
					.attr("width",width)
					.attr("height",height)

var g = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`)

var path = d3.geoPath()
	//.interpolate(d3.curveBasis);

var projection = d3.geoAlbers().parallels([34, 40.5]).rotate([120, 0]).fitExtent([[0,0], [chartWidth, chartHeight]], tracks_geo)
path.projection(projection)

const maxCount = d3.max(groupbystations_data, d => d.Count_Star)
var volumeScale = d3.scaleSqrt()
	.domain([0,maxCount])
	.range([1, 50])






var tracks = g.append("g")
   .attr("class", "tracks")

tracks
  .selectAll("path")
  .data(tracks_geo.features)
  .enter()
  .append("path")
  .attr("class", "track")
  .attr("transform",(d, i) => {
  	console.log(i)
  	console.log(moveRoutes[i])
  	return "translate(" + moveRoutes[i][0] + "," + moveRoutes[i][1] + ")"
  })
  .attr("d", path)
  .attr("stroke", (d, i) => trackColors[i])


var volumes = g.append("g")
	.attr("class", "volumes")

var volumeg = volumes.selectAll("volume-g")
	.data(groupbystations_data)
	.enter()
	.append("g")
	.attr("transform", d => `translate(${projection([d['longitude'], d['latitude']])[0]}, ${projection([d['longitude'], d['latitude']])[1]})`)

volumeg
	.append("circle")
	.attr("class", "volume-circle")
	.attr("r", d => volumeScale(d.Count_Star))

volumeg
	.append("text")
	.attr("class", "volume-text")
	.text(d => d['name'])

g.append("g")
  .attr("class", "legendSize")
  .attr("transform", "translate(20, 40)");

var legendSize = d3.legendSize()
  .scale(volumeScale)
  .shape('circle')
  .shapePadding(15)
  .labelOffset(20)
  .orient('horizontal');

svg.select(".legendSize")
  .call(legendSize);*/

function ordinal(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
















