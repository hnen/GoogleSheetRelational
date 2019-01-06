/**
 * Entry points for the add-on.
 */

var appName = '⋈';

function onOpen(e) {    
  var ss = SpreadsheetApp.getActiveSpreadsheet();  
  ss.toast('Staring up...', appName);
  
  errors = [];
  var graph = generateGraph(errors);
  updateCache(graph);
  formatErrors(errors);
  
  SpreadsheetApp.getUi().createMenu(appName).addItem('Open Inspector', 'openSidebar').addToUi();
  ss.toast('Finished initialising', appName);  
}

function onEdit(e) {
  var range = e.range;
  var oVal = e.oldValue;
  var nVal = e.value;
  
  errors = [];
  var graph = generateGraph(errors);
  updateCache(graph);
  formatErrors(errors);
}

function formatErrors(errors) {
  // Set background to white
  for(var table_key in tables) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table_key);
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns()).setBackground("white");    
    sheet.setTabColor(null);
  }
  
  // Highlight errors
  for(var err_i in errors) {
    var error = errors[err_i];
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(error.table_name);
    var range = sheet.getRange(error.row_i, 1, 1, sheet.getMaxColumns());
    range.setBackground('red');
    sheet.setTabColor('red');
  }
}


function openSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar.html')
  .setTitle("Inspector")
  .setWidth(300);  
  SpreadsheetApp.getUi().showSidebar(html);
}

