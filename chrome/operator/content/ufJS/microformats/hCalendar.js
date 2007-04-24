function hCalendar(node) {
  if (node) {
    ufJSParser.newMicroformat(this, node, "hCalendar");
  }
}
hCalendar.prototype.toString = function() {
  if (this.node.origNode) {
    /* If this microformat has an include pattern, put the */
    /* dtstart in parenthesis after the summary to differentiate */
    /* them. */
    var summaries = ufJSParser.getElementsByClassName(this.node.origNode, "summary");
    if (summaries.length === 0) {
      if (this.summary) {
        if (this.dtstart) {
          return this.summary + "(" + ufJSParser.dateFromISO8601(this.dtstart).toLocaleString() + ")";
        }
      }
    }
  }
  return this.summary;
}

ufJSParser.microformats.hCalendar = {
  version: "0.7",
  mfObject: hCalendar,
  className: "vevent",
  required: ["summary"],
  definition: {
    properties: {
      "category" : {
        plural: true,
        datatype: "microformat",
        microformat: "tag",
        microformat_property: "tag"
      },
      "class" : {
        types: ["public", "private", "confidential"]
      },
      "description" : {
        datatype: "HTML"
      },
      "dtstart" : {
        datatype: "dateTime"
      },
      "dtend" : {
        datatype: "dateTime"
      },
      "dtstamp" : {
        datatype: "dateTime"
      },
      "duration" : {
      },
      "location" : {
        datatype: "microformat",
        microformat: "hCard"
      },
      "status" : {
        types: ["tentative", "confirmed", "cancelled"]
      },
      "summary" : {},
      "transp" : {
        types: ["opaque", "transparent"]
      },
      "uid" : {
        datatype: "anyURI"
      },
      "url" : {
        datatype: "anyURI"
      },
      "last-modified" : {
        datatype: "dateTime"
      }
    }
  }
};
