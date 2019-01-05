/**
 * Contains code that interprets data sheets as relational data and converts the sheet rows to objects.
 * Data model for data sheets are defined in Model.gs and sheets must follow the schema defined by the file.
 */

/**
 * Returns a map of nodes from the tables listed in 'tables'. Nodes are mapped by node id, which is format 'TableName.PrimaryKey'.
 * Each node has following schema:
 * { row_i : Integer, table: String, ref_out: List<String>, ref_in: List<String> }
 * Function appends errors to an array out_errors, passed as a parameter. Error object conforms following schema:
 * { desc : String, table_name : String, row_i : Integer}
 */
function generateGraph(out_errors) {    
  // Create nodes
  var rows = {};  
  for(var table_key in tables) {
    var table_model = tables[table_key];
    var pk_cols = getPrimaryKeyColumns(table_key, table_model);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table_key);
    for(var row_i = 2; row_i <= sheet.getMaxRows(); row_i++) {
      var row_data = sheet.getRange(row_i, 1, 1, sheet.getMaxColumns()).getValues()[0];
      var pkstr = getPkString(row_data, pk_cols);
      if (pkstr) {
        var row = {row_i: row_i, table: table_key, ref_out: [], ref_in: []};
        var key = table_key + "." + pkstr;
        if (rows[key]) {
          out_errors.push({desc: "Duplicate primary key in table " + table_key + ": " + pkstr, table_name: table_key, row_i: row_i});
          out_errors.push({desc: "Duplicate primary key in table " + table_key + ": " + pkstr, table_name: table_key, row_i: rows[key].row_i});
        }
        rows[key] = row;
      }
    }
  }
  
  // Link by Foreign Keys
  for(var table_key in tables) {
    var table_model = tables[table_key];
    var pk_cols = getPrimaryKeyColumns(table_key, table_model);
    var fks = getForeignKeyColumns(table_key, table_model);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table_key);
    for(var fks_i in fks) {
      var fk = fks[fks_i];
      var data = sheet.getRange(2, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns()).getValues();
      for(var i = 0; i < data.length; i++) {
        var row_data = data[i];
        var pkstr = getPkString(row_data, pk_cols);
        if (pkstr) {
          var this_key = table_key + "." + pkstr;
          var foreign_key = fk.foreign_table_name + "." + row_data[fk.col_i-1];
          var row_node = rows[this_key];
          var foreign_node = rows[foreign_key];          
          row_node.ref_out.push({col_i: fk.col_i, fk: foreign_key});
          if (!foreign_node) {
            out_errors.push(
              {
                desc: "Invalid foreign key in table " + table_key + " column " + fk.col_name + ": " + row_data[fk.col_i-1], 
                table_name: table_key, 
                row_i: i+2
              }
            );
          } else {
            foreign_node.ref_in.push(this_key);
          }
        }
      }
    }
  }
  
  return rows;
}

function getPkString(row_data, pk_cols) {
  var pk = [];
  var pkstr = "";
  var first = true;
  for(var pk_cols_i in pk_cols) {
    var pk_col = pk_cols[pk_cols_i];
    pk.push(row_data[pk_col-1]);
    if (!row_data[pk_col-1]) {
      return null;
    }
    if (!first) {
      pkstr = pkstr + "_";
    }
    pkstr = pkstr + row_data[pk_col-1];
    first = false;
  }
  return pkstr;
}

function getForeignKeyColumns(tableName, model) {
  var headerMap = getHeaderMap(tableName);
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tableName);
  var fkColumns = [];
  for(var m in model) {
    var entry = model[m];
    if (entry[0] == FOREIGN_KEY) {
      var column_key = entry[1];
      var foreign_table_name = entry[2];
      fkColumns.push({col_i: headerMap[column_key], col_name: column_key, foreign_table_name: foreign_table_name})
    }
  }
  
  return fkColumns;
}

function getPrimaryKeyColumns(tableName, model) {
  var headerMap = getHeaderMap(tableName);
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tableName);
  var pkColumns = [];
  for(var m in model) {
    var entry = model[m];
    if (entry[0] == PRIMARY_KEY) {
      for(var pk_i in entry[1]) {
        var pk = entry[1][pk_i];
        pkColumns.push(headerMap[pk]);
      }
    }
  }
  
  return pkColumns;
}

function containsNonEmptyString(row) {
  for(var i in row) {
    if (row[i]) {
      return true;
    }
  }
  return false;
}

function getHeaderMap(tableName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tableName);
  var header = sheet.getRange(1, 1, 1, sheet.getMaxColumns()).getValues();
  var headerMap = {};
  for(var i = 0; i < header[0].length; i++) {
    headerMap[header[0][i]] = i + 1;
  }
  return headerMap;
}

