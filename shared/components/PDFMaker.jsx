/**
 * @overview Set of buttons for sidebar that will create PDF's for
 * different time periods for download
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../redux/actions/actions';

import createTriMonthlyPDF from './CreateTriMonthlyPDF';

class PDFMaker extends Component {
    static propTypes = {
        year: PropTypes.number.isRequired,
        month: PropTypes.number,  // Check for month elsewhere
        dispatch: PropTypes.func.isRequired,
    }
    
    get periods() {
        const year = this.props.year,
              month = this.props.month,
              ymStr = `${year-1911}/${month+1}`,
              lastDay = new Date(year, month+1, 0).getDate();
        return [
            {ymStr: ymStr, year: year, month: month, start: 1, end: 13},
            {ymStr: ymStr, year: year, month: month, start: 14, end: 23},
            {ymStr: ymStr, year: year, month: month, start: 24, end: lastDay}
        ];
    }

    requestPDF = (i) => {
        const p = this.periods[i];
        
        Actions.requestPDF(
            `${p.year}/${p.month+1}/${p.start}`,
            `${p.year}/${p.month+1}/${p.end}`,
            createTriMonthlyPDF
        );
    }

//    createPDF(data) {
//        console.log("CREATE PDF");
//        console.dir(data);
//        data.shipments.forEach(each => console.log(each));
//    }

    render() {
        // Month is required for PDF creation
        if (typeof this.props.month !== "number") {
            return <div></div>
        }
        return <div className="text-center">
            <h5>PDF <span className="glyphicon glyphicon-download-alt"></span></h5>
            {this.periods.map((p, i) => 
                <button key={i} onClick={() => this.requestPDF(i)}
                    className="btn btn-warning form-control">
                    {p.ymStr}/{p.start} ~ {p.ymStr}/{p.end}
                </button>
            )}
        </div>;
    }
}

export default connect()(PDFMaker);
