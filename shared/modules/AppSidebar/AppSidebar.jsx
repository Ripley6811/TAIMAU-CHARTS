/**
 * @overview The Sidebar contains buttons to set the query parameters for all
 * pages and links to pages.
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'
// Actions
import { updateSavedQuery } from './sidebar.actions';
import { fetchShipments } from '../../modules/Shipment/shipment.actions';
// Components
import CompanyColumn from './components/CompanyColumn';
import SelectYearMonth from './components/SelectYearMonth';
import PDFMaker from './components/PDFMaker';
import FontAwesome from '../../components/FontAwesome';


const BTN_CLASS_STRING = "btn form-control btn-properties",
      HIGHLIGHTED_BTN = {
          backgroundColor: "white",
          boxShadow: "3px 2px 5px black",
          left: "-2px",
          top: "-2px",
          zIndex: "10",
      },
      LOCALSTORAGE_KEY_FOR_STATE = "query",
      FA_SPINNING_COG = FontAwesome("cog", "fa-2x slow-spin"),
      PAGE_NAV_BTNS = [
          {text: "ChartView | 數量圖表", route: "/"},
          {text: "Shipments | 出貨紀錄", route: "/shipments"},
          {text: "Templates | 記錄模板", route: "/templates"},
      ];


export default connect(
    ({deptLinks}) => ({deptLinks}),  // Pull items from store
    { updateSavedQuery, fetchShipments }  // Bind actions with dispatch
)(class AppSidebar extends Component {
    /**
     * Validates incoming props.
     */
    static propTypes = {  // ES7 style
        // Props from parent
        width: PropTypes.string.isRequired,
        // Props from store
        deptLinks: PropTypes.arrayOf(
            PropTypes.shape({
                company: PropTypes.string,
                departments: PropTypes.array,
            })
        ).isRequired,
        // Dispatch actions
        updateSavedQuery: PropTypes.func.isRequired,
        fetchShipments: PropTypes.func.isRequired,
    }

    /**
     * Initial state = global "query" parameters.
     * These query parameters are set in the sidebar and used throughout the program.
     */
    state = {
        company: undefined,
        dept: undefined,
        year: new Date().getFullYear(),
        month: undefined,
    }

    /**
     * "Will Mount" necessary to set state properly before rendering. "Did Mount" fails this.
     */
    componentWillMount = () => {
        // Load last used "query" parameters from local storage on client-side
        if (typeof window !== 'undefined') {
            this.location = location.pathname;
            if (!!localStorage[LOCALSTORAGE_KEY_FOR_STATE]) {
                this.setState(
                    JSON.parse(localStorage[LOCALSTORAGE_KEY_FOR_STATE]),
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

    updateSavedQuery = () => {
        // Save most recent query in local storage and in redux store
        localStorage.setItem([LOCALSTORAGE_KEY_FOR_STATE], JSON.stringify(this.state));
        localStorage.setItem("selectedCompany", this.state.company);
        localStorage.setItem("selectedDepartment", this.state.dept);
        localStorage.setItem("selectedYear", this.state.year);
        localStorage.setItem("selectedMonth", this.state.month);
        this.props.updateSavedQuery(this.state);
        this.props.fetchShipments(this.state);
        this.forceUpdate();
    }

    gotoRoute = (route) => {
        this.location = route;
        browserHistory.push(route);
        this.forceUpdate();  // Force button style update
    }

    render() {
        const { width, deptLinks } = this.props;

        return (
        <div className="sidebar"
             style={{width: width, position: 'fixed', height: '100%'}} >
          <div className="sidebar-content"
               style={{padding: '10px', margin: '0 auto -100px', height: '100%'}}>
              <div className="text-center">
                <img src="../img/logo.png" className="logo-style" />
                <button style={{backgroundColor: "inherit",
                                borderStyle: "inherit",
                                position: "absolute",
                                right: "20px",
                                zIndex: "1"}}
                    onClick={() => this.gotoRoute('/settings')}>
                    {FA_SPINNING_COG}
                  </button>
            </div>
            <hr />
                { PAGE_NAV_BTNS.map(({text, route}, i) =>
                    <div className="row" key={i+route}>
                        <div>
                        <button className={BTN_CLASS_STRING} type="button"
                            style={route === this.location ? HIGHLIGHTED_BTN : {}}
                            onClick={() => this.gotoRoute(route)}>
                            <strong>{text}</strong>
                        </button>
                        </div>
                    </div>
                ) }
            <hr />
            <div className="row">
                { deptLinks.map(rec =>
                    <CompanyColumn key={rec.company}
                        company={rec.company}
                        depts={rec.departments}
                        onClick={this.setSelectedDept}
                        BTN_CLASS_STRING={BTN_CLASS_STRING}
                        HIGHLIGHTED_BTN={HIGHLIGHTED_BTN} />
                ) }
            </div>
            <hr />
            <SelectYearMonth
                year={this.state.year}
                month={this.state.month}
                setDateRange={this.setDateRange}
                BTN_CLASS_STRING={BTN_CLASS_STRING}
                HIGHLIGHTED_BTN={HIGHLIGHTED_BTN} />
            <hr />
            <PDFMaker
                company={this.state.company}
                year={this.state.year}
                month={this.state.month}
                BTN_CLASS_STRING={BTN_CLASS_STRING} />
          </div>

           <div className="footer" style={{height: '100px'}} >
             <p>&copy; 2016 &middot; Jay W Johnson</p>
             <p>GitHub &middot; <a href="https://github.com/Ripley6811" target="_Blank">Ripley6811</a></p>
           </div>
        </div>
      );
    }
});