/**
 * @overview Generates a pdf in a new window.
 */

export default
function create(shipment, report) {
    const doc = new jsPDF(),
          MARGIN = 30,
          FONT_SIZE = 12,
          THIN_LINE = 0.1,
          THICK_LINE = 0.6;

    // Document settings
    doc.setFont('Times', 'Roman');
    doc.setProperties({
        title: 'Specification Report',
        subject: 'Specification Report',
        author: 'Taimau Chemicals',
        keywords: 'jsPDF',
        creator: 'PDF Automation by Jay W Johnson'
    });
    doc.setDrawColor(180);  // Gray lines
    // Add method for printing Chinese characters.
    doc.altText = nonASCIItext;

    const { product, pn } = shipment;


//        doc.setLineWidth(THICK_LINE);
//        doc.line(20, y+1, 190, y+1);
//        doc.setLineWidth(THIN_LINE);

    // DEBUG: This displays a light grey grid for designing layout
    if (false) {
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


    const colWidth = 50,
          col1x = MARGIN,
          col2x = MARGIN + colWidth,
          col3x = MARGIN + colWidth*2;
    let posY = MARGIN;

    doc.altText(MARGIN, posY, report.companyHeader, FONT_SIZE + 6);
    posY += 8;
    doc.altText(MARGIN, posY, "產品檢驗報告", FONT_SIZE + 3);
    posY += 4;
    doc.altText(MARGIN, posY, "Form FM0716A", FONT_SIZE - 4);
    doc.setLineWidth(THICK_LINE);
    doc.line(MARGIN, posY+2, MARGIN + colWidth, posY+2);
    posY += 10;
    doc.altText(MARGIN, posY, `品名 :\t\t\t ${product}`, FONT_SIZE);
    posY += 6;
    doc.altText(MARGIN, posY, `料號 :\t\t\t ${pn}`, FONT_SIZE);
    posY += 10;
    doc.altText(MARGIN, posY, `製造日期 :\t\t\t ${report.dateProduced}`, FONT_SIZE);
    posY += 6;
    doc.altText(MARGIN, posY, `製造批號 :\t\t\t ${report.lotID}`, FONT_SIZE);
    posY += 6;
    doc.altText(MARGIN, posY, `生產數量 :\t\t\t ${report.lotAmount}`, FONT_SIZE);
    posY += 6;
    doc.altText(MARGIN, posY, `保存期限 :\t\t\t ${report.shelfLife}`, FONT_SIZE);
    posY += 6;
    doc.altText(MARGIN, posY, `取樣人員 :\t\t\t ${report.sampler}`, FONT_SIZE);

    // Tests specs and results in three columns
    posY += 15;
    doc.altText(col1x, posY, "檢 驗 項 目", FONT_SIZE);
    doc.altText(col2x, posY, "規 格", FONT_SIZE);
    doc.altText(col3x, posY, "檢 驗 結 果", FONT_SIZE);
    doc.setLineWidth(THICK_LINE);
    doc.line(MARGIN, posY+2, MARGIN + colWidth*3, posY+2);
    for (let { attr, spec, rslt } of report.tests) {
        if (attr || spec || rslt) {
            posY +=6;
            doc.altText(col1x, posY, attr, FONT_SIZE);
            doc.altText(col2x, posY, spec, FONT_SIZE);
            doc.altText(col3x, posY, rslt, FONT_SIZE);
        } else {
            break;
        }
    }

    posY += 15;
    doc.altText(MARGIN, posY, `檢驗日期 :\t\t\t ${report.dateTested}`, FONT_SIZE);
    posY += 6;
    doc.altText(MARGIN, posY, `結果研判 :\t\t\t ${report.result}`, FONT_SIZE);
    posY += 6;
    doc.altText(MARGIN, posY, `檢驗人員 :\t\t\t ${report.inspector}`, FONT_SIZE);
    posY += 6;
    doc.altText(MARGIN, posY, `製表人員 :\t\t\t ${report.reporter}`, FONT_SIZE);






    doc.output('dataurlnewwindow');
}
