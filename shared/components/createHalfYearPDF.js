export default function(data) {
    const doc = new jsPDF();

    if (data.shipments.length === 0) {
        alert("No data for that time period.\n找不到時期資料.");
        return;
    }

    doc.setFont('Times', 'Roman');
    doc.altText = nonASCIItext;
    
    doc.altText(30, 30, "This function is incomplete.", 30);
    
    
    
    
    
    

    doc.setProperties({
        title: 'Shipment Report',
        subject: 'Shipment Report',
        author: 'Taimau Chemicals',
        keywords: 'jsPDF',
        creator: 'PDF Automation by Jay W Johnson'
    });

    doc.output('dataurlnewwindow');
}
