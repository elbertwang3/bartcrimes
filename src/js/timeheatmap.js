const d3 = require('d3');
const colorbrewer = require('colorbrewer');
const chroma = require('chroma-js');

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
const mobile = window.mobilecheck()
const margin = {top: 75, bottom: 10, right: 20, left: 0}
const outerLeftPadding = 20
module.exports.chart = heatmap()
const el = d3.select('#time-heatmap')
let width = 0
let height = 0
let chartWidth = 0
let chartHeight = 0
let gridSize = 0
let offset = 0
let legendElementWidth = 0
let cut
let colorScale = chroma.scale('OrRd')

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
const daysfull = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const times = ["6a", "9a",  "12p",  "3p",  "6p",  "9p",  "12a",  "3a"]
const timesfull = ["12:00-12:59 am", "1:00-1:59 am", "2:00-2:59 am", "3:00-3:59 am", "4:00-4:59 am", "5:00-5:59 am", "6:00-6:59 am", "7:00-7:59 am", "8:00-8:59 am", "9:00-9:59 am", "10:00-10:59 am", "11:00-11:59 am", "12:00-12:59 pm", "1:00-1:59 pm", "2:00-2:59 pm", "3:00-3:59 pm", "4:00-4:59 pm", "5:00-5:59 pm", "6:00-6:59 pm", "7:00-7:59 pm", "8:00-8:59 pm", "9:00-9:59 pm", "10:00-10:59 pm", "11:00-11:59 pm"]
    //datasets = ["timeparsed.csv"];

var heattooltip = d3.select("#time-heatmap")
  .append("div")
  .attr("class","heat-tooltip")
  //.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
  .on("click",function(){
    heattooltip.style("visibility", "hidden")
});

heattooltip.append("div")
  .attr("class", "heattooltip-header")

heattooltip.append("div")
  .attr("class", "incidents")

function resize() {
  //const width = window.innerWidth > 730 ? document.getElementById('article').clientWidth : window.innerWidth
  const parentContainer = document.getElementById("time-heatmap")
  const width = parentContainer.offsetWidth
  const height = ((width - margin.left - margin.right) * 7 / 24) + margin.top + margin.bottom
  module.exports.chart.width(width).height(height)
  el.call(module.exports.chart)
}

