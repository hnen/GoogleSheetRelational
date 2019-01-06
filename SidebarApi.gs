/**
 * API for the sidebar to call.
 */

function getSelectedRange() {
  return SpreadsheetApp.getActiveSheet().getSelection().getCurrentCell().getA1Notation();
}

/**
 * Get current row and immediate neighbors from current selected row.
 */
function getLocalInfo() {
  var currentRow = getCurrentRowInfo();

  var neighbors = {};
  for(var ref_in_k in currentRow.ref_in) {
    var ref_in = currentRow.ref_in[ref_in_k];
    var ref = getFromCache(ref_in);
    neighbors[ref_in] = getRow(ref.table, ref.row_i);
  }
  for(var ref_out_k in currentRow.ref_out) {
    var ref_out = currentRow.ref_out[ref_out_k];
    var ref = getFromCache(ref_out.fk);
    neighbors[ref_out.fk] = getRow(ref.table, ref.row_i);
  }
    
  return {
    current: currentRow,
    neighbors: neighbors
  };
}

function getRow(table_name, row_i) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table_name);
  var header = sheet.getRange(1, 1, 1, sheet.getMaxColumns()).getValues()[0];
  var row = sheet.getRange(row_i, 1, 1, sheet.getMaxColumns()).getValues()[0];
  
  var row_obj = [];
  for(var i in header) {
    if (header[i]) {
      //row_obj[header[i]] = row[i];
      row_obj.push([header[i], row[i]]);
    }
  }
  
  return row_obj;
}

function getCurrentRowInfo() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getSelection().getCurrentCell().getRow();
  var name = sheet.getName();
  return getFromCache(name + ":" + row);
}

