const router = require('express').Router();
var Excel = require('exceljs');

var wb = new Excel.Workbook();
var path = require('path');
const filePath = path.resolve(__dirname, 'data.xlsx');
var datas = [];
var dataSheet;

router.get('/', function (req, res) {
    wb.xlsx.readFile(filePath)
        .then(function () {
            var sheet = wb.getWorksheet("Sheet1");
            dataSheet = sheet;

            var m2Col = sheet.getColumn(2);
            var m1Col = sheet.getColumn(4);
            m2Col.eachCell((m2Cell, rowNumber) => {
                if (m2Cell.value)
                    var m2values = m2Cell.value.split('-');
                if (m2values.length === 2) {

                    datas.push({
                        type: "m2",
                        row: rowNumber,
                        min: m2values[0],
                        max: m2values[1]
                    });
                }
            });
            m1Col.eachCell((m1Cell, rowNumber) => {
                if (m1Cell.value !== null)
                    var m1values = m1Cell.value.split('-');

                if (m1values) {
                    if (m1values.length === 2) {
                        datas.push({
                            type: "m1",
                            row: rowNumber,
                            min: parseFloat(m1values[0]),
                            max: parseFloat(m1values[1])
                        });
                    }


                }
            });
        })
        .catch(err => {
            console.log(err);
        })

    //res.render('index');
    res.sendFile('index.html', { root: path.join(__dirname, '../views') });

});

router.post('/search', (req, res) => {
    var m1 = parseFloat(req.body.m1);
    var m2 = parseFloat(req.body.m2);

    var results = [];
    if (!isNaN(m1) || !isNaN(m2)) {

        datas.forEach(data => {
            
            if (data.type === 'm2') {
                if (m2 >= data.min && m2 <= data.max) {
                    var row = dataSheet.getRow(data.row);
                    results.push({
                        type: 'm2',
                        name: row.getCell(1).value,
                        range: row.getCell(2).value,
                        comment: row.getCell(3).value
                    })
                }
            }
            if (data.type === 'm1') {
                if (m1 >= data.min && m1 <= data.max) {
                    var row = dataSheet.getRow(data.row);
                    results.push({
                        type: 'm1',
                        name: row.getCell(1).value,
                        range: row.getCell(4).value,
                        comment: row.getCell(5).value
                    })
                }
            }
        })
    }
    res.json(results);


});

module.exports = router;