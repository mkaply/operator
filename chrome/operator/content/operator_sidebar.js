/*extern Microformats, Operator, Components, content */

var Operator_Sidebar = {
  clear: function(event)
  {
//    var doc = document.getElementById("sidebar").contentDocument;
  },
  processSemanticData: function(event) 
  {
    try {
      Operator_Sidebar.clear();
      var doc = document.getElementById("sidebar").contentDocument;
      if (doc.firstChild.id == "operator-sidebar-window") {
        var window = doc.firstChild;
        var microformatsArrays = ufJS.getElementsByMicroformat(content.document);
        var tempItem;
        for (var i in microformatsArrays) {
          if (microformatsArrays[i].length > 0) {
            tempItem = doc.createTextNode(i);
            window.appendChild(tempItem);
          }
        }
      }
    } catch (ex) {}
  }
};

