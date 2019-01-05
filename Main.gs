/**
 * Entry points for the add-on.
 */

var properties = PropertiesService.getDocumentProperties();

function onOpen(e) {  
  var ss = SpreadsheetApp.getActiveSpreadsheet();  
  ss.toast('Data Model Manager enabled');
  
  errors = [];
  var graph = generateGraph(errors);
  formatErrors(errors);
  //if (errors.length > 0) {
  //  Browser.msgBox(JSON.stringify(errors));
  //}
  
  ss.toast('Finished initialising', 'Data Model Manager');
}

function onEdit(e) {
  var range = e.range;
  var oVal = e.oldValue;
  var nVal = e.value;
  
  errors = [];
  var graph = generateGraph(errors);
  formatErrors(errors);
  //if (errors.length > 0) {
  //  Browser.msgBox(JSON.stringify(errors));
  //}
}

function formatErrors(errors) {
  // Set background to white
  for(var table_key in tables) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table_key);
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns()).setBackground("white");
  }
  
  // Highlight errors
  for(var err_i in errors) {
    var error = errors[err_i];
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(error.table_name);
    var range = sheet.getRange(error.row_i, 1, 1, sheet.getMaxColumns());
    range.setBackground('red');
  }
}

