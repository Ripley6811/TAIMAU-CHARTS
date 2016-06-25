import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';

const OptionsListHead = () =>
    <thead>
        <tr>
          <th>公司</th>
          <th>Dept</th>
          <th>Unit</th>
          <th>材料名稱</th>
          <th>料號</th>
          <th>除</th>
        </tr>
    </thead>

const OptionsListItem = (props) =>
    <tr className="single-post" onClick={props.onClick}>
      <td className="cell-company">{props.template.company}</td>
      <td className="cell-dept">{props.template.dept}</td>
      <td className="cell-unit">{props.template.unit}</td>
      <td className="cell-name">{props.template.name}</td>
      <td className="cell-pn">{props.template.pn}</td>
    
      <td className="danger text-center cell-button" onClick={props.onDelete}>
          <span className="glyphicon glyphicon-trash"></span>
      </td>
    </tr>

function OptionsListView(props) {
  return (<div style={{maxWidth: '900px', margin: 'auto'}}>
    <legend>Shipment Templates</legend>
    <table className="table table-bordered table-condensed table-hover">
        <OptionsListHead />
        <tbody>
          {
            props.templates.map((template, i) => (
              <OptionsListItem template={template} key={i}
                  onDelete={function handleDelete() {
                    if (confirm('Do you want to delete this template')) { // eslint-disable-line
                      props.dispatch(Actions.deleteTemplateRequest(template));
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

OptionsListView.propTypes = {
    dispatch: PropTypes.func.isRequired,
    templates: PropTypes.arrayOf(PropTypes.shape({
        company: PropTypes.string.isRequired,
        dept: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        pn: PropTypes.string.isRequired,
    })).isRequired,
}

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    templates: store.templates,
  };
}

export default connect(mapStateToProps)(OptionsListView);