function heatmap() {
  
  function enter({ container, data }) {
    const svg = container.selectAll('svg').data([data])
    const svgEnter = svg.enter().append('svg').attr("class", "heatmapsvg")
    const gEnter = svgEnter.append('g')
    gEnter.append("g").attr("class", "daylabels-container")
    gEnter.append("g").attr("class", "timelabels-container")
    gEnter.append("g").attr("class", "cards")
    svgEnter.append("g").attr("class", "legend")




  }
  function updateLabels({ container, data }) {
    const g = container.select('svg').select('g')
    const dayLabels = g.select(".daylabels-container")
    const timeLabels = g.select(".timelabels-container")
    
    const dayLabel = dayLabels.selectAll(".dayLabel")
      .data(days)

    dayLabel
      .enter()
      .append("text")
      .attr("class", "dayLabel")
    .merge(dayLabel)
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", (d, i) => i * gridSize)
      .attr("transform", `translate(${chartWidth + 4}, ${gridSize / 1.5})`)
      .attr("class", (d, i) => ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"));

    const timeLabel = timeLabels.selectAll(".timeLabel")
      .data(times)

    timeLabel
      .enter()
      .append("text")
    .merge(timeLabel)
      .text((d) => d)
      .attr("x", (d, i) => i * 3 * gridSize)
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", `translate(${gridSize / 2}, -6)`)
      .attr("class", (d, i) => ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"));
  }
  function updateScales({ container, data }) {  
    let scaleDomain
    const timeMax = d3.max(time_stations_data.filter(d => d['station'] != "all"), d => d.value)
    console.log(timeMax)
    if (cut == "all") {
      scaleDomain = [0, 50, 100, 150, 200, 250, 300, 350]
      colorScale.domain([1, 350])
      offset = 25
    } else {
      scaleDomain = [0, 5, 10, 15, 20, 25]
      colorScale.domain([1, 25])
      offset = 2.5
    }
    const rectWidth = chartWidth * 0.9 / scaleDomain.length
    const rectHeight = 10
    const svg = container.select('svg')
    const legend = svg.select(".legend")
    const legendRect = legend.selectAll(".legend-rect")
      .data(scaleDomain)

    legendRect.exit().remove()

    legendRect
      .enter()
      .append("rect")
      .attr("class", "legend-rect")
    .merge(legendRect)  
      .attr("x", (d, i) => i * rectWidth)
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("fill", d => d == 0 ? "#f5f5f5" : colorScale(d - offset))

    const tickg = legend.selectAll(".tick-g")
      .data(scaleDomain.slice(0, -1))

    tickg.exit().remove()

    const tickGEnter = tickg
      .enter()
      .append("g")
      .attr("class", "tick-g")
    .merge(tickg)
      .attr("transform", (d, i) => `translate(${(i+1)*rectWidth}, 0)`)

    const tickLine = tickGEnter.selectAll(".tick-line")
      .data(d => [d])

    tickLine.exit().remove()

    tickLine
      .enter()
      .append("line")
      .attr("class", "tick-line")
    .merge(tickLine)
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", (d, i) => 0)
      .attr("y2", (d, i) => rectHeight * 2)

    const tickText = tickGEnter.selectAll(".legend-text")
      .data(d => [d])

    tickText.exit().remove()

    tickText
      .enter()
      .append("text")
      .attr("class", "legend-text")
    .merge(tickText)
      .attr("x", 0)
      .attr("y", rectHeight * 2.75)
      .text(d => d)

     const legendAnno = svg.selectAll(".legend-anno")
      .data([[scaleDomain]])

    legendAnno
      .enter()
      .append("text")
      .attr("class", "legend-anno")
    .merge(legendAnno)
      .text("incidents")
      .attr("x", chartWidth * 0.9 + 2.5)
      .attr("y", margin.top*1/5)
    
    legend.attr("transform", `translate(${0}, ${margin.top*1/10})`)


    
  }

  function updateDom({ container, data }) {
    
    const svg = container.select('svg')
    svg
      .attr('width', width)
      .attr('height', height)

    const g = svg.select('g')

    g.attr('transform', `translate(${margin.left}, ${margin.top})`)

    
    const cards = g.select(".cards")

    const card = cards.selectAll(".hour")
      .data(data, (d) => d.day+':'+d.hour);

    /*card
      .exit()
      .remove()*/

    card
      .exit()
      .attr("x", (d) => d.hour >= 6 ? (d.hour - 1 - 5) * gridSize : (d.hour - 1 + 19) * gridSize)
      .attr("y", (d) => (d.day - 1) * gridSize)
      .attr("width", gridSize)
      .attr("height", gridSize)
      .on("mousemove", function(d) {
         mouseMoveHandler(d, "exit")
      })
      .transition()
      .duration(1000)
      .attr("fill", "#f5f5f5")
      

    card
      .enter()
      .append("rect")
      .attr("class", "hour bordered")
      .attr("fill", (d) => colorScale(0))
    .merge(card)
      .attr("x", (d) => d.hour >= 6 ? (d.hour - 1 - 5) * gridSize : (d.hour - 1 + 19) * gridSize)
      .attr("y", (d) => (d.day - 1) * gridSize)
      .attr("rx", gridSize/7)
      .attr("ry", gridSize/7)
      .attr("class", "hour bordered")
      .attr("width", gridSize)
      .attr("height", gridSize)
      .on("mouseover", function(d) {
         d3.select(this).moveToFront()
      })
      .on("mousemove", function(d) {
    
        mouseMoveHandler(d, "enter")

      })
      .on('mouseout', () => {
        // hide the highlight circle when the mouse leaves the chart
        heattooltip.style("visibility", "hidden")

      })
      .transition()
      .duration(1000)
      .attr("fill", (d) => colorScale(d.value))

   
     

  }
  function mouseMoveHandler(d, selection) {
    heattooltip
      .style("visibility", "visible")
      .style("top", () => {
        tooltipheight = heattooltip.node().getBoundingClientRect().height
        const overlayContainer = document.getElementById("map-overlay").getBoundingClientRect()
        const scrollTop = document.getElementById("map-overlay").scrollTop
        
        /*if (d3.event.pageY <= bottomcutoff && d3.event.pageY >= topcutoff) {
          return (d3.event.pageY - tooltipheight/2) + "px"
        } else if (d3.event.pageY > bottomcutoff) {
          return (d3.event.pageY - tooltipheight) + "px"
        } else {*/
        return (d3.event.clientY + scrollTop) + "px"
        //} 
      })
      .style("left", () => {
        tooltipwidth = heattooltip.node().getBoundingClientRect().width
        const overlayContainer = document.getElementById("map-overlay").getBoundingClientRect()
        const rightcutoff = overlayContainer.right - tooltipwidth/2 - 20 - outerLeftPadding/2
        const leftcutoff = tooltipwidth/2 + 20 + outerLeftPadding/2
        if (mobile || window.innerWidth <= 600) {
          const offset = (window.innerWidth - tooltipwidth)/2
          return offset + "px"

        } else {
         if (d3.event.clientX <= rightcutoff && d3.event.clientX >= leftcutoff) {
             return (d3.event.clientX - tooltipwidth/2 - outerLeftPadding) + "px"
          } else if (d3.event.clientX > rightcutoff) {
            return (d3.event.clientX - tooltipwidth - 10 - outerLeftPadding) +"px"
          } else {
            return (d3.event.clientX + 10 - outerLeftPadding) +"px"
          }
        }
      })

    heattooltip.select(".heattooltip-header")
      .text(cut == "all" ? "" : `${cut}`)


    heattooltip.select(".incidents")
      .text(selection == "enter" ? `${d['value']} incidents have taken place on ${daysfull[d['day']-1]}s between  ${timesfull[d['hour']]}` 
                                    : `0 incidents have taken place on ${daysfull[d['day']-1]}s between  ${timesfull[d['hour']]}`)
  } 

  function chart(container) {
    const data = container.datum().filter(d => d['station'] == cut)
    enter({ container, data })
    updateLabels({ container, data })
    updateScales({ container, data })
    updateDom({ container, data })

  }

  chart.width = function(...args) {
    if (!args.length) return width
    width = args[0]
    chartWidth = width - margin.left - margin.right
    gridSize = chartWidth / 24
    legendElementWidth = gridSize * 2
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
  
  el.datum(time_stations_data)
  module.exports.chart.cut("all")
  resize()
  window.addEventListener('resize', resize)
}

init()

d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
};
d3.selection.prototype.moveToBack = function() {  
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    });
};


