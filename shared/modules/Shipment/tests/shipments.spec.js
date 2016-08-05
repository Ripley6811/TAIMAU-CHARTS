/**
 * @overview In browser testing of UI
 */
import deepFreeze from 'deep-freeze';

export default function(component) {
    console.log('Shipments SPEC loaded');
    
    describe('Testing shipments page:', function() {
        const formControls = document.querySelectorAll("input.form-control");
        const submitBtn = document.querySelector("#shipment-submit-btn");
        const testShipment = {
            date: "2016-1-5",
            refPage: 13,
            note: "",
            amount: 2222,
            company: "Cobra",
            dept: "Destro",
            unit: "X3",
            product: "Venom",
            pn: "V123-2345"
        }
        deepFreeze(testShipment);
        // Create one Shipment for a new company with whitespace in input
        const submitShipment = (shipment) => {
            for (let fc of formControls) {
                // input name is attribute name
                fc.value = `    ${shipment[fc.name]}  `;
            }
            submitBtn.click();
        }
        // Delete one Shipment if test company button exists
        const deleteShipment = (done) => {
            if (document.querySelector(`#${testShipment.company}`)) {
                // Open company Shipment list
                document.querySelector(`#${testShipment.company}`).click();
                // Delete after component mounts
                setTimeout(function() {
                    document.querySelectorAll(`.delete-row-btn`)[0].click();
                    done();
                }, 1000);
            }
        }
        
        
        it('Should require all fields except "note".', function(done) {
            done();
        })
        
        it('Should not submit future dates.', function(done) {
            done();
        })
        
    });
}















