/**
 * @overview Set of buttons for sidebar that will create PDF's for
 * different time periods for download
 */

import React, { PropTypes, Component } from 'react';
// Redux connect and actions
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/actions';
// Components
import createTriMonthlyPDF from './CreateTriMonthlyPDF';
import createWasteWaterPDF from './CreateWasteWaterPDF';


const INPUT_STYLE = {
    width: "30%", 
    textAlign: "left",
    padding: "6px", 
    backgroundColor: "burlywood",
};

const FA_DOWNLOAD = <i className="fa fa-download" aria-hidden="true" />;
const LOCALSTORAGE_KEY_FOR_STATE = "pdfperiodends";
const SELECTED_NO_COMPANY = Symbol();
const SELECTED_WHOLE_YEAR = Symbol();
const SELECTED_ONE_MONTH = Symbol();

class PDFMaker extends Component {
    static propTypes = {
        company: PropTypes.string,
        year: PropTypes.number.isRequired,
        month: PropTypes.number,  // Check for month elsewhere
        BTN_CLASSES: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired,
    }

    state = {
        period0end: 13,
        period1end: 23
    }

    get periods() {
        const year = +this.props.year,
              month = +this.props.month,
              ymStr = `${year-1911} / ${month+1}`,
              lastDay = new Date(year, month+1, 0).getDate(),
              p0end = +this.state.period0end,
              p1end = +this.state.period1end;
        return [
            {ymStr: ymStr, year: year, month: month, start: 1, end: p0end},
            {ymStr: ymStr, year: year, month: month, start: p0end+1, end: p1end},
            {ymStr: ymStr, year: year, month: month, start: p1end+1, end: lastDay}
        ];
    }

    get halfyears() {
        const year = this.props.year,
              yearStr = `${year-1911}`;
        return [
            {yearStr: yearStr, year: year, start: 1, end: 6},
            {yearStr: yearStr, year: year, start: 7, end: 12}
        ];
    }

    requestPDF = (i) => {
        if (this.props.month) {
            const p = this.periods[i];

            Actions.requestTriMonthlyPDF(
                this.props.company,
                `${p.year}/${p.month+1}/${p.start}`,
                `${p.year}/${p.month+1}/${p.end}`,
                createTriMonthlyPDF
            );
        } else {
            const p = this.halfyears[i];
            const lastDay = new Date(p.year, p.end, 0).getDate();
            Actions.requestWasteWaterPDF(
                this.props.company,
                `${p.year}/${p.start}/1`,
                `${p.year}/${p.end}/${lastDay}`,
                createWasteWaterPDF
            );
        }
    }

    changePeriodDate = (i, e) => {
        function updateLocalStorage() {
            localStorage.setItem(LOCALSTORAGE_KEY_FOR_STATE, JSON.stringify(this.state));
        }
        this.setState({
            [`period${i}end`]: e.target.value,
        }, updateLocalStorage);
    }

    componentWillMount() {
        // Load "query" parameters from local storage on client-side
        if (typeof window !== 'undefined') {
            if (!!localStorage[LOCALSTORAGE_KEY_FOR_STATE]) {
                this.setState(JSON.parse(localStorage[LOCALSTORAGE_KEY_FOR_STATE]));
            }
        }
    }

    render() {
        const props = this.props;
        
        let displayType;
        if (!!props.company && typeof props.month !== "number") {
            displayType = SELECTED_WHOLE_YEAR;
        } else if (!!props.company && typeof props.month === "number") {
            displayType = SELECTED_ONE_MONTH;
        }
        
        switch(displayType) {
            case SELECTED_WHOLE_YEAR:
                return <div className="text-center">
                    <h5>{props.company} PDF</h5>
                    {this.halfyears.map((p, i) =>
                        <button key={`${props.month}${i}`}
                            onClick={() => this.requestPDF(i)}
                            className={props.BTN_CLASSES}>
                            {FA_DOWNLOAD}
                            &nbsp;
                            {p.yearStr} / {p.start} ~ {p.end}月 廢水
                        </button>
                    )}
                </div>;
                
            case SELECTED_ONE_MONTH:
                return <div className="text-center">
                    <h5>{props.company} PDF</h5>
                    {this.periods.slice(0,2).map((p, i) =>
                        <div className="row input-group"
                             key={`${p.toString()}${i}`}
                             style={{width: "100%"}}>
                            <button onClick={() => this.requestPDF(i)}
                                    style={{width: "70%", textAlign: "right"}}
                                    className={props.BTN_CLASSES}>
                                {FA_DOWNLOAD} &nbsp; {p.ymStr} / {p.start} ~
                            </button>
                            <input type="number"
                                style={INPUT_STYLE}
                                className="input-group-addon"
                                min="1" max="31"
                                onChange={e => this.changePeriodDate(i,e)}
                                value={this.state["period" + i + "end"]} />
                        </div>
                    )}
                    {((p, i) =>
                        <div className="row" key={`${p.ymStr}${i}`}>
                            <button onClick={() => this.requestPDF(i)}
                                    className={props.BTN_CLASSES}
                                    style={/** Keep button above footer text **/
                                            {position: "relative", zIndex: "2"}}>
                                {FA_DOWNLOAD} &nbsp; {p.ymStr} / {p.start} ~ {p.end}
                            </button>
                        </div>
                    )(this.periods[2], 2)}
                </div>;
                
            default:
                return <div></div>;
        }
    }
}

export default connect()(PDFMaker);
