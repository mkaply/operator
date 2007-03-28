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
        datatype: "microformat",
        microformat: "tag",
        microformat_property: "tag"
      },
      "class" : {
        value: "",
        types: ["public", "private", "confidential"]
      },
      "description" : {
        value: "",
        datatype: "HTML"
      },
      "dtend" : {
        value: "",
        datatype: "dateTime"
      },
      "dtstamp" : {
        value: "",
        datatype: "dateTime"
      },
      "dtstart" : {
        value: "",
        datatype: "dateTime"
      },
      "duration" : {
        value: ""
      },
      "location" : {
        value: "",
        datatype: "microformat",
        microformat: "hCard"
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
        datatype: "anyURI"
      },
      "url" : {
        value: "",
        datatype: "anyURI"
      },
      "last-modified" : {
        value: "",
        datatype: "dateTime"
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(mfnode) {
          if (mfnode.origNode) {
            /* If this microformat has an include pattern, put the */
            /* dtstart in parenthesis after the summary to differentiate */
            /* them. */
            var summaries = ufJSParser.getElementsByClassName(mfnode.origNode, "summary");
            if (summaries.length === 0) {
              var displayName = ufJSParser.getMicroformatProperty(mfnode, "hCalendar", "summary");
              if (displayName) {
                var dtstart = ufJSParser.getMicroformatProperty(mfnode, "hCalendar", "dtstart");
                if (dtstart) {
                  displayName += " (";
                  displayName += ufJSParser.microformats.hCalendar.dateFromISO8601(dtstart).toLocaleString();
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
  }
};
