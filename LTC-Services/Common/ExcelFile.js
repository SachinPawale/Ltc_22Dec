// const excel = require ("node-excel-export");
// module.exports.CreateExcelFile = function(filename, columns, tabledata, cb) {

//     let specification = {};
//     columns.forEach(element => {
        
//     });
// }
const xlsx =  require('node-xlsx');
const path = require('path');
const fs = require('fs');

module.exports.ExportExcelFile = function() {
    return new Promise((resolve, reject) => {
        try{
            let finalObject = [];
            const excelpath = path.join(__dirname + '/../ExcelFile/FAMisc.xlsx');
            const workSheetsFromFile = xlsx.parse(excelpath);

            workSheetsFromFile[0].data.slice(1).forEach((element)=>{
                    finalObject.push({
                        INVENTORY_ITEM_ID:element[0],
                        ATTRIBUTE1:element[1],
                        PRIMARY_UOM_CODEA:element[2],
                        ITEM_NUMBER:element[3],
                        ASSET_ID:element[4],
                        ASSET_NUMBER:element[5],
                        CURRENT_UNITS:element[6],
                        COST:element[7],
                        DEPRN_RESERVE:element[8],
                        NBV:element[9],
                        LOCATION:element[10],
                        ITEM_DESC:element[11],
                        ASSET_DESC:element[12],
                    });
            });
            
            let data = {
                workSheetsFromFile:finalObject
            }
            resolve(data);
        }
        catch(error){
            reject(error);
        }
    });
}

