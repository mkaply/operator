/*extern ufJSParser, Components, XPathResult, ufJSActions, content */

var ufJS = {
  version: "0.2",
  init: function(ojl, baseurl) {
    if (Components && !ojl) {
      ojl = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                       getService(Components.interfaces.mozIJSSubScriptLoader);
    }
    if (ojl) {
      ojl.loadSubScript(baseurl + "ufJSParser.js");
      ufJSParser.init(ojl, baseurl);
      ojl.loadSubScript(baseurl + "ufJSActions.js");
      ufJSActions.init(ojl, baseurl);
    }
  },
  getElementsByMicroformat: function(rootElement, in_microformatsArrays, in_microformatList) {
    var i;
    var microformatList;
    if (in_microformatList) {
      if (in_microformatList instanceof Array) {
        microformatList = in_microformatList;
      } else if (in_microformatList instanceof Object) {
        microformatList = [];
        for (i in in_microformatList) {
          microformatList.push(i);
        }
      } else {
        microformatList = in_microformatList.split(" ");
      }
    } else {
      microformatList = [];
      for (i in ufJSParser.microformats) {
        microformatList.push(i);
      }
    }
    var microformats;
    if (in_microformatsArrays) {
      microformats = in_microformatsArrays;
    } else {
      microformats = [];
    }
    var mfname;
    var mfs;
    for (i in microformatList) {
      mfname = microformatList[i];
      if (ufJSParser.microformats[mfname]) {
        if (ufJSParser.microformats[mfname].className) {
          mfs = ufJS.getElementsByClassName(rootElement,
                                            ufJSParser.microformats[mfname].className);
          /* alternateClassName is for cases where a parent microformat is inferred by the children */
          /* IF we find alternateClassName, the entire document becomes the microformat */
          if ((mfs.length == 0) && (ufJSParser.microformats[mfname].alternateClassName)) {
            var temp = ufJS.getElementsByClassName(rootElement, ufJSParser.microformats[mfname].alternateClassName);
            if (temp.length > 0) {
              mfs.push(rootElement); 
            }
          }
        } else if (ufJSParser.microformats[mfname].attributeValues) {
          mfs = ufJS.getElementsByAttribute(rootElement,
                                            ufJSParser.microformats[mfname].attributeName,
                                            ufJSParser.microformats[mfname].attributeValues);
          
        }
      } else {
        mfs = [];
      }
      if (!microformats[mfname]) {
        microformats[mfname] = [];
      }
      microformats[mfname] = microformats[mfname].concat(mfs);
    }
    return microformats;
  },
  /* Make this take arrays and strings for className */
  getElementsByClassName: function(rootNode, className)
  {
    var returnElements = [];

    if (document.getElementsByClassName) {
      var col = rootNode.getElementsByClassName(className);
      for (i = 0; i < col.length; i++) {
        returnElements[i] = col[i];
      }
    } else if (document.evaluate) {
      var xpathExpression;
      xpathExpression = ".//*[contains(concat(' ', @class, ' '), ' " + className + " ')]";
      var xpathResult = (rootNode.ownerDocument || rootNode).evaluate(xpathExpression, rootNode, null, 0, null);

      var node = xpathResult.iterateNext();

      while (node) {
        returnElements.push(node);
        node = xpathResult.iterateNext();
      }
    } else {
      className = className.replace(/\-/g, "\\-");
      var elements = rootNode.getElementsByTagName("*");
      for (var i=0;i<elements.length;i++) {
        if (elements[i].className.match("(^|\\s)" + className + "(\\s|$)")) {
          returnElements.push(elements[i]);
        }
      }
    }
    return returnElements;
  },
  /* Needs to be ported to work in Internet Explorer/Opera */
  getElementsByAttribute: function(rootNode, attributeName, in_attributeList)
  {
    var attributeList;
    if (in_attributeList instanceof Array) {
      attributeList = in_attributeList;
    } else {
      attributeList = in_attributeList.split(" ");
    }

    var returnElements = [];

    var xpathExpression = ".//*[";
    var i;
    for (i = 0; i < attributeList.length; i++) {
      if (i != 0) {
        xpathExpression += " or ";
      }
      xpathExpression += "contains(concat(' ', @" + attributeName + ", ' '), ' " + attributeList[i] + " ')";
    }
    xpathExpression += "]"; 

    var xpathResult = (rootNode.ownerDocument || rootNode).evaluate(xpathExpression, rootNode, null, 0, null);

    var node = xpathResult.iterateNext();

    while (node) {
      returnElements.push(node);
      node = xpathResult.iterateNext();
    }
    return returnElements;
  },
  isMicroformatElement: function(node, in_microformatList) {
    this.isMicroformatNode(node, in_microformatList);
  },
  /* Needs to be ported to work in Internet Explorer/Opera */
  isMicroformatNode: function(node, in_microformatList) {
    var microformatList;
    var i;
    if (in_microformatList) {
      if (in_microformatList instanceof Array) {
        microformatList = in_microformatList;
      } else if (in_microformatList instanceof Object) {
        microformatList = [];
        for (i in in_microformatList) {
          microformatList.push(i);
        }
      } else {
        microformatList = in_microformatList.split(" ");
      }
    } else {
      microformatList = [];
      for (i in ufJSParser.microformats) {
        microformatList.push(i);
      }
    }

    var xpathExpression;
    var xpathResult;
    var mfname;
    for (i in microformatList)
    {
      mfname = microformatList[i];
      if (ufJSParser.microformats[mfname]) {
        if (ufJSParser.microformats[mfname].className) {
          xpathExpression = "ancestor-or-self::*[contains(concat(' ', @class, ' '), ' " + ufJSParser.microformats[mfname].className + " ')]";
        } else if (ufJSParser.microformats[mfname].attributeValues) {
          xpathExpression = "ancestor-or-self::*[";
          for (i in ufJSParser.microformats[mfname].attributeValues) {
            if (i != 0) {
              xpathExpression += " or ";
            }
            xpathExpression += "contains(concat(' ', @" + ufJSParser.microformats[mfname].attributeName + ", ' '), ' " + ufJSParser.microformats[mfname].attributeValues[i] + " ')";
          }
          xpathExpression += "]"; 
        } else {
          throw "Invalid parameter";
        }
        xpathResult = node.ownerDocument.evaluate(xpathExpression, node, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (xpathResult.singleNodeValue) {
          xpathResult.singleNodeValue.microformat = mfname;
          return xpathResult.singleNodeValue;
        }
      }
    }
    return false;
  },
  getMicroformatNameFromElement: function(node, in_microformatList) {
    this.getMicroformatNameFromNode(node, in_microformatList);
  },
  /* Needs to be ported to work in Internet Explorer/Opera */
  getMicroformatNameFromNode: function(node, in_microformatList) {
    var i;
    var microformatList;
    if (in_microformatList) {
      if (in_microformatList instanceof Array) {
        microformatList = in_microformatList;
      } else if (in_microformatList instanceof Object) {
        microformatList = [];
        for (i in in_microformatList) {
          microformatList.push(i);
        }
      } else {
        microformatList = in_microformatList.split(" ");
      }
    } else {
      microformatList = [];
      for (i in ufJSParser.microformats) {
        microformatList.push(i);
      }
    }

    var microformatNames = [];
    var xpathExpression;
    var xpathResult;
    var mfname;
    for (i in microformatList)
    {
      mfname = microformatList[i];
      if (ufJSParser.microformats[mfname]) {
        if (ufJSParser.microformats[mfname].className) {
          xpathExpression = "self::*[contains(concat(' ', @class, ' '), ' " + ufJSParser.microformats[mfname].className + " ')]";
        } else if (ufJSParser.microformats[mfname].attributeValues) {
          xpathExpression = "self::*[";
          for (i in ufJSParser.microformats[mfname].attributeValues) {
            if (i != 0) {
              xpathExpression += " or ";
            }
            xpathExpression += "contains(concat(' ', @" + ufJSParser.microformats[mfname].attributeName + ", ' '), ' " + ufJSParser.microformats[mfname].attributeValues[i] + " ')";
          }
          xpathExpression += "]"; 
        } else {
          throw "Invalid parameter";
        }
        xpathResult = node.ownerDocument.evaluate(xpathExpression, node, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (xpathResult.singleNodeValue) {
          xpathResult.singleNodeValue.microformat = mfname;
          microformatNames.push(mfname);
        }
      }
    }
    return microformatNames;
  },
  simpleEscape: function(s)
  {
    s = s.replace(/\&/g, '%26');
    s = s.replace(/\#/g, '%23');
    s = s.replace(/\+/g, '%2B');
    s = s.replace(/\-/g, '%2D');
    s = s.replace(/\=/g, '%3D');
    s = s.replace(/\'/g, '%27');
    s = s.replace(/\,/g, '%2C');
//    s = s.replace(/\r/g, '%0D');
//    s = s.replace(/\n/g, '%0A');
    s = s.replace(/ /g, '+');
    return s;
  },
  vCard: function(item)
  {
    var hcard = ufJSParser.createMicroformat(item, "hCard");
    if (!hcard) {
      return;
    }
    var vcf;
    var i;
    var j;
    vcf  = "BEGIN:VCARD\n";
//    vcf += "PRODID:-//kaply.com//Operator 0.6.2//EN\n";
    vcf += "PRODID:\n";
    vcf += "SOURCE:" + content.document.location.href + "\n";
    vcf += "NAME:" + content.document.title + "\n";
    vcf += "VERSION:3.0\n";
    if (hcard.n && (hcard.n["family-name"] || hcard.n["given-name"] ||
        hcard.n["additional-name"] || hcard.n["honorific-prefix"] ||
        hcard.n["honorific-suffix"])) {
      vcf += "N;CHARSET=UTF-8:";
      if (hcard.n["family-name"]) {
        vcf += hcard.n["family-name"];
      }
      vcf += ";";
      if (hcard.n["given-name"]) {
        vcf += hcard.n["given-name"];
      }
      vcf += ";";
      if (hcard.n["additional-name"]) {
        vcf += hcard.n["additional-name"].join(",");
      }
      vcf += ";";
      if (hcard.n["honorific-prefix"]) {
        vcf += hcard.n["honorific-prefix"].join(",");
      }
      vcf += ";";
      if (hcard.n["honorific-suffix"]) {
        vcf += hcard.n["honorific-suffix"].join(",");
      }
      vcf += "\n";
    } else {
      vcf += "N:;;;;\n";
    }
    if (hcard.org) {
      vcf += "ORG;CHARSET=UTF-8:";
      if (hcard.org[0]["organization-name"]) {
        vcf += hcard.org[0]["organization-name"];
      }
      if (hcard.org[0]["organization-unit"]) {
        vcf += ";";
        vcf += hcard.org[0]["organization-unit"].join(";");
      }
      vcf += "\n";
    }
    if (hcard.fn) {
      vcf += "FN;CHARSET=UTF-8:" + hcard.fn + "\n";
    }
    if (hcard.title) {
      vcf += "TITLE;CHARSET=UTF-8:" + hcard.title[0] + "\n";
    }
    if (hcard.role) {
      vcf += "ROLE;CHARSET=UTF-8:" + hcard.role[0] + "\n";
    }
    if (hcard["sort-string"]) {
      vcf += "SORT-STRING;CHARSET=UTF-8:" + hcard["sort-string"][0] + "\n";
    }
    if (hcard["class"]) {
      vcf += "CLASS;CHARSET=UTF-8:" + hcard["class"] + "\n";
    }
    if (hcard.tz) {
      vcf += "TZ;CHARSET=UTF-8:" + hcard.tz + "\n";
    }
    if (hcard.category) {
      vcf += "CATEGORIES;CHARSET=UTF-8:" + hcard.category.join(",") + "\n";
    }
    if (hcard.rev) {
      vcf += "REV:" + hcard.rev + "\n";
    }
    if (hcard.bday) {
      vcf += "BDAY:" + hcard.bday + "\n";
    }
    if (hcard.uid) {
      vcf += "UID:" + hcard.uid + "\n";
    } else {
      vcf += "UID:\n";
    }
    if (hcard.url) {
      for (i=0;i<hcard.url.length;i++) {
        vcf += "URL:" + hcard.url[i] + "\n";
      }
    }
    if (hcard.email) {
      for (i=0;i<hcard.email.length;i++) {
        vcf += "EMAIL";
        if (hcard.email[i].type) {
          vcf += ";TYPE=";
          vcf += hcard.email[i].type.join(",");
        }
        vcf += ":";
        vcf += hcard.email[i].value;
        vcf += "\n";
      }
    }
    if (hcard.adr) {
      for (i=0;i<hcard.adr.length;i++) {
        vcf += "ADR;CHARSET=UTF-8";
        if (hcard.adr[i].type) {
          vcf += ";TYPE=";
          vcf += hcard.adr[i].type.join(",");
        }
        vcf += ":";
        if (hcard.adr[i]["post-office-box"]) {
          vcf += hcard.adr[i]["post-office-box"];
        }
        vcf += ";";
        if (hcard.adr[i]["extended-address"]) {
          vcf += hcard.adr[i]["extended-address"];
        }
        vcf += ";";
        if (hcard.adr[i]["street-address"]) {
          vcf += hcard.adr[i]["street-address"].join(",");
        }
        vcf += ";";
        if (hcard.adr[i].locality) {
          vcf += hcard.adr[i].locality;
        }
        vcf += ";";
        if (hcard.adr[i].region) {
          vcf += hcard.adr[i].region;
        }
        vcf += ";";
        if (hcard.adr[i]["postal-code"]) {
          vcf += hcard.adr[i]["postal-code"];
        }
        vcf += ";";
        if (hcard.adr[i]["country-name"]) {
          vcf += hcard.adr[i]["country-name"];
        }
        vcf += "\n";
      }
    }
    if (hcard.tel) {
      for (i=0;i<hcard.tel.length;i++) {
        vcf += "TEL";
        if (hcard.tel[i].type) {
          vcf += ";TYPE=";
          vcf += hcard.tel[i].type.join(",");
        }
        vcf += ":";
        vcf += hcard.tel[i].value;
        vcf += "\n";
      }
    }
    if (hcard.geo) {
      vcf += "GEO:" + hcard.geo.latitude + ";" + hcard. geo.longitude + "\n";
    }
    if (hcard.note) {
      vcf += "NOTE;CHARSET=UTF-8:";
      for (i=0; i< hcard.note.length;i++) {
        var s = hcard.note[i];
        s = s.replace(/\<.*?\>/gi, ' ');
        s = s.replace(/[\n\r\t]/gi, ' ');
        s = s.replace(/\s{2,}/gi, ' ');
        s = s.replace(/\s{2,}/gi, '');
        s = s.replace(/^\s+/, '');
        if (i != 0) {
          vcf += " ";
        }
        vcf += s;
      }
      vcf += "\n";
    }
    if (hcard.nickname) {
      vcf += "NICKNAME;CHARSET=UTF-8:" + hcard.nickname + "\n";
    }
    /* Add code to handle data URLs */
    if (hcard.photo) {
      vcf += "PHOTO;VALUE=uri:" + hcard.photo + "\n";
    }
    if (hcard.logo) {
      vcf += "LOGO;VALUE=uri:" + hcard.logo + "\n";
    }
    vcf += "END:VCARD\n";
    return vcf;
  },
  iCalendar: function(item, header, footer)
  {
    var hcalendar = ufJSParser.createMicroformat(item, "hCalendar");
    if (!hcalendar) {
      return;
    }
    var ics = "";
    if (header) {
      ics += "BEGIN:VCALENDAR\n";
      ics += "PRODID:\n";
      ics += "X-ORIGINAL-URL:" + content.document.location.href + "\n";
      ics += "X-WR-CALNAME:\n";
      ics += "VERSION:2.0\n";
      ics += "METHOD:PUBLISH\n";
    }
    ics += "BEGIN:VEVENT\n";
    if (hcalendar["class"]) {
      ics += "CLASS:" + hcalendar["class"] + "\n";
    }
    if (hcalendar.description) {
      var s = hcalendar.description;
      s = s.replace(/\<.*?\>/gi, '');
      s = s.replace(/[\n\r\t]/gi, ' ');
      s = s.replace(/\s{2,}/gi, ' ');
      s = s.replace(/\s{2,}/gi, '');
      s = s.replace(/^\s+/, '');

/*
      var newdescription = "";
      for (var i = 0; i < hcalendar.description.length; i++) {
        if ((hcalendar.description.charCodeAt(i) == 13)  && //r
            (hcalendar.description.charCodeAt(i + 1) == 10 )) { //n
          newdescription += hcalendar.description[i] + hcalendar.description[i+1] + '  ';
          i++;
        } else if ((hcalendar.description.charCodeAt(i) == 13 ) || //r
                   (hcalendar.description.charCodeAt(i) == 10 ))  { //n
          newdescription += hcalendar.description[i] + '  ';
        } else {
          newdescription += hcalendar.description[i];
        }
      }
*/
      ics += "DESCRIPTION;CHARSET=UTF-8:" + s + "\n";
    }
    if (hcalendar.location) {
      ics += "LOCATION;CHARSET=UTF-8:";
      if (typeof hcalendar.location == "object") {
        if (hcalendar.location.fn) {
          ics += hcalendar.location.fn;
        }
        if (hcalendar.location.adr[0]["street-address"]) {
          ics += ", ";
          ics += hcalendar.location.adr[0]["street-address"][0];
        }
        if (hcalendar.location.adr[0].locality) {
          ics += ", ";
          ics += hcalendar.location.adr[0].locality;
        }
        if (hcalendar.location.adr[0].region) {
          ics += ", ";
          ics += hcalendar.location.adr[0].region;
        }
        if (hcalendar.location.adr[0]["postal-code"]) {
          ics += " ";
          ics += hcalendar.location.adr[0]["postal-code"];
        }
        if (hcalendar.location.adr[0]["country-name"]) {
          ics += ",";
          ics += hcalendar.location.adr[0]["country-name"];
        }
      } else {
        ics += hcalendar.location;
      }
      ics += "\n";
    }
    if (hcalendar.summary) {
      ics += "SUMMARY;CHARSET=UTF-8:" + hcalendar.summary + "\n";
    }
    if (hcalendar.status) {
      ics += "STATUS:" + hcalendar.status + "\n";
    }
    if (hcalendar.transp) {
      ics += "TRANSP:" + hcalendar.transp + "\n";
    }
    /* OUTLOOK REQUIRES UID */
    ics += "UID:";
    if (hcalendar.uid) {
      ics += hcalendar.uid;
    }
    ics += "\n";
    if (hcalendar.url) {
      ics += "URL:" + hcalendar.url + "\n";
    }
    var dt;
    if (hcalendar.dtstart) {
      dt = hcalendar.dtstart;
      ics += "DTSTART;VALUE=DATE";
      if (hcalendar.dtstart.match("T")) {
        ics += "-TIME";
        var T = dt.indexOf("T");
        var offset = dt.lastIndexOf("-");
        /* If there is an offset and there is no Z, localize */
        if ((offset > T) || !dt.match("Z")) {
          dt = ufJSParser.localizeISO8601(dt);
        }
      }
      dt = dt.replace(/-/g,"").replace(/:/g,"");
      ics += ":" + dt + "\n";
    }
    if (hcalendar.dtend) {
      dt = hcalendar.dtend;
      ics += "DTEND;VALUE=DATE";
      if (hcalendar.dtstart.match("T")) {
        ics += "-TIME";
        var T = dt.indexOf("T");
        var offset = dt.lastIndexOf("-");
        /* If there is an offset and there is no Z, localize */
        if ((offset > T) || !dt.match("Z")) {
          dt = ufJSParser.localizeISO8601(dt);
        }
      } else {
        /* Work around upcoming.org bug */
        if (!Operator.upcomingOrgBugFixed) {
          if (content.document.location.href.indexOf("http://upcoming.org") == 0) {
            dt = dt.replace(/-/g, "");
            dt = (parseInt(dt)+1).toString();
          }
        }
      }
      dt = dt.replace(/-/g,"").replace(/:/g,"");
      ics += ":" + dt + "\n";
    }
    /* OUTLOOK REQUIRES DTSTAMP */
    ics += "DTSTAMP:";
    if (hcalendar.dtstamp) {
      ics += hcalendar.dtstamp;
    } else {
      ics += "19701209T000000Z";
    }
    ics += "\n";
    if (hcalendar.category) {
      ics += "CATEGORIES;CHARSET=UTF-8:" + hcalendar.category.join(",") + "\n";
    }
    if (hcalendar.location) {
      if (typeof hcalendar.location == "object") {
        if (hcalendar.location.geo) {
          ics += "GEO:" + hcalendar.location.geo.latitude + ";" + hcalendar.location.geo.longitude + "\n";
        }
      }
    }
    ics += "END:VEVENT\n";
    if (footer) {
      ics += "END:VCALENDAR\n";
    }

    return ics;
  }
};
