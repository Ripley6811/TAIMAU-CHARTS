/**
 * @overview D3 Multiline graph based on "https://bl.ocks.org/mbostock/3884955"
 */

import React, { PropTypes, Component } from 'react';

export default class YearGraph extends Component {
    get DIV_ID() {
        if (this.RID) return this.RID;
        this.RID = Math.random().toString(36).replace(/[^a-z]+/g, '');
        return this.RID;
    }

    static propTypes = {
        yearTotals: PropTypes.array,
    }

    /**
     * Reformats the incoming data for use in pie chart.
     * @returns {Array} Array of data for pie chart
     */
    getData() {
        const d = this.props.data,
              keys = ['date'],
              newDataArray = [];
        // Create 1st row of date followed by product names.
        for (let i=1; i<d[0].length; i++) {
            keys.push(`${d[0][i]} - ${d[1][i]}`);
        }

        for (let i=2; i<d.length; i++) {
            const newEntry = {};
            keys.forEach((key, j) => newEntry[key] = d[i][j]);
            newDataArray.push(newEntry);
        }
        console.dir(newDataArray);

        return newDataArray;
    }

    componentDidMount() {  // D3 create
        console.log("MOUNTING");
        const self = this;

        const MARGIN = {TOP: 20, LEFT: 60, RIGHT: 40, BOTTOM: 30},
              WIDTH = 760 - MARGIN.LEFT - MARGIN.RIGHT;
        self.HEIGHT = 420 - MARGIN.TOP - MARGIN.BOTTOM;

        self.x = d3.time.scale().range([0, WIDTH]);
        self.y = d3.scale.linear().range([self.HEIGHT, 0]);
        self.xAxis = d3.svg.axis().scale(self.x).orient("bottom");
        self.yAxis = d3.svg.axis().scale(self.y).orient("left");
        self.line = d3.svg.line()
            .interpolate("monotone")
//            .interpolate("step-after")
            .x(d => self.x(d.date))
            .y(d => self.y(d.total));
        console.log("`translate(${MARGIN.LEFT}, ${MARGIN.TOP})`", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
        self.svg = d3.select(`#${this.DIV_ID}`)
            .append("svg")
            .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr("height", self.HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
            .append("g")
            .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);


        self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${self.HEIGHT})`)  
            .call(self.xAxis);  // Follows setting "x.domain"


        self.svg.append("g")
            .attr("class", "y axis")
            .call(self.yAxis)  // Follows setting "y.domain"
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("KG");

        self.forceUpdate();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const a1 = this.props.data[2];
        const a2 = nextProps.data[2];

        return a1.length !== a2.length ||
            !a1.every((each, i) => each === a2[i]);
    }

    componentDidUpdate(prevProps, prevState) {  // D3 update
        console.log("UPDATING TREND");
        const self = this,
              data = self.getData(),
              COLOR_OPACITY = 0.6,
              TRANSITION_DURATION = 700,
              LINE_WIDTH = 3,
              LEGEND_RECT_SPACING = 18,
              LEGEND_SPACING = 4;

        // Associate catColors to product names but not date.
        const catColors = d3.scale.category10();
        catColors.domain(d3.keys(data[0]).filter(key => key !== "date"));

        const products = catColors.domain().map(product => (
            {
                product: product,
                values: data.map(d => ({date: d.date, total: +d[product]}))
            }
        ));

        // Jan 1 - Dec 1
        self.x.domain(d3.extent(data, d => d.date));

        self.y.domain([
            d3.min(products, c => d3.min(c.values, v => v.total)),
            d3.max(products, c => d3.max(c.values, v => v.total))
        ]);

        self.svg.selectAll("g.x.axis")
            .transition().duration(TRANSITION_DURATION)
            .call(self.xAxis);  // Follows setting "x.domain"
        self.svg.selectAll("g.y.axis")
            .transition().duration(TRANSITION_DURATION)
            .call(self.yAxis);  // Follows setting "x.domain"


        var prod = self.svg.selectAll(".prod")
            .data(products);

        prod.enter()
            .append("g")
            .attr("class", "prod")
            .append("path")
            .attr("class", "line")
            .attr("d", d => self.line(d.values))
            .style("stroke", d => catColors(d.product))
            .style("stroke-width", LINE_WIDTH)
            .style("stroke-opacity", COLOR_OPACITY)
            .style("fill", "none");

        prod.exit().remove();

        prod.each(function(d, i) {
                d3.select(this).select(".line")
                    .transition().duration(700)
                    .attr("d", self.line(d.values));
            });

        var legend = self.svg.selectAll('.legend')
            .data(products);

        legend.enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = LEGEND_RECT_SPACING + LEGEND_SPACING;
                var offset =  -20;
                var horz = 2 * LEGEND_RECT_SPACING;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            })
            .each(function(d, i) {
                d3.select(this).append('rect')
                    .attr('width', LEGEND_RECT_SPACING)
                    .attr('height', LEGEND_RECT_SPACING)
                    .style('fill', d => catColors(d.product))
                    .style('stroke', d => catColors(d.product))
                    .style("fill-opacity", COLOR_OPACITY);

                d3.select(this).append('text')
                    .attr('class', `pieLabel`)
                    .attr('x', LEGEND_RECT_SPACING + LEGEND_SPACING)
                    .attr('y', LEGEND_RECT_SPACING - LEGEND_SPACING)
                    .text(d.product);
            });

        legend.exit().remove();

        legend.each(function(d) {
            d3.select(this).select('text').text(d.product);
        });
    }

    componentWillUnmount() {  // D3 destroy

    }

    render() {
        return <div id={this.DIV_ID} style={{fontSize: "12px"}}></div>;
    }
}
