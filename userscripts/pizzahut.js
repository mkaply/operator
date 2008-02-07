var pizzahut_find = {
  description: "Find a Pizza Hut",
  scope: {
    semantic: {
      "hCard" : "adr"
    }
  },
  doAction: function(semanticObject, semanticObjectType, propertyIndex, event) {
    var url;
    if (semanticObjectType == "hCard") {
      var body = "intZipCode=" + semanticObject.adr[propertyIndex]["postal-code"] + "&intMaxRad=30";

      var ios = Components.classes["@mozilla.org/network/io-service;1"]
                          .getService(Components.interfaces.nsIIOService);
      var referrerURI = ios.newURI("http://www.daveramsey.com/fpu/classfinder/index.cfm?fuseaction=actfindclass", null, null);

      var stringStream =  Components.classes["@mozilla.org/io/string-input-stream;1"].
                                     createInstance(Components.interfaces.nsIStringInputStream);
      if ("data" in stringStream) // Gecko 1.9 or newer
        stringStream.data = body;
      else // 1.8 or older
        stringStream.setData(body, body.length);

      var postData = Components.classes["@mozilla.org/network/mime-input-stream;1"].
                                createInstance(Components.interfaces.nsIMIMEInputStream);
      postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
      postData.addContentLength = true;
      postData.setData(stringStream);

      if (event) {
        openUILink("http://www.daveramsey.com/fpu/classfinder/index.cfm?fuseaction=actfindclass", event, undefined, undefined, undefined, postData, referrerURI);
      } else {
        getBrowser().webNavigation.loadURI("http://www.daveramsey.com/fpu/classfinder/index.cfm?fuseaction=actfindclass",
                                           0,
                                           referrerURI,
                                           postData,
                                           null);
        return true;
      }
    }
  },
  getActionName: function(semanticObject, semanticObjectType, propertyIndex) {
    if (!propertyIndex) {
      propertyIndex = 0;
    }
    if (semanticObject.adr && semanticObject.adr[propertyIndex] && semanticObject.adr[propertyIndex]["postal-code"]) {
      return semanticObject.adr[propertyIndex]["postal-code"];
    }
    return;
  }
};

SemanticActions.add("pizzahut_find", pizzahut_find);

