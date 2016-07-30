/**
 * @overview Generates a pdf in a new window. Waste water report is a
 * half-year report.
 */

export default function(data) {
    const doc = new jsPDF(),
          SHIPMENTS = data.shipments,
          COMPANY = data.company,
          START_DATE = new Date(data.start),
          END_DATE = new Date(data.end),
          LEFT_MARGIN = 20,
          LEFT_MARGIN_COL2 = 109,
          DEFAULT_FONT_SIZE = 11,
          TABLE_HEADERS = ["日期","材料名稱","需求量 (kg)","需求單位"],
          TABLE_KEYS = ["date","product","amount","dept"],
          TABLE_X_POS = [],
          THIN_LINE = 0.1,
          THICK_LINE = 0.6,
          TABLE_START_Y = 30;

    // Create TABLE_X_POS positions based on desired spacing.
    [0, 15, 24, 24].reduce((a,b,i) => TABLE_X_POS[i] = a+b, LEFT_MARGIN);
    if (TABLE_X_POS.length !== TABLE_HEADERS.length) {
        throw "Table positions and table headers do not match in length";
    }

    let posY,
        pageNo = 1,
        columnNo = 1;

    // Check data for problems
    if (SHIPMENTS.length === 0) {
        alert("No data for that time period.\n找不到時期資料.");
        return;
    }

    // Document settings
    doc.setFont('Times', 'Roman');
    doc.setProperties({
        title: 'Shipment Report',
        subject: 'Shipment Report',
        author: 'Taimau Chemicals',
        keywords: 'jsPDF',
        creator: 'PDF Automation by Jay W Johnson'
    });
    doc.setDrawColor(180);

    // Add method for printing Chinese characters.
    doc.altText = nonASCIItext;

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



    /**
     * Writes the table header to document at indicated position.
     * @param   {number} y Desired print position for next line.
     * @returns {number} Next print position after writing table header
     */
    function printTableHeader(y) {
        TABLE_X_POS.forEach((x,i) => doc.altText(x, y, TABLE_HEADERS[i], DEFAULT_FONT_SIZE));
        TABLE_X_POS.forEach((x,i) => doc.altText(
            x - LEFT_MARGIN + LEFT_MARGIN_COL2, y, TABLE_HEADERS[i], DEFAULT_FONT_SIZE));

        doc.setLineWidth(THICK_LINE);
        doc.line(LEFT_MARGIN, y+1, LEFT_MARGIN+81, y+1);
        doc.line(LEFT_MARGIN_COL2, y+1, LEFT_MARGIN_COL2+81, y+1);
        doc.setLineWidth(THIN_LINE);
        y += 5;

        return y;
    }

    /**
     * Returns a Taiwan year date string for printing.
     * @param   {object} date Date object
     * @returns {string} Formatted date string with Taiwan year (e.g. "105 / 2 / 14").
     */
    function taiwanDateFormat(date) {
        return `${date.getFullYear()-1911} / ${date.getMonth()+1} / ${date.getDate()}`;
    }

    /**
     * Writes the company name and time period at top and page number at bottom.
     */
    function printHeadFoot() {
        doc.altText(15, 15, COMPANY, 18);
        doc.altText(15, 20, taiwanDateFormat(START_DATE) +
                    " ~ " + taiwanDateFormat(END_DATE), 12);
        doc.altText(78, 15, "台茂槽車進貨需求確認單", 14);
        doc.altText(104, 290, pageNo++, DEFAULT_FONT_SIZE);
    }

    function calcSummaryData() {
        const units = Object.keys(
            d3.nest()
            .key(d => d.unit)
            .rollup(array => null)
            .map(SHIPMENTS)
        );

        // Nest by product number (pn)
        const pnData = d3.nest()
            .key(d => d.pn)
            .rollup(array => Object.assign(
                {product: array[0].product, pn: array[0].pn},
                d3.nest().key(d => d.unit)
                .rollup(a => d3.sum(a, d => d.amount)).map(array)
            ))
            .map(SHIPMENTS);

        // Convert object to array.
        const pnDataArray = Object.keys(pnData).map(key => pnData[key]);

        return [units, pnDataArray];
    }

    // Temporarily store recent shipment.
    let shipment = undefined;

    // Print 1st header/footer
    printHeadFoot();

    // Print product summary table header
    const UNIT_AMT_SPACING = 18;
    const [unitNames, pnData] = calcSummaryData();
    posY = TABLE_START_Y;  // START POSITION for data tables
    doc.altText(LEFT_MARGIN, posY, "WASTE WATER SUMMARY", DEFAULT_FONT_SIZE+3);
    posY += 6;
    doc.altText(LEFT_MARGIN, posY, "材料名稱", DEFAULT_FONT_SIZE);
    doc.altText(LEFT_MARGIN+30, posY, "料號", DEFAULT_FONT_SIZE);
    let ui;
    for (ui=0; ui<unitNames.length; ui++) {
        doc.altText(LEFT_MARGIN+70+UNIT_AMT_SPACING*ui, posY, unitNames[ui] + " (kg)", DEFAULT_FONT_SIZE);
    }
    // Show totals if more then one unit is shown.
    if (unitNames.length > 1) {
        doc.altText(LEFT_MARGIN+70+UNIT_AMT_SPACING*ui, posY, "總額", DEFAULT_FONT_SIZE);
    }
    doc.setLineWidth(THICK_LINE);
    doc.line(20, posY+1, 190, posY+1);

    // Print product summary table rows
    doc.setLineWidth(THIN_LINE);
    for (let i=0; i<pnData.length; i++) {
        posY+= 5;
        doc.altText(LEFT_MARGIN, posY, pnData[i].product, DEFAULT_FONT_SIZE);
            doc.altText(LEFT_MARGIN+30, posY, pnData[i].pn, DEFAULT_FONT_SIZE-2);
        let allUnitsTotal = 0;
        let ui;
        for (ui=0; ui<unitNames.length; ui++) {
            const UNIT = unitNames[ui];
            doc.altText(LEFT_MARGIN+70+UNIT_AMT_SPACING*ui, posY, pnData[i][UNIT] || "", DEFAULT_FONT_SIZE);
            allUnitsTotal += pnData[i][UNIT] || 0;
        }
        // Show totals if more then one unit is shown.
        if (unitNames.length > 1) {
            doc.altText(LEFT_MARGIN+70+UNIT_AMT_SPACING*ui, posY, `${allUnitsTotal}`, DEFAULT_FONT_SIZE);
        }
    }


    // Print shipments table
    posY += 12;
    doc.altText(LEFT_MARGIN, posY, "SHIPMENTS", DEFAULT_FONT_SIZE+3);
    posY += 6;
    doc.setLineWidth(THIN_LINE);
    posY = printTableHeader(posY);
    let lastTableEndY = posY;
    for (let i=0; i<SHIPMENTS.length; i++) {
        shipment = SHIPMENTS[i];

        // NEW PAGE when reaching end. Leave space for summary
        if (posY > 275 && columnNo === 2) {
            doc.addPage();
            columnNo = 1;
            printHeadFoot();
            posY = printTableHeader(TABLE_START_Y);
            lastTableEndY = posY;
        } else if (posY > 275 && columnNo === 1) {
            columnNo = 2;
            posY = lastTableEndY;
        }

        const date = new Date(shipment.date);
        const c2offset = (columnNo-1)*(LEFT_MARGIN_COL2-LEFT_MARGIN);
        doc.altText(TABLE_X_POS[0] + c2offset, posY, `${date.getMonth()+1} / ${date.getDate()}`, DEFAULT_FONT_SIZE);
        doc.altText(TABLE_X_POS[1] + c2offset, posY, shipment[TABLE_KEYS[1]], DEFAULT_FONT_SIZE);
        doc.altText(TABLE_X_POS[2] + c2offset, posY, shipment[TABLE_KEYS[2]], DEFAULT_FONT_SIZE);
        doc.altText(TABLE_X_POS[3] + c2offset, posY, `${shipment.dept} ${shipment.unit}`, DEFAULT_FONT_SIZE);
        posY+= 5;
    }









    doc.output('dataurlnewwindow');
}
