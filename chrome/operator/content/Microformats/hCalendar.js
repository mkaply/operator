if (Components.utils.import) {
  try {
    Components.utils.import("rel:Microformats.js");
    EXPORTED_SYMBOLS = ["hCalendar"];
  } catch (ex) {}
}

function hCalendar(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "hCalendar");
  }
}
hCalendar.prototype.toString = function() {
  if (this.resolvedNode) {
    /* If this microformat has an include pattern, put the */
    /* dtstart in parenthesis after the summary to differentiate */
    /* them. */
    var summaries = Microformats.getElementsByClassName(this.node, "summary");
    if (summaries.length === 0) {
      if (this.summary) {
        if (this.dtstart) {
          return this.summary + "(" + Microformats.parser.dateFromISO8601(this.dtstart).toLocaleString() + ")";
        }
      }
    }
  }
  return this.summary;
}

var hCalendar_definition = {
  version: "0.8",
  mfObject: hCalendar,
  className: "vevent",
  required: ["summary"],
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
};

Microformats.add("hCalendar", hCalendar_definition);
