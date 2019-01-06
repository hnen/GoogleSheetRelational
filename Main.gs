/**
 * Entry points for the add-on.
 */

function onOpen(e) {  
  SpreadsheetApp.getUi().createMenu('Relational').addItem('Show Sidebar', 'openSidebar').addToUi();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();  
  ss.toast('Data Model Manager enabled');
  
  errors = [];
  var graph = generateGraph(errors);
  updateCache(graph);
  formatErrors(errors);
  addForeignLinks(graph);
  //if (errors.length > 0) {
  //  Browser.msgBox(JSON.stringify(errors));
  //}
  
  ss.toast('Finished initialising', 'Data Model Manager'); 
  
  openSidebar();

}

function openSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar.html')
  .setTitle("Main")
  .setWidth(300);  
  SpreadsheetApp.getUi().showSidebar(html);
}

function onEdit(e) {
  var range = e.range;
  var oVal = e.oldValue;
  var nVal = e.value;
  
  errors = [];
  var graph = generateGraph(errors);
  updateCache(graph);
  formatErrors(errors);
  addForeignLinks(graph);
  
  //if (errors.length > 0) {
  //  Browser.msgBox(JSON.stringify(errors));
  //}
}

function addForeignLinks(graph) {
  for(var row_key in graph) {
    var row = graph[row_key];
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(row.table);
    for(var ref_out_i in row.ref_out) {
      var ref_out = row.ref_out[ref_out_i];
      var range = sheet.getRange(row.row_i, ref_out.col_i);
      var val = range.getValue();
      
    }
  }
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

