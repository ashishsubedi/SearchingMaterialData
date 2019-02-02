const router = require('express').Router();
var Excel = require('exceljs');

var wb = new Excel.Workbook();
var path = require('path');
const filePath = path.resolve(__dirname, 'data.xlsx');

router.get('/', function (req, res) {

    //res.render('index');
    res.sendFile('index.html', { root: path.join(__dirname, '../views') });

});

router.post('/search', (req, res) => {
    if (req.body.selectedOption === "m2") {
        wb.xlsx.readFile(filePath)
            .then(function () {

                var sheet = wb.getWorksheet("Sheet1");
                var namesCol = sheet.getColumn(1);
                var row = '';
                var name = '';
                namesCol.eachCell((cell, rowNumber) => {

                    if (req.body.name.trim() === cell.value) {
                        name = cell.value;
                        row = rowNumber;
                        return;
                    }


                });
                if (row !== '') {
                    var materialRow = sheet.getRow(row);
                    res.json({
                        type: 'm2',
                        name: name,
                        data: materialRow.getCell(2).value,
                        comments: materialRow.getCell(3).value
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
    } else if (req.body.selectedOption === "m1") {
        wb.xlsx.readFile(filePath)
            .then(function () {

                var sheet = wb.getWorksheet("Sheet1");
                var namesCol = sheet.getColumn(1);
                var row = '';
                var name = '';

                req.body.name = req.body.name.toLowerCase();
                namesCol.eachCell((cell, rowNumber) => {

                    if (req.body.name.trim() === cell.value) {
                        name = cell.value;

                        row = rowNumber;
                        return;
                    }


                });
                if (row !== '') {
                    var materialRow = sheet.getRow(row);
                    res.json({
                        type: 'm1',
                        name: name,
                        data: materialRow.getCell(4).value,
                        comments: materialRow.getCell(5).value

                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

});

module.exports = router;