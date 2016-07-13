export default function(data) {
    const doc = new jsPDF();

    if (data.shipments.length === 0) {
        alert("No data for that time period.\n找不到時期資料.");
        return;
    }

    doc.setFont('Times', 'Roman');
    doc.altText = nonASCIItext;

    /**
     * Display a light grey grid for designing layout
     */
    if (0) {
        doc.setDrawColor(200);
        doc.setTextColor(200,200,200);
        for (var i=0; i<50; i++) {
            doc.rect(0,i*10,300,10);
            doc.text(0,i*10, (i*10).toString());
            doc.rect(i*10,0,10,300);
            doc.text(i*10,5, (i*10).toString());
        }
        doc.setDrawColor(0);
        doc.setTextColor(0,0,0);
    }

//    for (let company in )
    let posY;
    const MARGIN = 20;
    const FONT_SIZE = 11;
    const headers = [
        "頁","進貨日期","材料名稱","料號","需求量","需求單位"
    ];
    const keys = [
        "refPage", "date", "product", "pn", "amount", "dept"
    ];
    const xPositions = [];
    [0, 10,  25,      40,       45,    25]
    .reduce((a,b,i) => xPositions[i] = a+b, MARGIN);
    
    function printHeader() {
        posY = 20;
        doc.altText(75, posY, "台茂槽車進貨需求確認單", FONT_SIZE+2);
        posY += 8;
        xPositions.forEach((x,i) => doc.altText(x, posY, headers[i], FONT_SIZE));

        doc.setLineWidth(0.8);
        doc.line(20, posY+1, 190, posY+1);
        doc.setLineWidth(0.1);
        posY += 2;
    }
    
    let refPage = undefined;
    let shipment = undefined;
    let company = undefined;
    for (let i=0; i<data.shipments.length; i++) {
        shipment = data.shipments[i];
        
        if (shipment.company !== company) {
            if (company !== undefined) {
                doc.addPage();
            }
            company = shipment.company;
            printHeader();
            doc.altText(15, 15, company, 16);
        }
        
        if (posY > 250) {
            doc.addPage();
            printHeader();
            doc.altText(15, 15, company, 16);
        }
        
        posY+= 5;
        if (shipment.refPage !== refPage) {
            doc.altText(xPositions[0], posY, ""+shipment.refPage, FONT_SIZE);
            refPage = shipment.refPage;
            doc.line(20, posY+1-5, 190, posY+1-5);
        }
        const date = new Date(shipment.date);
        doc.altText(xPositions[1], posY, `${date.getMonth()+1} / ${date.getDate()}`, FONT_SIZE);
        doc.altText(xPositions[2], posY, ""+shipment[keys[2]], FONT_SIZE);
        doc.altText(xPositions[3], posY, ""+shipment[keys[3]], FONT_SIZE);
        doc.altText(xPositions[4], posY, ""+shipment[keys[4]], FONT_SIZE);
        doc.altText(xPositions[5], posY, `${shipment.dept} ${shipment.unit}`, FONT_SIZE);
//        keys.forEach((key, index) => doc.altText(xPositions[index], posY, ""+data.shipments[i][key], FONT_SIZE));
    }








    doc.setProperties({
        title: 'Shipment Report',
        subject: 'Shipment Report',
        author: 'Taimau Chemicals',
        keywords: 'jsPDF',
        creator: 'PDF Automation by Jay W Johnson'
    });

    doc.output('dataurlnewwindow');
}
