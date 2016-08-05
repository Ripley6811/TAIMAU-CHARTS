import React from 'react';


export default
class TemplateCreator extends React.Component {
    static propTypes = {
        createTemplate: React.PropTypes.func.isRequired,
    }

    submit = () => {
        const validated = this.keys.every(key =>
             this.refs[key].value.trim().length > 0
        );

        if (validated) {
            const template = {};
            this.keys.forEach(key => template[key] = this.refs[key].value.trim());
            this.props.createTemplate(template);

            this.clearForm();
        }
    }

    clearForm = () => {
        this.keys.forEach((key) => {this.refs[key].value = ""});
    }

    get labels() {
        return ["公司", "Dept", "Unit", "材料名稱", "料號"];
    }

    get keys() {
        return ["company", "dept", "unit", "product", "pn"];
    }

    render() {
        return (
      <form>
        <fieldset>
            <legend>Create New Template</legend>

            <div className="row">
                {this.keys.map((key, i) =>
                    <div className="form-group col-sm-2 col-sm-push-1" key={`template${i}`}>
                        <label className="form-label"
                            style={{height: "19px"}} >
                            {this.labels[i]}
                        </label>
                        <input
                            name={key}
                            className={`${key} form-control`}
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
};
