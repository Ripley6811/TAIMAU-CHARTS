import React, { PropTypes, Component } from 'react';


export default class SelectYearMonth extends Component {
    static propTypes = {
        setDateRange: PropTypes.func.isRequired,  // callback
        HIGHLIGHTED_BTN: PropTypes.object.isRequired,
        BTN_CLASSES: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        month: PropTypes.number,  // not required
    }
    
    state = {
        year: this.props.year,
        month: this.props.month || undefined,
    }
    
    submitDateChange() {
        let month = this.state.month;
        if (typeof month !== 'number') month = undefined;  // "ALL" months
        
        this.props.setDateRange({
            year: this.state.year,
            month: month,
        });
    }
    
    get years() {
        return [0,0,0,0,0].map((_, i) => new Date().getFullYear() - i);
    }
    
    setYear = (year) => {
        this.setState(Object.assign(this.state, {
            year: year
        }), this.submitDateChange);
    }
    
    setMonth = (month) => {
        this.setState(Object.assign(this.state, {
            month: month
        }), this.submitDateChange);
    }
    
    render() {
        console.log("SYM");
        console.dir(this.state);
        const props = this.props;
        
        return <div className="row">
            <div className="col-md-4" style={{padding: "0px"}}>
                {
                    this.years.map(year => 
                   <button className="form-control btn btn-warning" 
                           style={year === this.state.year ? props.HIGHLIGHTED_BTN : {}}
                           key={year} value={year}
                           onClick={() => this.setYear(year)} >
                       {year + "年"}
                   </button>
                    )
                }
            </div>
            <div className="col-md-8" style={{padding: "0px"}}>
                
               <button className="row form-control btn btn-warning" 
                       style={this.state.month === undefined ? props.HIGHLIGHTED_BTN : {}}
                       onClick={() => this.setMonth(undefined)} >
                   整年
               </button>
                
                <div className="row">
                    <div className="col-md-4" style={{padding: "0px"}}>
                            {
                                [0,1,2,3].map(month => 
                                   <button className={props.BTN_CLASSES} 
                                           style={month === this.state.month ? props.HIGHLIGHTED_BTN : {}}
                                           key={month} value={month}
                                           onClick={() => this.setMonth(month)} >
                                       {(month+1) + "月"}
                                   </button>
                                )
                            }
                    </div>
                    <div className="col-md-4" style={{padding: "0px"}}>
                            {
                                [4,5,6,7].map((month) => 
                                   <button className={props.BTN_CLASSES} 
                                           style={month === this.state.month ? props.HIGHLIGHTED_BTN : {}}
                                           key={month} value={month}
                                           onClick={() => this.setMonth(month)} >
                                       {(month+1) + "月"}
                                   </button>
                                )
                            }
                    </div>
                    <div className="col-md-4" style={{padding: "0px"}}>
                            {
                                [8,9,10,11].map((month) => 
                                   <button className={props.BTN_CLASSES} 
                                           style={month === this.state.month ? props.HIGHLIGHTED_BTN : {}}
                                           key={month} value={month}
                                           onClick={() => this.setMonth(month)} >
                                       {(month+1) + "月"}
                                   </button>
                                )
                            }
                    </div>
                </div>
            </div>
        </div>
    }
}