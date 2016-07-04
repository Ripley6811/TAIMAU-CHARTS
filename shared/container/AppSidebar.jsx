/**
 * @overview The Sidebar contains buttons to set the query parameters for
 * pages and links to pages.
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'

import * as Actions from '../redux/actions/actions';

import SelectYearMonth from '../components/SelectYearMonth';

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
<div className="col-md-6 text-center btn-group btn-group-vertical"
    style={{padding: '3px'}}>
  <button className="btn btn-warning form-control" 
      style={ButtonStyle(props.title === props.selectedCompany)}
      type="button" 
      onClick={() => props.onClick({company: props.title})} ><strong>{props.title}</strong></button>
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
    
    state = {  // Initial state == Query parameters
        company: undefined,
        dept: undefined,
        year: new Date().getFullYear(),
        month: undefined,
    }
    
    componentWillMount() {
        this.props.dispatch(Actions.fetchDepartments());
    }
    
    setSelectedDept = (obj) => {  // ES7 style
        if (!('company' in obj)) throw "'company' parameter is missing."
        
        this.setState({
            company: obj.company,
            dept: obj.dept,
        }, this.requestNewData);
    }
    
    setDateRange = (obj) => {
        if (!('year' in obj)) throw "'year' parameter is missing."
        if (!('month' in obj)) throw "'month' parameter is missing."
        
        this.setState({
            year: obj.year,
            month: obj.month,
        }, this.requestNewData);
    }
    
    setLocation(val) {
        this.props.dispatch(Actions.setLocation(val));
    }
    
    requestNewData() {
        this.props.dispatch(Actions.fetchShipments(this.state));
    }
    
    get navButtons() {
        return [
            {text: "Charts |  數量圖表", route: "/", disabled: false},
            {text: "Shipments | 出貨紀錄", route: "/shipment_history", disabled: false},
            {text: "Templates | 記錄模板", route: "/shipment_templates", disabled: false},
        ]
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
                    selectedCompany={this.state.company}
                    selectedDept={this.state.dept} 
                    depts={props.deptLinks[key]} />
              )
            }
              </div>
                  <hr />
                <SelectYearMonth setDateRange={this.setDateRange} />
              
              
              <hr />
              {
                  this.navButtons.map(({text, route, disabled}, i) =>
                    <div className="row" key={i}>
                        <div>
                        <button className="btn btn-warning form-control" type="button"
                            style={ButtonStyle(route === this.props.location)}
                            disabled={disabled}
                            onClick={() => {
                                    this.setLocation(route);
                                    browserHistory.push(route);
                                }}>
                            {text}
                        </button>
                        </div>
                    </div>
                    )
              }
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
    location: store.location,
});

export default connect(mapStateToProps)(Sidebar);
