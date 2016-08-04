/**
 * @overview In browser testing of UI
 */
import deepFreeze from 'deep-freeze';

export default function(component) {
    console.log('Finished Loading');
    
    describe('After creating one template for a new company:', function() {
        const formControls = document.querySelectorAll("input.form-control");
        const submitBtn = document.querySelector("#template-submit-btn");
        const testTemplate = {
            company: "Cobra",
            dept: "Destro",
            unit: "X3",
            product: "Venom",
            pn: "V123-2345"
        }
        deepFreeze(testTemplate);
        // Create one template for a new company with whitespace in input
        const submitTemplate = (template) => {
            for (let fc of formControls) {
                // input name is attribute name
                fc.value = `    ${template[fc.name]}  `;
            }
            submitBtn.click();
        }
        // Delete one template if test company button exists
        const deleteTemplate = (done) => {
            if (document.querySelector(`#${testTemplate.company}`)) {
                // Open company template list
                document.querySelector(`#${testTemplate.company}`).click();
                // Delete after component mounts
                setTimeout(function() {
                    document.querySelectorAll(`.delete-row-btn`)[0].click();
                    done();
                }, 1000);
            }
        }
        
        beforeAll(function(done) {
            submitTemplate(testTemplate);
            // Change to new company view
            setTimeout(function() {
                document.querySelector(`#${testTemplate.company}`).click();
                setTimeout(done, 500);
            }, 500);
        })
        
        afterAll(function(done) {
            deleteTemplate(done);
        })
        
        it('should trim the whitespace from input text.', function(done) {
            const templates = component.filteredTemplates();
            expect(templates.length).toEqual(1);
            expect(templates[0].company).toEqual(testTemplate.company);
            expect(templates[0].dept).toEqual(testTemplate.dept);
            expect(templates[0].pn).toEqual(testTemplate.pn);
            done();
        })
        
        it('should clear all fields after submission.', function(done) {
            const everyFormControl = Array.prototype.every.bind(formControls);
            expect(everyFormControl(each => each.value === "")).toEqual(true);
            done();
        });
        
        it('should add a sidebar button for new company.', function(done) {
            const companyBtn = document.getElementById(testTemplate.company);
            expect(companyBtn).not.toEqual(null);
            done();
        });
        
        it('should add a sidebar button for new dept.', function(done) {
            const companyBtn = document.getElementById(`${testTemplate.company}-${testTemplate.dept}`);
            expect(companyBtn).not.toEqual(null);
            done();
        });
        
        it('should not add a duplicate template.', function(done) {
            const beforeLength = component.props.templates.length;
            submitTemplate(testTemplate);
            
            setTimeout(function() {
                expect(component.props.templates.length).toEqual(beforeLength);
                done();
            }, 500);
        })
        
        it('should have one item in filtered templates list.', function(done) {
            expect(component.filteredTemplates().length).toEqual(1);
            done();
        });
        
        describe('should not submit if a field is blank.', function() {
            
            it('should fail to submit when missing company', function(done) {
                submitTemplate(Object.assign({}, testTemplate, {company:""}));

                setTimeout(function() {
                    expect(document.querySelector("input.dept").value.trim()).toEqual(testTemplate.dept);
                    expect(component.filteredTemplates().length).toEqual(1);
                    done();
                }, 500);
            })
            
            it('should fail to submit when missing dept', function(done) {
                submitTemplate(Object.assign({}, testTemplate, {dept:""}));

                setTimeout(function() {
                    expect(document.querySelector("input.company").value.trim()).toEqual(testTemplate.company);
                    expect(component.filteredTemplates().length).toEqual(1);
                    done();
                }, 500);
            })
            
            it('should fail to submit when missing unit', function(done) {
                submitTemplate(Object.assign({}, testTemplate, {unit:""}));

                setTimeout(function() {
                    expect(document.querySelector("input.company").value.trim()).toEqual(testTemplate.company);
                    expect(component.filteredTemplates().length).toEqual(1);
                    done();
                }, 500);
            })
            
            it('should fail to submit when missing product', function(done) {
                submitTemplate(Object.assign({}, testTemplate, {product:""}));

                setTimeout(function() {
                    expect(document.querySelector("input.company").value.trim()).toEqual(testTemplate.company);
                    expect(component.filteredTemplates().length).toEqual(1);
                    done();
                }, 500);
            })
            
            it('should fail to submit when missing pn', function(done) {
                submitTemplate(Object.assign({}, testTemplate, {pn:""}));

                setTimeout(function() {
                    expect(document.querySelector("input.company").value.trim()).toEqual(testTemplate.company);
                    expect(component.filteredTemplates().length).toEqual(1);
                    
                    done();
                }, 500);
            })
        })
    });
}















