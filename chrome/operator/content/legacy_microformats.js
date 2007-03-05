/*extern Operator, ufJSActions, ufJSParser, openUILink */

var Microformats = {
  init: function() {
    var i, j;
    for (i in Operator.microformatList)
    {
      if (Microformats[i]) {
        for (j in Microformats[i].handlers) {
          ufJSActions.actions[j] = {};
          ufJSActions.actions[j].description = Microformats[i].handlers[j].description;
          ufJSActions.actions[j].icon = Microformats[i].handlers[j].icon;
          ufJSActions.actions[j].scope = {};
          ufJSActions.actions[j].scope.microformats = {};
          if (Microformats[i].handlers[j].requires) {
            ufJSActions.actions[j].scope.microformats[i] = Microformats[i].handlers[j].requires;
          } else {
            ufJSActions.actions[j].scope.microformats[i] = i;
          }
          ufJSActions.actions[j].doAction = function(node, microformatName, event) {
                                              Microformats[microformatName].handlers[j].action(node, event);
                                            };
        }
      }
    }
  },
  loadUrl: function(url, event) {openUILink(url, event);},
  geo: {
    handlers: {},
    create: function(node) { return ufJSParser.createMicroformat(node, "geo");}
  },
  hCard: {
    handlers: {},
    create: function(node) { return ufJSParser.createMicroformat(node, "hCard");}
  },
  hCalendar: {
    handlers: {},
    create: function(node) { return ufJSParser.createMicroformat(node, "hCalendar");}
  },
  hReview: {
    handlers: {},
    create: function(node) { return ufJSParser.createMicroformat(node, "hReview");}
  },
  hResume: {
    handlers: {},
    create: function(node) { return ufJSParser.createMicroformat(node, "hResume");}
  },
  tag: {
    handlers: {},
    create: function(node) { return ufJSParser.createMicroformat(node, "tag");}
  },
  xFolk: {
    handlers: {},
    create: function(node) { return ufJSParser.createMicroformat(node, "xFolk");}
  }
};

