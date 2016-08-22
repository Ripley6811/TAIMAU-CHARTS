import React from 'react'


const BARREL_TYPE = Symbol('BARREL_TYPE')
const TANKER_TYPE = Symbol('TANKER_TYPE')


export default
class TemplateCreator extends React.Component {
    static propTypes = {
        createTankerTemplate: React.PropTypes.func.isRequired,
        createBarrelTemplate: React.PropTypes.func.isRequired,
    }

    validateFieldsAndGetType = () => {
        const valueOf = key => this.refs[key].value;
        const checked = key => this.refs[key].checked;

        if (!!valueOf('rtCode') || !!valueOf('pkgQty')) {
            const requiredKeys = ['company','product','pn','lotPrefix','rtCode','pkgQty'];
            const keysSatisfied = requiredKeys.every(key => valueOf(key));
            if (!keysSatisfied) {
                alert("A required field is missing a value.");
                return false;
            }

            if (!!checked('barcode') === !!checked('datamatrix')) {
                alert("Either 'barcode' or 'datamatrix' must be selected.");
                return false;
            }
            return BARREL_TYPE;
        } else {
            const requiredKeys = ['company','dept','unit','product','pn'];
            const keysSatisfied = requiredKeys.every(key => valueOf(key));
            if (!keysSatisfied) {
                alert("A required field is missing a value.");
                return false;
            }
            return TANKER_TYPE;
        }
        alert('Unknown error in field validation!');
        return false;
    }

    submit = () => {
        const templateType = this.validateFieldsAndGetType(),
              newTemplate = {};
        if (!templateType) return;

        this.fieldData.forEach(({key, type}) => {
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

        switch (templateType) {
            case TANKER_TYPE:
                this.props.createTankerTemplate(newTemplate);
                break;
            case BARREL_TYPE:
                this.props.createBarrelTemplate(newTemplate);
                break;
        }

        this.clearForm();
    }

    clearForm = () => {
        this.fieldData.forEach(({key, type: type}) => {
            if (type === 'text' || type === 'number') {
                this.refs[key].value = "";
            }
        });
    }

    get fieldData() {
        return [
            { key: "company",    type: "text",     colWidth: 2, label: "公司" },
            { key: "dept",       type: "text",     colWidth: 2, label: "Dept", placeholder: "K#" },
            { key: "unit",       type: "text",     colWidth: 2, label: "Unit", placeholder: "純水, 廢水, etc." },
            { key: "product",    type: "text",     colWidth: 2, label: "材料名稱" },
            { key: "pn",         type: "text",     colWidth: 4, label: "料號" },
            { key: "lotPrefix",  type: "text",     colWidth: 2, label: "批次字首", placeholder: "P, B, M, etc." },
            { key: "rtCode",     type: "text",     colWidth: 2, label: "RT Code (四個字)", placeholder: "xxxx ⇐ 6A05xxxx01" },
            { key: "pkgQty",     type: "text",     colWidth: 2, label: "容量", placeholder: '"25 kg", "10 包", etc.' },
            { key: "shelfLife",  type: "number",   colWidth: 2, label: "保存期間", placeholder: "#月" },
            { key: "barcode",    type: "checkbox", colWidth: 2, label: "barcode" },
            { key: "datamatrix", type: "checkbox", colWidth: 2, label: "datamatrix" },
        ]
    }

    get fieldLabels() {
        return this.fieldData.map(f => f.label);
    }

    get fieldKeys() {
        return this.fieldData.map(f => f.key);
    }

    render() {
        return (
      <form>
        <fieldset>
            <legend>Create New Template</legend>

            <div className="row">
                {this.fieldData.map(({ key, label, type, colWidth, placeholder }, i) =>
                    <div className={`form-group col-sm-${colWidth}`} key={key}>
                        <label className="form-label"
                            style={{height: "19px"}} >
                            {label}
                        </label>
                        <input
                            type={type}
                            name={key}
                            className={`${key} form-control`}
                            placeholder={placeholder || ''}
                            ref={key} />
                    </div>
                )}
            </div>
            <div className="row text-center">
                <input id="template-submit-btn" className="btn btn-success btn-margin" type="button"
                    value="提交 / Submit" onClick={this.submit} />
            </div>
            <div className="row text-center">
                <input id="template-clear-btn" className="btn btn-primary btn-margin" type="button"
                    value="Clear Fields" onClick={this.clearForm} />
            </div>
        </fieldset>
      </form>
        )
    }
}
