import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'

import * as Actions from '../../redux/actions/actions';

import SelectYearMonth from './SelectYearMonth';

function ButtonStyle(selected) {
    if (typeof selected !== 'boolean') throw "'selected' parameter must be a boolean value.";
    
    const style = {};
    
    if (selected) {
        style.backgroundColor = "#fff";
        style.color = "#000";
    }
    
    return style;
}


const CompanyColumn = (props) =>
<div className="col-md-6 text-center">
    <h4>{props.title}</h4>
    {
      props.depts.map((each) =>
          <button className="btn btn-warning form-control" 
              key={each} 
              style={ButtonStyle(each === props.selectedDept)}
              type="button" 
              onClick={() => props.onClick({company: props.title, dept: each})} >{each}</button>
      )
    }
</div>
    

class Sidebar extends Component {    
    static propTypes = {  // ES7 style
        selectedDept: PropTypes.shape({
            company: PropTypes.string.isRequired,
            dept: PropTypes.string.isRequired,
        }),
        width: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired,
    }
    
    state = {  // Initial state
        company: undefined,
        dept: undefined,
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    }
    
    setSelectedDept = (obj) => {  // ES7 style
        if (!('company' in obj)) throw "'company' parameter is missing."
        if (!('dept' in obj)) throw "'dept' parameter is missing."
        
        this.setState(Object.assign(this.state, {
            company: obj.company,
            dept: obj.dept,
        }), this.requestNewData);
        
        browserHistory.push('/');
    }
    
    setDateRange = (obj) => {
        if (!('year' in obj)) throw "'year' parameter is missing."
        if (!('month' in obj)) throw "'month' parameter is missing."
        console.dir(obj);
        this.setState(Object.assign(this.state, {
            year: obj.year,
            month: obj.month,
        }), this.requestNewData);
        console.dir(this.state);
    }
    
    requestNewData() {
        console.log(this.state);
        this.props.dispatch(Actions.fetchShipments(this.state));
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
                    selectedDept={this.state.dept} 
                    depts={props.deptLinks[key]} />
              )
            }
              </div>
                  <hr />
                <SelectYearMonth onClick={this.setDateRange} />
              
              
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
const mapStateToProps = (store) => ({
    selectedDept: store.selectedDept,
    deptLinks: store.deptLinks,
});

export default connect(mapStateToProps)(Sidebar);
