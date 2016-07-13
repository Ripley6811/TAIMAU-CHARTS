import React, { PropTypes, Component } from 'react';


class Pie extends Component {
    static propTypes = {
        fullYear: PropTypes.bool.isRequired,
    }
    
    /**
     * Reformats the incoming data to use in pie chart.
     * @returns {Array} Array of data for pie chart
     */
    getData() {
        const d = this.props.data,
              newDataArray = [],
              MIN_ARRAY_SIZE = 6;
        for (let i=1; i< d[1].length; i++) {
            newDataArray.push({
                label: d[1][i],
                value: d[2][i]
            })
        }
        
        newDataArray.sort((a,b) => a.value < b.value ? 1 : -1);
        
        // Add extra blanks for smooth transition.
        for (let i=newDataArray.length; i<MIN_ARRAY_SIZE; i++) {
            newDataArray.push({
                label: "",
                value: 0
            })
        }
        
        return newDataArray;
    }

    componentDidMount() {  // D3 create
        console.log("MOUNTING");
        
        var width = 300;
        var height = 300;
        var radius = height/2;

        this.svg = d3.select('#chart')
            .append("svg").attr("width", width).attr("height", height)
            .append("g").attr("transform", `translate(${radius}, ${radius})`);
        
        // declare an arc generator function
        this.arc = d3.svg.arc()
            .innerRadius(radius/1.5)
            .outerRadius(radius);
        
        this.pie = d3.layout.pie()
            .value(d => d.value)
            .sort(null);
        
        this.forceUpdate();
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        const a1 = this.props.data[2];
        const a2 = nextProps.data[2];
        const yearMonthChanged = this.props.fullYear !== nextProps.fullYear;
        
        return a1.length !== a2.length ||
            !a1.every((each, i) => each === a2[i]) || 
            yearMonthChanged;
    }

    componentDidUpdate(prevProps, prevState) {  // D3 update
        const self = this;
        const CAT20B_GREEN_START = 4;
        const color = d3.scale.category20b().range().slice(CAT20B_GREEN_START);
        const data = self.getData();
        var legendRectSize = 18;
        var legendSpacing = 4;

        // select paths, use arc generator to draw
        var path = self.svg.selectAll("path")
            .data(self.pie(data));
        
        path.enter()
            .append("path")
            .attr("d", self.arc)
            .attr('fill', function(d, i) { return color[i] })
            .each(function(d) { this._current = d; });
        
        path.exit().remove();
        
        path.transition().duration(700)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return self.arc(interpolate(t));
                };
            });
        
        
        var legend = self.svg.selectAll('.legend')
            .data(data.filter(d => d.value > 0));
        
        legend.enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  70;
                var horz = -3.5 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            })
            .each(function(d, i) {
                d3.select(this).append('rect')
                    .attr('width', legendRectSize)
                    .attr('height', legendRectSize)
                    .style('fill', color[i])
                    .style('stroke', color[i]);
            
                d3.select(this).append('text')
                    .attr('class', `pieLabel`)
                    .attr('x', legendRectSize + legendSpacing)
                    .attr('y', legendRectSize - legendSpacing)
                    .text(d.label);
            });
        
        legend.exit().remove();
        
        legend.each(function(d) { 
            const MONTHS_PER_YEAR = 12;
            const AVE_WEEKS_PER_MONTH = 52 / 12;
            let text;
            if (self.props.fullYear) {
                text = `${Math.round(d.value / MONTHS_PER_YEAR)} kg ${d.label}`;
            } else {
                text = `${Math.round(d.value / AVE_WEEKS_PER_MONTH)} kg ${d.label}`;
            }
            d3.select(this).select('text').text(text);
        });
            
//            .text(function(d) { console.log(this, d); d3.select(this).text(d.label)});
//            .data(data.filter(d => d.value > 0))
//            .each(function(d) { 
//                d3.select(this).text(d.label); 
//            });
        
    }

    componentWillUnmount() {  // D3 destroy

    }

    render() {
        return <div id="chart"></div>;
    }
}

export default Pie;
