/*extern ufJSParser */

function hCalendar() {
}

ufJSParser.microformats.hCalendar = {
  version: "0.2",
  mfName: "hCalendar",
  mfObject: hCalendar,
  className: "vevent",
  required: ["summary"],
  definition: {
    properties: {
      "category" : {
        value: [],
        getter: function(propnode, mfnode, definition) {
          if ((propnode.nodeName.toLowerCase() == "a") && (propnode.getAttribute("rel"))) {
            var tagname = ufJSParser.getMicroformatProperty(propnode, "tag", "tag");
            if (tagname) {
              return tagname;
            }
          }
          return definition.defaultGetter(propnode);
        }
      },
      "class" : {
        value: "",
        types: ["public", "private", "confidential"]
      },
      "description" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return propnode.innerHTML;
        }
      },
      "dtend" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.dateGetter(propnode);
        }
      },
      "dtstamp" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.defaultGetter(propnode).replace(/-/g,"");
        }
      },
      "dtstart" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.dateGetter(propnode);
        }
      },
      "duration" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          var duration = definition.defaultGetter(propnode);
          if (duration) {
            return duration;
          }
        }
      },
      "location" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          if (propnode.className.match("(^|\\s)" + "vcard" + "(\\s|$)")) {
            return ufJSParser.createMicroformat(propnode, "hCard");
          } else {
            return definition.defaultGetter(propnode);
          }
        }
      },
      "status" : {
        value: "",
        types: ["tentative", "confirmed", "cancelled"]
      },
      "summary" : {
        value: ""
      },
      "transp" : {
        value: "",
        types: ["opaque", "transparent"]
      },
      "uid" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.urlGetter(propnode);
        }
      },
      "url" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.urlGetter(propnode);
        }
      },
      "last-modified" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.dateGetter(propnode);
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          if (mfnode.origNode) {
            var summaries = ufJSParser.getElementsByClassName(mfnode.origNode, "summary");
            if (summaries.length === 0) {
              var displayName = ufJSParser.getMicroformatProperty(mfnode, "hCalendar", "summary");
              if (displayName) {
                var dtstart = ufJSParser.getMicroformatProperty(mfnode, "hCalendar", "dtstart");
                if (dtstart) {
                  displayName += " (";
                  displayName += definition.dateFromISO8601(dtstart).toLocaleString();
                  displayName += ")";
                }  
                return displayName;
              }
            }
          }
          return ufJSParser.getMicroformatProperty(mfnode, "hCalendar", "summary");
        }
      }
    },
    dateFromISO8601: function(string)
    {
      var dateArray = string.match(/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(?:Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
    
      var date = new Date(dateArray[1], 0, 1);
      date.time = false;
  
      if (dateArray[2]) {
        date.setMonth(dateArray[2] - 1);
      }
      if (dateArray[3]) {
        date.setDate(dateArray[3]);
      }
      if (dateArray[4]) {
        date.setHours(dateArray[4]);
        date.time = true;
        if (dateArray[5]) {
          date.setMinutes(dateArray[5]);
          if (dateArray[6]) {
            date.setSeconds(dateArray[6]);
            if (dateArray[7]) {
              date.setMilliseconds(Number("0." + dateArray[7]) * 1000);
            }
          }
        }
      }
      return date;
    },
    descriptionGetter: function(propnode) {
    },
    dateGetter: function(propnode) {
      var date = this.defaultGetter(propnode);
      if (date.indexOf('-') == -1) {
        var newdate = "";
        var i;
        for (i=0;i<date.length;i++) {
          newdate += date.charAt(i);
          if ((i == 3) || (i == 5)) {
            newdate += "-";
          }
          if ((i == 10) || (i == 12)) {
            newdate += ":";
          }
        }
        date = newdate;
      }
      return date;
    },
    urlGetter: function(propnode) {
      if (propnode.nodeName.toLowerCase() == "a") {
        return propnode.href;
      } else if (propnode.nodeName.toLowerCase() == "img") {
        return propnode.src;
      } else if (propnode.nodeName.toLowerCase() == "object") {
        return propnode.data;
      } else if (propnode.nodeName.toLowerCase() == "area") {
        return propnode.href;
      } else {
        return this.defaultGetter(propnode);
      }
    },
    defaultGetter: function(propnode) {
      if ((propnode.nodeName.toLowerCase() == "abbr") && (propnode.getAttribute("title"))) {
        return propnode.getAttribute("title");
      } else if ((propnode.nodeName.toLowerCase() == "img") && (propnode.getAttribute("alt"))) {
        return propnode.getAttribute("alt");
      } else if ((propnode.nodeName.toLowerCase() == "area") && (propnode.getAttribute("alt"))) {
        return propnode.getAttribute("alt");
      } else {
        var values = ufJSParser.getElementsByClassName(propnode, "value");
        if (values.length > 0) {
          var value = "";
          for (var j=0;j<values.length;j++) {
            value += values[j].textContent;
          }
          return value;
        } else {
          var s;
          if (propnode.innerText) {
            s = propnode.innerText;
          } else {
            s = propnode.textContent;
          }
          return ufJSParser.trim(s);
        }
      }
    }
  },
  validate: function(node, error) {
    var summary = ufJSParser.getMicroformatProperty(node, "hCalendar", "summary");
    if (!summary) {
      if (error) {
        error.message = "No summary specified";
      }
      return false;
    }
    return true;
  }
};
