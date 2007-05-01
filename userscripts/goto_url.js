/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.goto_url = {
  description: "Go to web page",
  scope: {
    semantic: {
      "hCard" : "url",
      "hCalendar" : "url",
      "hAtom-hEntry" : "bookmark.link"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var action = ufJSActions.actions.goto_url;
    return semanticObject[action.scope.semantic[semanticObjectType]];
  } 
};
