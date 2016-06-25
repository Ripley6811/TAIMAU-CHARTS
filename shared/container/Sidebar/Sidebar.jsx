import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'

import * as Actions from '../../redux/actions/actions';

function ButtonStyle(selected) {
    if (typeof selected !== 'boolean') throw "'selected' parameter must be a boolean value.";
    
    const style = {};
    
    if (selected) {
        style.backgroundColor = "#fff";
        style.color = "#000";
    }
    
    return style;
}


const SelectYearMonth = (props) => {
    const years = [2010],
          months = ["All",0,1,2,3,4,5,6,7,8,9,10,11],
          currYear = new Date().getFullYear(),
          currMonth = new Date().getMonth();  // January = 0
    while (years[0] < currYear) {
        years.unshift(years[0]+1);
    }
    
    return <div className="row">
        <div className="col-md-7" style={{paddingRight: "0px"}}>
            <select className="form-control btn btn-warning" defaultValue={currYear}>
                {
                    years.map((year) => 
                        <option key={year} value={year}>{year}年</option>
                    )
                }
                
            </select>
        </div>
        <div className="col-md-5" style={{paddingLeft: "0px"}}>
            <select className="form-control btn btn-warning" defaultValue={currMonth}>
                {
                    months.map((month) => 
                       <option key={month} value={month}>
                           {(typeof month === "number" ? month+1 + "月" : month)}
                       </option>
                    )
                }
            </select>
        </div>
        <div className="row">
            <div className=" col-md-12">
                <button className="btn btn-warning form-control" type="button"
                        onClick={() => (4)}>
                    Load Dates
                </button>
            </div>
        </div>
    </div>
}
    

const CompanyColumn = (props) =>
<div className="col-md-6 text-center">
    <h4>{props.title}</h4>
    {
      props.depts.map((each) =>
          <button className="btn btn-warning form-control" 
              key={each} 
              style={ButtonStyle(each === props.selectedDept.dept)}
              type="button" 
              onClick={() => props.onClick({company: props.title, dept: each})} >{each}</button>
      )
    }
</div>
    

class Sidebar extends Component {
    constructor(...args) {
        super(...args);
        this.setSelectedDept = this.setSelectedDept.bind(this);
    }
    
    static propTypes = {
        selectedDept: PropTypes.shape({
            company: PropTypes.string.isRequired,
            dept: PropTypes.string.isRequired,
        }),
    //    deptLinks: PropTypes.object.isRequired,
        width: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired,
    }
    
    setSelectedDept(obj) {
        this.props.dispatch(Actions.addSelectedDept(obj));
        browserHistory.push('/');
    }
    
    setSelectedDateRange(obj) {
        
    }
    
    render() {
        const props = this.props;
      return (
        <div className="header" style={{width: props.width, position: 'fixed', height: '100%'}} >
          <div className="header-content" style={{padding: '10px', margin: '0 auto -100px', height: '100%'}}>
              <div className="text-center">
                <img src="../img/logo.png" style={{borderRadius: '22px 50px 7px 18px'}} />
            </div>
            <h2>
              Chart Viewer
            </h2>
                  <hr />
              <div className="row">
            {
              Object.keys(props.deptLinks).map((key) =>
                <CompanyColumn title={key} key={key} 
                    onClick={this.setSelectedDept}
                    selectedDept={props.selectedDept || {}} 
                    depts={props.deptLinks[key]} />
              )
            }
              </div>
                  <hr />
                <SelectYearMonth />
              
              
              <hr />
            <div className="row">
                <div className=" col-md-12">
              <button className="btn btn-warning form-control" type="button"
                  onClick={() => browserHistory.push('/shipment_history')}>
                Shipment History
                </button>
                    </div>
              </div>
          </div>


           <div className="footer" style={{height: '100px'}} >
             <p>&copy; 2016 &middot; Jay W Johnson</p>
             <p>GitHub : <a href="https://github.com/Ripley6811" target="_Blank">Ripley6811</a></p>
           </div>
        </div>
      );
    }
}

// Retrieve data from store as props
function mapStateToProps(store) {
    return {
        selectedDept: store.selectedDept,
        deptLinks: store.deptLinks,
    };
}

//Sidebar.propTypes = {
//    selectedDept: PropTypes.shape({
//        company: PropTypes.string.isRequired,
//        dept: PropTypes.string.isRequired,
//    }),
////    deptLinks: PropTypes.object.isRequired,
//    width: PropTypes.string.isRequired,
//    dispatch: PropTypes.func.isRequired,
//};


export default connect(mapStateToProps)(Sidebar);
