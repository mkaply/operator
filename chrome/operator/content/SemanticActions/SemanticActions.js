var EXPORTED_SYMBOLS = ["SemanticActions"];

var SemanticActions = {
  version: 0.8,
  inited: false,
  /* All action specific function are contained in this object */
  /**
   * Internal function to initialize microformats. First it tries to use the
   * Component.utils.import method that will be in Firefox 3. If that fails,
   * it looks for certain microformat definition files in the same directory
   * as this JS file.
   */
  init: function() {
    if (!SemanticActions.inited) {
      SemanticActions.inited = true
      var ojl = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                           getService(Components.interfaces.mozIJSSubScriptLoader);
      /* Find the location of the JS file we are in */
      var stack = (new Error()).stack.split("\n");
      var end = stack[1].indexOf("SemanticActions.js");
      var begin = stack[1].lastIndexOf("@", end)+1;
      var baseurl = stack[1].substring(begin, end);

      try {
        ojl.loadSubScript(baseurl + "export.js");
        ojl.loadSubScript(baseurl + "30boxes.js");
        ojl.loadSubScript(baseurl + "amazon.js");
        ojl.loadSubScript(baseurl + "delicious.js");
        ojl.loadSubScript(baseurl + "firefox.js");
        ojl.loadSubScript(baseurl + "flickr.js");
        ojl.loadSubScript(baseurl + "google.js");
        ojl.loadSubScript(baseurl + "magnolia.js");
        ojl.loadSubScript(baseurl + "mapquest.js");
        ojl.loadSubScript(baseurl + "technorati.js");
        ojl.loadSubScript(baseurl + "upcoming.js");
        ojl.loadSubScript(baseurl + "yahoo.js");
        ojl.loadSubScript(baseurl + "yedda.js");
        ojl.loadSubScript(baseurl + "youtube.js");

      } catch (ex) {
        alert(ex)
      }
    }
  },
  /* When an action is added, the name is placed in this list */
  list: [],
  add: function add(action, actionDefinition) {
    if (!SemanticActions[action]) {
      SemanticActions[action] = actionDefinition;
      SemanticActions.list.push(action);
    } else {
      /* Copy the scope */
      if (actionDefinition.scope) {
        var i;
        for (i in actionDefinition.scope.semantic) {
          SemanticActions[action].scope.semantic[i] = actionDefinition.scope.semantic[i];
        }
      }
      /* If there is a doAction, chain it in */
      if (actionDefinition.doAction) {
        var doAction = function(semanticObject, semanticObjectType) {
          var ret = actionDefinition.doAction(semanticObject, semanticObjectType);
          if (!ret) {
            return doAction.actionOld(semanticObject, semanticObjectType);
          }
          return ret;
        }
        doAction.actionOld = SemanticActions[action].doAction
        SemanticActions[action].doAction = doAction;
      }
      /* If there is a doActionAll, we have to replace the one we have */
      /* We'll replace the descriptionAll as well */
      if (actionDefinition.doActionAll) {
        SemanticActions[action].doActionAll = actionDefinition.doActionAll;
        SemanticActions[action].descriptionAll = actionDefinition.descriptionAll;
      }
    }
  },
  __iterator__: function () {
    var i;
    for (i=0; i < this.list.length; i++) {
      yield this.list[i];
    }
  }
}

SemanticActions.init();
