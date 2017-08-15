import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { getRoute } from '../../utils/utils'
// Actions
//import { fetchBarrelShipments,
//         addShipmentRequest,
//         updateShipmentRequest,
//         deleteShipmentRequest } from '../../redux/state/barrelShipments.redux'
// Components
//import BarrelShipmentTable from './components/BarrelShipmentTable'
//import BarrelShipmentEditor from './components/BarrelShipmentEditor'

import { fetchDirectory } from '../../redux/state/companies.redux'


const tableFields = [
    { label: '簡稱', key: 'abbr_name'   },
    { label: '全名', key: 'full_name'   },
    { label: '英名', key: 'eng_name'    },
    { label: '拼音', key: 'abbr_pinyin' },
]


export default connect(
    // Pull items from store
    ({query, directory}) =>
    ({query, directory}),
    // Bind actions with dispatch
    {  }
)(class DirectoryView extends Component {
    static need = [fetchDirectory]

    /**
     * Validates incoming props.
     */
    static propTypes = {
        // Props from parent
        directory: PropTypes.array.isRequired,
    }

    group_badge = (name) => {
        if (name !== undefined) {
            return <label className="badge">{name}</label>;
        }
        return;
    }

    render() {
        const { props: {directory}, state } = this;

        return (
            <div>
                <table className="table table-bordered table-condensed table-hover">
                    <thead>
                        <tr>
                            { tableFields.map(
                                (each, i) => <th key={i}>{i===0 ? this.group_badge("組") : ""} {each.label}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                    { directory.map((s, i) =>
                        <tr  key={`${i}-${s._id}`} data-toggle="tooltip" title={s.note}>
                            { tableFields.map(
                                (each, j) => <td key={`tablecol${j}`}>{j===0 ? this.group_badge(s.group_name) : ""} {s[each.key]}</td>
                            )}
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        );
    }
})
