/*extern Components */

var ufJSActions = {
  version: "0.2",
  actions: {},
  init: function(ojl, baseurl) {
    if (Components && !ojl) {
      ojl = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                       getService(Components.interfaces.mozIJSSubScriptLoader);
    }
    if (ojl) {
      ojl.loadSubScript(baseurl + "actions/export.js");
//      ojl.loadSubScript(baseurl + "actions/firefox.js");
      ojl.loadSubScript(baseurl + "actions/yahoo.js");
      ojl.loadSubScript(baseurl + "actions/google.js");
//      ojl.loadSubScript(baseurl + "actions/30boxes.js");
//      ojl.loadSubScript(baseurl + "actions/delicious.js");
//      ojl.loadSubScript(baseurl + "actions/flickr.js");
//      ojl.loadSubScript(baseurl + "actions/upcoming.js");
//      ojl.loadSubScript(baseurl + "actions/technorati.js");
//      ojl.loadSubScript(baseurl + "actions/yedda.js");
//      ojl.loadSubScript(baseurl + "actions/magnolia.js");
//      ojl.loadSubScript(baseurl + "actions/youtube.js");
    }
  }
};

