import React, { PropTypes, Component } from 'react';

export default class SelectYearMonth extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,  // callback
        selectedYear: PropTypes.number,
        selectedMonth: PropTypes.number,
    }
    
    static defaultProps = {
        currYear: new Date().getFullYear(),
        currMonth: new Date().getMonth(),
    }
    
    state = {
        years: [0,0,0,0,0].map((_, i) => this.props.currYear - i),
        months: ["ALL",0,1,2,3,4,5,6,7,8,9,10,11],  // Jan = 0
    }
    
    handleSubmit = (e) => {
        let month = this.refs.month.value;
        if (month === this.state.months[0]) month = undefined;  // "ALL" months
        
        this.props.onClick({
            year: this.refs.year.value,
            month: month,
        });
    }
    
    render() {
        const years = this.state.years,
              months = this.state.months,
              currYear = this.state.currYear,
              currMonth = this.state.currMonth;
        return <div className="row">
            <div className="col-md-7" style={{paddingRight: "0px"}}>
                <select className="form-control btn btn-warning" onChange={this.handleSubmit} ref="year" defaultValue={this.props.currYear}>
                    {
                        years.map((year) => 
                            <option key={year} value={year}>{year}年</option>
                        )
                    }

                </select>
            </div>
            <div className="col-md-5" style={{paddingLeft: "0px"}}>
                <select className="form-control btn btn-warning" onChange={this.handleSubmit} ref="month" defaultValue={this.props.currMonth}>
                    {
                        months.map((month) => 
                           <option key={month} value={month}>
                               {(typeof month === "number" ? month+1 + "月" : month)}
                           </option>
                        )
                    }
                </select>
            </div>
        </div>
    }
}