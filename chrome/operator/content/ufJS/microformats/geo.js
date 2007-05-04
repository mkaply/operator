function geo(node) {
  if (node) {
    ufJSParser.newMicroformat(this, node, "geo");
  }
}
geo.prototype.toString = function() {
  if (this.latitude && this.longitude) {
    var s;
    if (this.node.innerText) {
      s = this.node.innerText;
    } else {
      s = this.node.textContent;
    }
  
    s = ufJSParser.trim(s);
  
    /* FIXME - THIS IS FIREFOX SPECIFIC */
    /* check if geo is contained in a vcard */
    var xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' vcard ')]";
    var xpathResult = this.node.ownerDocument.evaluate(xpathExpression, this.node, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (xpathResult.singleNodeValue) {
      var hcard = new hCard(xpathResult.singleNodeValue);
      if (hcard.fn) {
        return hcard.fn;
      }
    }
    /* check if geo is contained in a vevent */
    xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' vevent ')]";
    xpathResult = this.node.ownerDocument.evaluate(xpathExpression, this.node, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, xpathResult);
    if (xpathResult.singleNodeValue) {
      var hcal = new hCalendar(xpathResult.singleNodeValue);
      if (hcal.summary) {
        return hcal.summary;
      }
    }
    return s;
  }
}

ufJSParser.microformats.geo = {
  version: "0.7",
  mfObject: geo,
  className: "geo",
  required: ["latitude","longitude"],
  properties: {
    "latitude" : {
      datatype: "float",
      virtual: true,
      /* This will only be called in the virtual case */
      virtualGetter: function(mfnode) {
        var value = ufJSParser.defaultGetter(mfnode);
        var latlong;
        if (value.match(';')) {
          latlong = value.split(';');
          if (latlong[0]) {
            return parseFloat(latlong[0]);
          }
        }
      },
    },
    "longitude" : {
      datatype: "float",
      virtual: true,
      /* This will only be called in the virtual case */
      virtualGetter: function(mfnode) {
        var value = ufJSParser.defaultGetter(mfnode);
        var latlong;
        if (value.match(';')) {
          latlong = value.split(';');
          if (latlong[1]) {
            return parseFloat(latlong[1]);
          }
        }
      }
    }
  }
};
