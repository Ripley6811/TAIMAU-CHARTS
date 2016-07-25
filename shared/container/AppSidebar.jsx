/**
 * @overview The Sidebar contains buttons to set the query parameters for
 * pages and links to pages.
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'

import * as Actions from '../redux/actions/actions';

import SelectYearMonth from '../components/SelectYearMonth';
import PDFMaker from '../components/PDFMaker';


const HIGHLIGHTED_BTN = {
    backgroundColor: "#fff",
    color: "#000",
};


const BTN_CLASSES = "btn btn-warning form-control";


const CompanyColumn = (props) =>
<div className="col-md-6 text-center btn-group btn-group-vertical"
    style={{padding: '3px'}}>
  <button className={BTN_CLASSES}
      style={props.title === props.selectedCompany ? HIGHLIGHTED_BTN : {}}
      type="button"
      onClick={() => props.onClick({company: props.title})} >
      <strong>{props.title}</strong>
  </button>
    {
      props.depts.map(each => React.createElement(
        "button", {
            className: BTN_CLASSES,
            key: each,
            style: each === props.selectedDept ? HIGHLIGHTED_BTN : {},
            type: "button",
            onClick: () => props.onClick({ company: props.title, dept: each }) 
        },
        each
      ))
    }
</div>


class Sidebar extends Component {
    static propTypes = {  // ES7 style
        selectedDept: PropTypes.shape({
            company: PropTypes.string.isRequired,
            dept: PropTypes.string.isRequired,
        }),
        // Specify sidebar width in pixels, e.g. "200px"
        width: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired,
    }

    get stateStorageKey() { return "query"; }

    state = {  // Initial state == Query parameters
        company: undefined,
        dept: undefined,
        year: new Date().getFullYear(),
        month: undefined,
    }

    componentWillMount() {
        // Load "query" parameters from local storage on client-side
        if (typeof window !== 'undefined') {
            this.location = window.location.pathname;
            if (!!window.localStorage[this.stateStorageKey]) {
                this.setState(
                    JSON.parse(window.localStorage[this.stateStorageKey]),
                    this.updateSavedQuery
                );
            }
        }
    }

    setSelectedDept = (obj) => {  // ES7 style bound function
        if (!('company' in obj)) throw "'company' parameter is missing."

        this.setState({
            company: obj.company,
            dept: obj.dept,
        }, this.updateSavedQuery);  // Callback after state change finishes.
    }

    setDateRange = (obj) => {
        if (!('year' in obj)) throw "'year' parameter is missing."
        if (!('month' in obj)) throw "'month' parameter is missing."

        this.setState({
            year: obj.year,
            month: obj.month,
        }, this.updateSavedQuery);
    }

    updateSavedQuery() {
        // Save most recent query in local storage and in redux store
        window.localStorage.setItem([this.stateStorageKey], JSON.stringify(this.state));
        this.props.dispatch(Actions.updateSavedQuery(this.state));
        this.props.dispatch(Actions.fetchShipments(this.state));
    }

    get navButtons() {
        return [
            {text: "Charts |  數量圖表",
             route: "/", disabled: false},
            {text: "Shipments | 出貨紀錄",
             route: "/shipments", disabled: false},
            {text: "Templates | 記錄模板",
             route: "/templates", disabled: false},
        ]
    }

    gotoRoute = (route) => {
        this.location = route;
        browserHistory.push(route);
        this.forceUpdate();  // Force button style update
    }

    render() {
        const props = this.props;
        return (
        <div className="sidebar"
            style={{width: props.width, position: 'fixed', height: '100%'}} >
          <div className="sidebar-content"
              style={{padding: '10px', margin: '0 auto -100px', height: '100%'}}>
              <div className="text-center">
                <img src="../img/logo.png"
                    style={{position: "relative", borderRadius: '22px 50px 7px 18px', zIndex: "2"}} />
                <button style={{backgroundColor: "inherit",
                                borderStyle: "inherit",
                                position: "absolute",
                                right: "20px",
                                zIndex: "1"}}
                    onClick={() => this.gotoRoute('/settings')}>
                    <i className="fa fa-cog fa-2x fa-flip-horizontal slow-spin" aria-hidden="true" />
                  </button>
            </div>
            <hr />
              {
                  this.navButtons.map(({text, route, disabled}, i) =>
                    <div className="row" key={i+route}>
                        <div>
                        <button className={BTN_CLASSES} type="button"
                            style={route === this.location ? HIGHLIGHTED_BTN : {}}
                            disabled={disabled}
                            onClick={() => this.gotoRoute(route)}>
                            {text}
                        </button>
                        </div>
                    </div>
                    )
              }
            <hr />
              <div className="row">
            {
              props.deptLinks.map((rec) =>
                <CompanyColumn title={rec.company} key={rec.company}
                    onClick={this.setSelectedDept}
                    selectedCompany={this.state.company}
                    selectedDept={this.state.dept}
                    depts={rec.departments} />
              )
            }
              </div>
            <hr />
            <SelectYearMonth
                year={this.state.year}
                month={this.state.month}
                setDateRange={this.setDateRange} />


            <hr />
            <PDFMaker
                company={this.state.company}
                year={this.state.year}
                month={this.state.month}
                BTN_CLASSES={BTN_CLASSES} />
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
