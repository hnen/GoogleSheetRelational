
var properties = PropertiesService.getDocumentProperties();

function updateCache(graph) {
  graph_str = {};
  for(var row_key in graph) {
    var row = graph[row_key];
    var row_key_sheet = row.table + ":" + row.row_i;
    var row_json = JSON.stringify(row);
    graph_str[row_key] = row_json;
    graph_str[row_key_sheet] = row_json;
  }
  
  properties.setProperties(graph_str, true);
}

function getFromCache(key) {
  return JSON.parse(properties.getProperty(key));
}
