/**
 * @overview Modal for editing a single shipment's specification report.
 */
import React, { Component, PropTypes } from 'react';
// Components
import Modal from '../../../components/react-modal.min';
import { FA_FILE_TEXT, FA_FILE_O, FA_TIMES } from '../../../components/FontAwesome';
import createReport from '../js/SpecReport.jsPDF';

import { getPreviousSpecReports } from '../../../utils/requests/requests';


const customStyles = {
          content : {
              top                   : '5%',
              left                  : '15%',
              width                 : '70%',
              backgroundColor: '#DED',
          }
      },
      modalCornerXStyle = {
          cursor: "pointer",
          position:"absolute",
          top: "5px",
          right:"8px"
      },
      borderBox = {
          border: "1px dotted black"
      };
const DEFAULT_REPORT = {
            companyHeader: "富茂工業原料行",
            dateProduced: "",
            dateTested: "",
            lotAmount: "20000 kg",
            lotID: "",
            inspector: "",
            sampler: "",
            reporter: "",
            shelfLife: "一年",
            result: "符合規格",
            tests: [{ attr: "", spec: "", rslt: "" },
                    { attr: "", spec: "", rslt: "" },
                    { attr: "", spec: "", rslt: "" },
                    { attr: "", spec: "", rslt: "" },
                    { attr: "", spec: "", rslt: "" }]
      };

function getTaiwanDateString() {
    const today = new Date();
    return `${today.getFullYear()-1911}.${doubleDigit(today.getMonth()+1)}.${doubleDigit(today.getDate())}`;
}

