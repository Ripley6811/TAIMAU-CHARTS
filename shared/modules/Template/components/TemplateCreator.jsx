import React, { Component, PropTypes } from 'react'


const BARREL_TYPE = Symbol('BARREL_TYPE')
const TANKER_TYPE = Symbol('TANKER_TYPE')


const inputFields = [
    { key: "company",    type: "text",     t_type: [TANKER_TYPE, BARREL_TYPE], colWidth: 2, label: "公司" },
    { key: "dept",       type: "text",     t_type: [TANKER_TYPE], colWidth: 2, label: "Dept", placeholder: "K#" },
    { key: "unit",       type: "text",     t_type: [TANKER_TYPE], colWidth: 2, label: "Unit", placeholder: "純水, 廢水, etc." },
    { key: "product",    type: "text",     t_type: [TANKER_TYPE, BARREL_TYPE], colWidth: 2, label: "材料名稱" },
    { key: "pn",         type: "text",     t_type: [TANKER_TYPE, BARREL_TYPE], colWidth: 4, label: "料號" },
    { key: "lotPrefix",  type: "text",     t_type: [BARREL_TYPE], colWidth: 2, label: "批次字首", placeholder: "P, B, M, etc." },
    { key: "rtCode",     type: "text",     t_type: [BARREL_TYPE], colWidth: 2, label: "RT Code (四個字)", placeholder: "xxxx ⇐ 6A05xxxx01" },
    { key: "pkgQty",     type: "text",     t_type: [BARREL_TYPE], colWidth: 2, label: "容量", placeholder: '"25 kg", "10 包", etc.' },
    { key: "shelfLife",  type: "number",   t_type: [BARREL_TYPE], colWidth: 2, label: "保存期間", placeholder: "#月" },
    { key: "barcode",    type: "checkbox", t_type: [BARREL_TYPE], colWidth: 2, label: "barcode" },
    { key: "datamatrix", type: "checkbox", t_type: [BARREL_TYPE], colWidth: 2, label: "datamatrix" },
]


export default
class TemplateCreator extends Component {
    static propTypes = {
        template: PropTypes.object.isRequired,
        editMode: PropTypes.bool.isRequired,
        saveTemplate: PropTypes.func.isRequired,
        setFields: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
    }

    validateFieldsAndGetType = () => {
        const valueOf = key => this.refs[key].value;
        const checked = key => this.refs[key].checked;

        if (!!valueOf('lotPrefix') || !!valueOf('pkgQty') || checked('barcode')) {
            const requiredKeys = ['company','product','lotPrefix','pkgQty'];
            const keysSatisfied = requiredKeys.every(key => valueOf(key));
            if (!keysSatisfied) {
                return false;
            }

            if (!checked('barcode') && !checked('datamatrix')) {
                return false;
            }
            return BARREL_TYPE;
        } else {
            const requiredKeys = ['company','dept','unit','product','pn'];
            const keysSatisfied = requiredKeys.every(key => valueOf(key));
            if (!keysSatisfied) {
                return false;
            }
            return TANKER_TYPE;
        }
        alert('Unknown error in field validation!');
        return false;
    }

    setFields = () => {
        const keyValues = {},
              templateType = this.validateFieldsAndGetType();

        inputFields.forEach(({ key, type, required }) => {
            switch (type) {
                case 'text':
                    Object.assign(keyValues, {[key]: this.refs[key].value.trim()});
                    break;
                case 'number':
                    Object.assign(keyValues, {[key]: Number(this.refs[key].value)});
                    break;
                case 'checkbox':
                    Object.assign(keyValues, {[key]: this.refs[key].checked});
                    break;
            }
        });

        this.props.setFields(keyValues);
    }

    submit = () => {
        const templateType = this.validateFieldsAndGetType(),
              newTemplate = {};
        if (!templateType) return;

        inputFields.forEach(({key, type}) => {
            switch (type) {
                case 'text':
                    if (templateType === BARREL_TYPE && key === 'dept') break;
                    if (templateType === BARREL_TYPE && key === 'unit') break;
                    newTemplate[key] = this.refs[key].value.trim();
                    break;
                case 'number':
                    if (templateType !== BARREL_TYPE) break;
                    newTemplate[key] = Number(this.refs[key].value);
                    break;
                case 'checkbox':
                    if (templateType !== BARREL_TYPE) break;
                    newTemplate[key] = this.refs[key].checked;
                    break;
                default:
                    alert(`Key-value not saved for ${key}!`);
            }
        });

        if (newTemplate.shelfLife === 0) delete newTemplate.shelfLife;
        if (newTemplate.rtCode.length === 0) delete newTemplate.rtCode;
        if (newTemplate.pn.length === 0) delete newTemplate.pn;

        switch (templateType) {
            case TANKER_TYPE:
                this.props.createTankerTemplate(newTemplate);
                break;
            case BARREL_TYPE:
                this.props.createBarrelTemplate(newTemplate);
                break;
        }

        this.props.reset();
    }

    render() {
        const { template, editMode } = this.props;
        const templateType = !!template.dept || !!template.unit ? TANKER_TYPE :
            !!template.lotPrefix || !!template.pkgQty ||
              !!template.rtCode || !!template.shelfLife ? BARREL_TYPE : undefined;

        return (
      <div>
            { this.props.editMode ?
                <legend>Editing Template <small>({template._id})</small></legend> :
                <legend>Create New Template</legend> }

            <div className="row">
                {inputFields.map(({ key, label, type, colWidth, t_type, placeholder }, i) =>
                    <div className={`form-group col-sm-${colWidth}`} key={key}>
                        <label className="form-label"
                            style={templateType && t_type.indexOf(templateType) < 0 ? {color: "lightgrey"} : {}} >
                            {label}
                        </label>
                        <input
                            disabled={templateType && t_type.indexOf(templateType) < 0}
                            type={type}
                            name={key}
                            onChange={this.setFields}
                            className={`${key} form-control`}
                            placeholder={placeholder || ''}
                            ref={key}
                            value={template[key] || ''}
                            checked={type === 'checkbox' ? template[key] : null} />
                    </div>
                )}
            </div>
            <br />
            <div className="row">
                <button className="btn btn-warning" ref='saveBtn' onClick={this.props.saveTemplate} >
                    { editMode ? "Save Updates" : "Save New Record" }
                </button>
                &nbsp;
                <button className="btn btn-primary" onClick={this.props.reset} >
                    { editMode ? "Cancel Editing" : "Reset All" }
                </button>
            </div>
      </div>
        )
    }
}
