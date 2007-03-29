function geo() {
}

ufJSParser.microformats.geo = {
  version: "0.2",
  mfName: "Geolocation",
  mfObject: geo,
  className: "geo",
  required: ["latitude","longitude"],
  definition: {
    properties: {
      "latitude" : {
        cardinality: "singular",
        virtual: true,
        /* This will only be called in the virtual case */
        getter: function(mfnode) {
          var value = ufJSParser.defaultGetter(mfnode);
          var latlong;
          if (value.match(';')) {
            latlong = value.split(';');
            if (latlong[0]) {
              return latlong[0];
            }
          }
        },
      },
      "longitude" : {
        cardinality: "singular",
        virtual: true,
        /* This will only be called in the virtual case */
        getter: function(mfnode) {
          var value = ufJSParser.defaultGetter(mfnode);
          var latlong;
          if (value.match(';')) {
            latlong = value.split(';');
            if (latlong[1]) {
              return latlong[1];
            }
          }
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode) {
          if (ufJSParser.getMicroformatProperty(mfnode, "geo", "latitude") &&
            ufJSParser.getMicroformatProperty(mfnode, "geo", "longitude")) {
  
            var s;
            if (propnode.innerText) {
              s = mfnode.innerText;
            } else {
              s = mfnode.textContent;
            }

            s = ufJSParser.trim(s);

            /* FIXME - THIS IS FIREFOX SPECIFIC */
            /* check if geo is contained in a vcard */
            var xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' vcard ')]";
            var xpathResult = mfnode.ownerDocument.evaluate(xpathExpression, mfnode, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (xpathResult.singleNodeValue) {
              var hcard = ufJSParser.createMicroformat(xpathResult.singleNodeValue, "hCard");
              if (hcard.fn) {
                return hcard.fn;
              }
            }
            /* check if geo is contained in a vevent */
            xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' vevent ')]";
            xpathResult = mfnode.ownerDocument.evaluate(xpathExpression, mfnode, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, xpathResult);
            if (xpathResult.singleNodeValue) {
              var hcal = ufJSParser.createMicroformat(xpathResult.singleNodeValue, "hCalendar");
              if (hcal.summary) {
                return hcal.summary;
              }
            }
            return s;
          }
        }
      }
    }
  },
  validate: function(node, error) {
    error.message = "";
    if (!ufJSParser.getMicroformatProperty(node, "geo", "latitude")) {
      error.message += "No latitude specified\n";
    }
    if (!ufJSParser.getMicroformatProperty(node, "geo", "longitude")) {
      error.message += "No longitude specified\n";
    }
    if (error.message.length > 0) {
      return false;
    }
    return true;
  }
};