function doubleDigit(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

function getLotIDString() {
    const today = new Date();
    return `M${String(today.getFullYear()).substring(2)}${doubleDigit(today.getMonth()+1)}${doubleDigit(today.getDate())}`;
}


export default
class SpecReportModal extends Component {
    static propTypes = {
        // Parent
        shipment: PropTypes.object.isRequired,
        sendUpdate: PropTypes.func.isRequired
    }

    state = {
        wantDeleteConfirmation: false,
        modalIsOpen: false,
        id: undefined,
        report: DEFAULT_REPORT,
    }

    componentWillMount = () => {
        // TODO: Load a previous spec report if this doesn't exist. Or use default.
//        const { shipment } = this.props;
//        if (shipment.testReport && shipment.testReport.lotID) {
//            const report = shipment.testReport;
//            report.tests.push({ attr: "", spec: "", rslt: "" });
//            report.tests.push({ attr: "", spec: "", rslt: "" });
//            this.setState({report, id: shipment._id});
//        } else {
//            this.setState({report: DEFAULT_REPORT,
//                           id: shipment._id});
//        }
    }

    openModal = () => {
        const { shipment } = this.props;
        // If there is no saved report, use default or previous report as model
        if (!shipment.testReport || !shipment.testReport.lotID) {
            getPreviousSpecReports(shipment.pn, (doc) => {
                if (!doc) {
                    // Set default data with current date info
                    this.setState({modalIsOpen: true,
                                   report: DEFAULT_REPORT,
                                   id: shipment._id});
                } else {
                    // Model data on previous report with current date info
                    const testAttrs = [];
                    console.log("filtering:");
                    console.dir(doc);
                    const tests = doc.tests.filter(test => {
                        if (testAttrs.indexOf(test.attr) < 0) {
                            testAttrs.push(test.attr);
                            return true;
                        } else return false;
                    });
                    tests.push({ attr: "", spec: "", rslt: "" });
                    tests.push({ attr: "", spec: "", rslt: "" });

                    this.setState({modalIsOpen: true,
                                   id: shipment._id,
                                   report: {
                                       dateProduced: getTaiwanDateString(),
                                       dateTested: getTaiwanDateString(),
                                       lotID: getLotIDString(),
                                       companyHeader: doc.companyHeader,
                                       lotAmount: doc.lotAmount,
                                       inspector: doc.inspector,
                                       sampler: doc.sampler,
                                       reporter: doc.reporter,
                                       shelfLife: doc.shelfLife,
                                       result: doc.result,
                                       tests: tests
                                   }
                    });
                }
            });
        } else {
            this.setState({modalIsOpen: true});
        }
    }

    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        this.refs.subtitle.style.fontSize = '0.7em';
    }

    closeModal = () => {
        this.setState({modalIsOpen: false,
                       wantDeleteConfirmation: false});
    }

    processInputs = () => {
        const report = {
            companyHeader: this.refs.companyHeader.value.trim(),
            dateProduced: this.refs.dateProduced.value.trim(),
            dateTested: this.refs.dateTested.value.trim(),
            lotAmount: this.refs.lotAmount.value.trim(),
            lotID: this.refs.lotID.value.trim(),
            inspector: this.refs.inspector.value.trim(),
            sampler: this.refs.sampler.value.trim(),
            reporter: this.refs.reporter.value.trim(),
            shelfLife: this.refs.shelfLife.value.trim(),
            result: this.refs.result.value.trim(),
            tests: []
        }
        if (report.lotID.length < 9) {
            alert("批號不對");
            return false;
        }
        for (let i=0; i<this.state.report.tests.length; i++) {
            const test = {
                attr: this.refs[`attr-${i}`].value.trim(),
                spec: this.refs[`spec-${i}`].value.trim(),
                rslt: this.refs[`rslt-${i}`].value.trim(),
            };
            if (test.attr || test.spec || test.rslt) {
                report.tests.push(test);
            } else {
                break;
            }
        }
        if (report.tests.length < 1) {
            alert("沒有檢驗項目");
            return false;
        }
        this.props.sendUpdate(this.state.id, report);

        report.tests.push({ attr: "", spec: "", rslt: "" });
        report.tests.push({ attr: "", spec: "", rslt: "" });

        return report;
    }

    saveReport = () => {
        const report = this.processInputs();
        if (report) {
            this.setState({report});
            this.closeModal();
        }
    }

    deleteReport = () => {
        if (this.state.wantDeleteConfirmation) {
            this.setState({report: DEFAULT_REPORT,
                           wantDeleteConfirmation: false});
            this.props.sendUpdate(this.state.id, {tests:[]});
            this.closeModal();
        } else {
            this.setState({wantDeleteConfirmation: true});
        }
    }

    printReport = () => {
        const report = this.processInputs();
        if (report) {
            this.setState(
                {report},
                () => createReport(this.props.shipment, this.state.report)
            );
        }
    }

    render() {
        const { shipment } = this.props;
        const tests = shipment.testReport ? shipment.testReport.tests : [];
        const buttonInner = tests.length > 0 ? FA_FILE_TEXT : FA_FILE_O;

        return <div onClick={this.openModal}>
            {buttonInner}
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles} >
              <div onClick={this.closeModal}
                  style={modalCornerXStyle}>
                {FA_TIMES}
              </div>
              <span ref="subtitle">{shipment._id}</span>
                <hr />
                <div>
                    <div className="row">
                        <div className="col-xs-12 text-center h2">
                            <input className="text-center" ref="companyHeader"
                                defaultValue={this.state.report.companyHeader} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 text-center h3">
                            產品檢驗報告
                        </div>
                    </div>
                    <div style={borderBox}>
                        <div className="row">
                            <div className="col-xs-6 h4">
                                品名 : &nbsp; {shipment.product}
                            </div>
                            <div className="col-xs-6 h4">
                                料號 : &nbsp; {shipment.pn}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6 h4">
                                製造日期 : <input ref="dateProduced"
                                           defaultValue={this.state.report.dateProduced} />
                            </div>
                            <div className="col-xs-6 h4">
                                批號 : <input ref="lotID"
                                         defaultValue={this.state.report.lotID} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6 h4">
                                檢驗日期 : <input ref="dateTested"
                                           defaultValue={this.state.report.dateTested} />
                            </div>
                            <div className="col-xs-6 h4">
                                生產數量 : <input ref="lotAmount"
                                         defaultValue={this.state.report.lotAmount} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6 h4">
                                保存期限 : <input ref="shelfLife"
                                           defaultValue={this.state.report.shelfLife} />
                            </div>
                            <div className="col-xs-6 h4">
                                取樣人員 : <input ref="sampler"
                                         defaultValue={this.state.report.sampler} />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="row" style={borderBox}>
                        <div className="col-xs-4 text-center h4">
                            檢 驗 項 目
                        </div>
                        <div className="col-xs-4 text-center h4">
                            規 格
                        </div>
                        <div className="col-xs-4 text-center h4">
                            檢 驗 結 果
                        </div>
                    </div>
                    <div style={borderBox}>
                        {this.state.report.tests.map((test, i) =>
                        <div key={`${shipment._id}-${i}`} className="row">
                            <div className="col-xs-4 text-center h4">
                                <input ref={`attr-${i}`}
                                    defaultValue={test.attr} />
                            </div>
                            <div className="col-xs-4 text-center h4">
                                <input ref={`spec-${i}`}
                                    defaultValue={test.spec} />
                            </div>
                            <div className="col-xs-4 text-center h4">
                                <input ref={`rslt-${i}`}
                                    defaultValue={test.rslt} />
                            </div>
                        </div>
                        )}
                    </div>
                    <br />
                    <div className="row" style={borderBox}>
                        <div className="col-xs-3 text-right h4">
                            結果研判 :
                        </div>
                        <div className="col-xs-9 h4">
                            <input ref="result"
                                defaultValue={this.state.report.result} />
                        </div>
                    </div>
                    <div className="row" style={borderBox}>
                        <div className="col-xs-6 h4">
                            製表 : <input ref="reporter"
                                       defaultValue={this.state.report.reporter} />
                        </div>
                        <div className="col-xs-6 h4">
                            檢驗人員 : <input ref="inspector"
                                       defaultValue={this.state.report.inspector} />
                        </div>
                    </div>

                    <div className="row text-center">
                        <button className="btn btn-success"
                            onClick={this.saveReport}>
                            Save & Close
                        </button>
                        <button className="btn btn-primary"
                            onClick={this.printReport}>
                            Create PDF
                        </button>

                        {this.state.wantDeleteConfirmation ? (
                            <button className="btn btn-default"
                                onClick={this.deleteReport}>
                                Confirm Delete
                            </button>
                            ) : (
                            <button className="btn btn-danger"
                                onClick={this.deleteReport}>
                                Delete
                            </button>)
                        }
                    </div>
                </div>
            </Modal>
        </div>
    }
}
