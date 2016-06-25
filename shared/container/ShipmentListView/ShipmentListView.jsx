import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';

const ShipmentListHead = (props) =>
    <thead>
        <tr>
          <th>公司</th>
          <th>頁</th>
          <th>進貨日期</th>
          <th>材料名稱</th>
          <th>料號</th>
          <th>需求量</th>
          <th>Dept</th>
          <th>Unit</th>
          <th>備註</th>
          {(() => {
            if (props.edit) {
              return <th>除</th>
            }
          })()}
        </tr>
    </thead>

const ShipmentListItem = (props) =>
    <tr className="single-post" onClick={props.onClick}>
      <td className="cell-company">{props.shipment.company}</td>
      <td className="cell-refPage">{props.shipment.refPage}</td>
      <td className="cell-date">{props.shipment.date.substr(0,10)}</td>
      <td className="cell-name">{props.shipment.name}</td>
      <td className="cell-pn">{props.shipment.pn}</td>
      <td className="cell-amount">{props.shipment.amount}</td>
      <td className="cell-dept">{props.shipment.dept}</td>
      <td className="cell-unit">{props.shipment.unit}</td>
      <td className="cell-note">{props.shipment.note}</td>
      {(() => {
        if (props.edit) {
          return (
            <td className="danger text-center cell-button" onClick={props.onDelete}>
              <span className="glyphicon glyphicon-trash"></span>
            </td>
          )
        }
      })()}
    </tr>


function ShipmentListView(props) {
  return (
  <div>
    <legend>Shipment History</legend>
    <table className="table table-bordered table-condensed table-hover">
        <ShipmentListHead edit={props.edit} />
        <tbody>
          {
            props.shipments.map((shipment, i) => (
              <ShipmentListItem shipment={shipment} key={i}
                  edit={props.edit}
                  onClick={function handleClick() {
                    props.fillFormFromList(shipment);
                  }}
                  onDelete={function handleDelete() {
                    if (confirm('Do you want to delete this shipment')) { // eslint-disable-line
                      props.dispatch(Actions.deleteShipmentRequest(shipment));
                    }
                  }}
              />
            ))
          }
        </tbody>
    </table>
  </div>
  );
}

ShipmentListView.propTypes = {
//  posts: PropTypes.arrayOf(PropTypes.shape({
//    name: PropTypes.string.isRequired,
//    title: PropTypes.string.isRequired,
//    content: PropTypes.string.isRequired,
//    slug: PropTypes.string.isRequired,
//    cuid: PropTypes.string.isRequired,
//  })).isRequired,
  fillFormFromList: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

// `connect` injects the dispatch method on props
export default connect()(ShipmentListView);
