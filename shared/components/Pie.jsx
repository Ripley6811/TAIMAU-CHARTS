import React, { PropTypes, Component } from 'react';


class Pie extends Component {
    data() {
        const d = this.props.data;
        const newDataArray = [];
        for (let i=1; i< d[1].length; i++) {
            newDataArray.push({
                label: d[1][i],
                value: d[2][i]
            })
        }
        if (newDataArray.length === 0) {
            return [];
        }
        for (let i=newDataArray.length; i<6; i++) {
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
            .innerRadius(radius/2)
            .outerRadius(radius);
        
        this.pie = d3.layout.pie()
            .value(d => d.value)
            .sort(null);
        
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        const keys = Object.keys(Object.assign({}, this.props.data, nextProps.data))
        return !keys.every(key => this.props.data[key] === nextProps.data[key]);
    }

    componentDidUpdate(prevProps, prevState) {  // D3 update
        const self = this;
        console.log("D3 UPDATING");
        var color = d3.scale.category20b().range().slice(4);
        var data = self.data();

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
        
    }

    componentWillUnmount() {  // D3 destroy

    }
    
    arcTween = (a) => {
//        const self = this;
//        var i = d3.interpolate(self._current, a);
//        self._current = i(0);
//        return function(t) {
//            return self.arc(i(t));
//        };
    }

    render() {
        const props = this.props;

        return (
            <div id="chart">

            </div>
        );
    }
}

export default Pie;
