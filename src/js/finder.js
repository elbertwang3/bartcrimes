var timeheatmap = require('./timeheatmap');
var linechart = require('./weeks');
const d3 = require('d3');
var awesomplete = require('./awesomplete')


const heatmap = d3.select('#time-heatmap')
const weekschart = d3.select('#weeks-chart')
const when = d3.select(".when")
const overtime = d3.select(".overtime")
const input = document.getElementById('myinput')
const stations = stations_data.map(d => d['name'])

new Awesomplete(input, { list: stations })


document.getElementById('myinput').addEventListener("awesomplete-select", function(event) {

 	const station = event.text.label
 	timeheatmap.chart.cut(station)
	heatmap.call(timeheatmap.chart)
	when.text(`When do crimes occur at ${station}?`)
	linechart.lchart.cut(station)
	weekschart.call(linechart.lchart)
	overtime.text(`Have crimes decreased at ${station}?`)

 	
 })

 $("#myinput").on('keyup', function (e) {
  if (e.keyCode == 8) {
  	timeheatmap.chart.cut("all")
		heatmap.call(timeheatmap.chart)
		when.text(`When do crimes occur?`)
		linechart.lchart.cut("all")
		weekschart.call(linechart.lchart)
		overtime.text(`Has crime decreased over time?`)
	}
})
