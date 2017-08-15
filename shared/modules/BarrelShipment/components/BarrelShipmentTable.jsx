import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import * as utils from '../../../utils/utils'
// Actions
import { fetchBarrelShipments } from '../../../redux/state/barrelShipments.redux'
// Components
import TableHead from '../../../components/TableHead'
import TableRow from '../../../components/TableRow'
import { FA_TRASH, FA_LEVEL_UP, FA_PENCIL } from '../../../components/FontAwesome';



const tableFields = [
    { key: 'formID',    label: '出貨編號' },
    { key: 'shipMMDD',  label: '出貨日期' },
    { key: 'product',   label: '材料名稱' },
    { key: 'makeMMDD',  label: '製造日期' },
//    { key: 'pkgQty',    label: '桶子容量' },
//    { key: 'lotID',     label: '批號' },
    { key: 'lotSET',    label: '批號範圍' },
    { key: 'rtFULL',    label: 'RT' },
    { key: 'note',      label: '備註' },
    { key: 'orderID',   label: '訂單編號' },
]
const buttonCellStyle = {
    cursor: "pointer",
    width: "36px",
    color: "black",
}


export default
class BarrelShipmentsView extends Component {
    /**
     * Validates incoming props.
     */
    static propTypes = {
        // Props from parent
        barrelShipments: PropTypes.array.isRequired,
        deleteShipment: PropTypes.func.isRequired,
        prefillNewShipment: PropTypes.func.isRequired,
        editShipment: PropTypes.func.isRequired,
    }

    get tableHeaders() {
        return tableFields.map(f => f.label);
    }

    get tableKeys() {
        return tableFields.map(f => f.key);
    }

    render() {
        const { props, state } = this;

        // Creates a new list of objects with additional attributes
        const shipments = props.barrelShipments.map(shipment =>
            Object.assign({}, shipment, {
                makeMMDD: `${1+shipment.makeMonth || ''} / ${shipment.makeDate || ''}`,
                shipMMDD: `${1+shipment.shipMonth} / ${shipment.shipDate}`,
                lotSET: utils.getLotSet(shipment),
                rtFULL: shipment.rtCode ? utils.getRoute(shipment) : '',
            })
        );

        return (
            <div>
                <legend>Barrel Shipment History
                    <label className="badge" style={{position: "relative", left: "20px", backgroundColor: "gold", color: "black"}}>
                        金色 : 最近新增
                    </label>
                </legend>

                <table className="table table-bordered table-condensed table-hover">
                    <TableHead headers={this.tableHeaders.concat("編","續","刪")} />
                    <tbody>
                    {shipments.map((s, i) => (
                    <TableRow data={s} keys={this.tableKeys} key={`${i}-${s._id}`} >
                         {/** Delete button added as a child of TableRow. **/}
                         <td className="text-center success"
                             style={buttonCellStyle}
                             onClick={() => props.editShipment(s)}>
                              {FA_PENCIL}
                         </td>
                         <td className="text-center warning"
                             style={buttonCellStyle}
                             onClick={() => props.prefillNewShipment(s)}>
                              {FA_LEVEL_UP}
                         </td>
                         <td className="delete-row-btn danger text-center"
                             style={buttonCellStyle}
                             onClick={() => props.deleteShipment(s)}>
                              {FA_TRASH}
                         </td>
                    </TableRow>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
