/**
 * @overview Set of buttons for sidebar that will create PDF's for
 * different time periods for download
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../redux/actions/actions';

import createTriMonthlyPDF from './CreateTriMonthlyPDF';
import createHalfYearPDF from './createHalfYearPDF';

class PDFMaker extends Component {
    static propTypes = {
        company: PropTypes.string,
        year: PropTypes.number.isRequired,
        month: PropTypes.number,  // Check for month elsewhere
        dispatch: PropTypes.func.isRequired,
    }
    
    get periods() {
        const year = this.props.year,
              month = this.props.month,
              ymStr = `${year-1911} / ${month+1}`,
              lastDay = new Date(year, month+1, 0).getDate();
        return [
            {ymStr: ymStr, year: year, month: month, start: 1, end: 13},
            {ymStr: ymStr, year: year, month: month, start: 14, end: 23},
            {ymStr: ymStr, year: year, month: month, start: 24, end: lastDay}
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

            Actions.requestPDF(
                this.props.company,
                `${p.year}/${p.month+1}/${p.start}`,
                `${p.year}/${p.month+1}/${p.end}`,
                createTriMonthlyPDF
            );
        } else {
            const p = this.halfyears[i];
            Actions.requestPDF(
                this.props.company,
                `${p.year}/${p.start}/1`,
                `${p.year}/${p.end}/31`,
                createHalfYearPDF
            );
        }
    }

    render() {
        // Month is required for PDF creation
        if (typeof this.props.company !== "string") {
            return <div></div>
        }
        if (typeof this.props.month !== "number") {
            return <div className="text-center">
                <h5>{this.props.company} PDF</h5>
                {this.halfyears.map((p, i) => 
                    <button key={i} onClick={() => this.requestPDF(i)}
                        className="btn btn-warning form-control">
                        <span className="glyphicon glyphicon-download-alt"></span>
                        &nbsp;
                        {p.yearStr} / {p.start}月 ~ {p.end}月
                    </button>
                )}
            </div>;
        }
        return <div className="text-center">
            <h5>{this.props.company} PDF</h5>
            {this.periods.map((p, i) => 
                <button key={i} onClick={() => this.requestPDF(i)}
                    className="btn btn-warning form-control">
                    <span className="glyphicon glyphicon-download-alt"></span>
                    &nbsp;
                    {p.ymStr} / {p.start} ~ {p.end}
                </button>
            )}
        </div>;
    }
}

export default connect()(PDFMaker);
