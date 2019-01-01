
var d3 = require('d3');
var interpolatePath = require('d3-interpolate-path')
const margin = {top: 10, bottom: 25, right: 20, left: 0}
module.exports.lchart = linechart()
const el = d3.select('#weeks-chart')
let width = 0
let height = 0
let chartWidth = 0
let chartHeight = 0
let cut

const parseTime = d3.timeParse("%Y");
const formatTime = d3.timeFormat("'%y");

const x = d3.scaleTime()
    	//.rangeRound([0, width]);

const y = d3.scaleLinear()
	//.rangeRound([height, 0]);

var line = d3.line()
  .x(d => {
  	return x(parseTime(d.date))
  })
  .y(d => {
  	return y(d.incidents)
  })
  .curve(d3.curveCardinal)

function resize() {
  //const width = window.innerWidth > 730 ? document.getElementById('article').clientWidth : window.innerWidth
  const parentContainer = document.getElementById("time-heatmap")
  const width = parentContainer.offsetWidth
  const height = width / 2.5
  module.exports.lchart.width(width).height(height)
  el.call(module.exports.lchart)
}


function linechart() {
  
  function enter({ container, data }) {
  	const svg = container.selectAll('svg').data([data])
    const svgEnter = svg.enter().append('svg').attr("class", "weekssvg")
    const gEnter = svgEnter.append('g')
    gEnter.append("g").attr("class", "lineg")
    gEnter.append("g").attr("class", "dots")
    const xAxis = gEnter.append('g').attr('class', 'xaxis')
    const yAxis = gEnter.append('g').attr("class", 'yaxis')

    yAxis.append('text').attr('class', 'axis__label')
      .attr('transform', `rotate(90)`)
      .text('# of incidents')
  }

  function updateScales({ data }) {  
  	x
  		.domain(d3.extent(data, d => parseTime(d['date'])))
  		.rangeRound([0, chartWidth])

    y
    	.domain([0, d3.max(data, d => d['incidents'])])
    	.rangeRound([chartHeight, 0])
  }

  function updateAxis({ container, data }) {
    const xAxis = container.select(".xaxis")
    const yAxis = container.select(".yaxis")




    xAxis
      .attr("transform", `translate(0, ${chartHeight})`)
      .transition()
      .duration(1000)
      .call(d3.axisBottom(x).ticks(Math.floor(chartWidth/50)).tickFormat(formatTime))
     

    yAxis
      .attr("transform", `translate(${chartWidth}, 0)`)
      .transition()
      .duration(1000)
      .call(d3.axisRight(y).ticks(5))
      
    yAxis.select(".domain")
      .remove()

    yAxis.selectAll(".tick")
      .filter(d => d == 0)
      .remove()

    yAxis.selectAll(".tick line")
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("fill", "none")
      .attr("stroke-dasharray", "4,4")
      .attr("stroke", "#a9a9a9")
      .transition()
      .duration(1000)
      .attr("x1", 0)
      .attr("x2", -chartWidth)

    
    yAxis.selectAll(".tick text")
      .attr("dy", "0")
      .transition()
      .duration(1000)
      .attr("x", 0)
       

    /*yAxis.selectAll(".tick")
       .filter(d => d != 0)
       .select("text")
       .attr("x", 0)
       .attr("dy", 0)

    yAxis.selectAll(".tick")
       .filter(d => d != 0)
       .select("text")
       .attr("x", 0)
       .attr("dy", 0)*/
       



    yAxis.select(".axis__label")
       .attr("x", chartHeight/2)
       .attr("y", -15)

  }

  function updateDom({ container, data }) {
   	const svg = container.select('svg')
  	svg
      .attr('width', width)
      .attr('height', height)

    const g = svg.select('g')

    g.attr('transform', `translate(${margin.left}, ${margin.top})`)

 		const lineg = g.select(".lineg")
    const dots = g.select(".dots")
 		
   	const lineEnter = lineg.selectAll(".weeksline")
   		.data([data])

   	lineEnter
   		.enter()
   		.append("path")
   		.attr("class", "weeksline")
   	.merge(lineEnter)
      //.datum(d => d)
      .transition()
      .duration(1000)
      .attrTween("d", (d, i, nodes) => {
        d.line = nodes[i];
        var previous = d3.select(nodes[i]).attr('d');
        var current = line(d);
        return interpolatePath.interpolatePath(previous, current);
      })

    const dot = dots.selectAll(".week-dot")
    	.data(data)

    dot.exit().remove()
    dot
    	.enter()
    	.append("circle")
    	.attr("class", "week-dot")
    .merge(dot)
    	.attr("x", d => x(d['date']))
    	.attr("y", d => y(d['incidents']))


   }
   function chart(container) {
    const data = container.datum().filter(d => d['station'] == cut && d['date'] != "2018").sort((x, y) => d3.ascending(parseTime(x['date']), parseTime(y['date'])))
    enter({ container, data })
    updateScales({ container, data })
    updateAxis({ container, data })
    updateDom({ container, data })

  }

  chart.width = function(...args) {
    if (!args.length) return width
    width = args[0]
    chartWidth = width - margin.left - margin.right
  

    return chart
  }

  chart.height = function(...args) {
    if (!args.length) return height
    height = args[0]
    chartHeight = height - margin.top - margin.bottom
    return chart
  }

  chart.cut = function(...args) {
    if (!args.length) return cut
    cut = args[0]
    return chart
  }

  return chart
}

function init() {
	el.datum(time_data)
  module.exports.lchart.cut("all")
  resize()
  window.addEventListener('resize', resize)
}

init()