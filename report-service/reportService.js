// reportService.js
const ejs = require('ejs');
const fs = require('fs');
const puppeteer = require('puppeteer');
const XLSX = require('xlsx');
const db = require('./db');

// Fetch data from the database
async function fetchData() {
    const [rows] = await db.query('SELECT product, quantity, price FROM sales');
    return rows.map(row => [row.product, row.quantity, row.price]);
}



// Generate HTML report
async function generateHTMLReport(data) {
    const reportData = {
        title: 'Sales Report',
        headers: ['Product', 'Quantity', 'Price'],
        data,
    };
    return new Promise((resolve, reject) => {
        ejs.renderFile('views/reportTemplate.ejs', reportData, (err, html) => {
            if (err) reject(err);
            else {
                fs.writeFileSync('reports/report.html', html);
                resolve(html);
            }
        });
    });
}

// Convert HTML to PDF
async function generatePDFReport(html) {
    const browser = await puppeteer.launch(); //Launch a Headless Browser , Needed to render HTML and capture it as a PDF.
    const page = await browser.newPage();                           //Create a New Page (Tab)
    await page.setContent(html);                                   //Set the HTML Content
    await page.pdf({ path: 'reports/report.pdf', format: 'A4' }); //Generate and Save PDF
    await browser.close();
}

// Generate Excel Report
async function generateExcelReport(data) {
    const wb = XLSX.utils.book_new();     //Create a New Workbook //Create a Worksheet with Data

    const ws = XLSX.utils.aoa_to_sheet([['Product', 'Quantity', 'Price'], ...data]);  

    //Converts an array of arrays (AOA) into an Excel worksheet.
//The first array ['Product', 'Quantity', 'Price'] sets the header row.
//...data spreads the input data into the sheet.

    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');  //Append Worksheet to Workbook (workbook -report.xlsx))
    XLSX.writeFile(wb, 'reports/report.xlsx');  //Save Workbook as Excel File
}

// Main function to generate reports
async function generateReports() {
    const data = await fetchData();
    const html = await generateHTMLReport(data);
    await generatePDFReport(html);
    await generateExcelReport(data);
}

module.exports = generateReports;
