EXPORTED_SYMBOLS = ["Microformats"];

var Microformats = {
  version: 0.8,
  inited: false,
  /* When a microformat is added, the name is placed in this list */
  list: [],
  /* Custom iterator so that microformats can be enumerated as */
  /* for (i in Microformats */
  __iterator__: function () {
    var i;
    for (i=0; i < this.list.length; i++) {
      yield this.list[i];
    }
  },
  /**
   * Internal function to initialize microformats. First it tries to use the
   * Component.utils.import method that will be in Firefox 3. If that fails,
   * it looks for certain microformat definition files in the same directory
   * as this JS file.
   */
  init: function() {
    if (!Microformats.inited) {
      Microformats.inited = true
      /* Try to import as components */
      if (Components.utils.import) {
        try {
          Components.utils.import("rel:adr.js");
        } catch (ex) {}
        try {
          Components.utils.import("rel:hCard.js");
        } catch (ex) {}
        try {
          Components.utils.import("rel:hCalendar.js");
        } catch (ex) {}
      }
      /* If the import failed or we didn't import at all, load */
      /* We'll use hCard as the touchstone */
      var ojl = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                           getService(Components.interfaces.mozIJSSubScriptLoader);
      /* Find the location of the JS file we are in */
      var stack = (new Error()).stack.split("\n");
      var end = stack[1].indexOf("Microformats.js");
      var begin = stack[1].lastIndexOf("@", end)+1;
      var baseurl = stack[1].substring(begin, end);

      if (typeof(Address) == "undefined") {
        try {
          ojl.loadSubScript(baseurl + "adr.js");
        } catch (ex) {}
      }
      if (typeof(hCard) == "undefined") {
        try {
          ojl.loadSubScript(baseurl + "hCard.js");
        } catch (ex) {}
      }
      if (typeof(hCalendar) == "undefined") {
        try {
          ojl.loadSubScript(baseurl + "hCalendar.js");
        } catch (ex) {}
      }
      try {
        ojl.loadSubScript(baseurl + "tag.js");
      } catch (ex) {}
      try {
        ojl.loadSubScript(baseurl + "geo.js");
      } catch (ex) {}
      try {
        ojl.loadSubScript(baseurl + "xFolk.js");
      } catch (ex) {}
    }
  },
  /**
   * Retrieves microformats objects of the given type from a document
   * 
   * @param  name          The name of the microformat (required)
   * @param  rootElement   The DOM element at which to start searching (required)
   * @param  recurseFrames Whether or not to search child frames for microformats (optional - defaults to true)
   * @param  microformats  An array of microformat objects to which is added the results (optional)
   * @return A new array of microformat objects or the passed in microformat 
   *         object array with the new objects added
   */
  get: function(name, rootElement, recurseFrames, microformats) {
    var i;

    if (!microformats) {
      microformats = [];
    }
    if (!rootElement) {
      rootElement = content.document;
    }

    /* If recurseFrames is undefined or true, look through all child frames for microformats */
    if ((recurseFrames == undefined) || (recurseFrames == true)) {
      if (rootElement.defaultView && rootElement.defaultView.frames.length > 0) {
        for (i=0; i < rootElement.defaultView.frames.length; i++) {
          Microformats.get(name, rootElement.defaultView.frames[i].document, recurseFrames, microformats);
        }
      }
    }

    /* Get the microformat nodes for the document */
    var microformatNodes = [];
    if (Microformats[name]) {
      if (Microformats[name].className) {
        microformatNodes = Microformats.getElementsByClassName(rootElement,
                                          Microformats[name].className);
        /* alternateClassName is for cases where a parent microformat is inferred by the children */
        /* If we find alternateClassName, the entire document becomes the microformat */
        if ((microformatNodes.length == 0) && (Microformats[name].alternateClassName)) {
          var temp = Microformats.getElementsByClassName(rootElement, Microformats[name].alternateClassName);
          if (temp.length > 0) {
            microformatNodes.push(rootElement); 
          }
        }
      } else if (Microformats[name].attributeValues) {
        microformatNodes = Microformats.getElementsByAttribute(rootElement,
                                          Microformats[name].attributeName,
                                          Microformats[name].attributeValues);
        
      }
    }
    /* Create objects for the microformat nodes and put them into the microformats */
    /* array */
    for (i = 0; i < microformatNodes.length; i++) {
      microformats.push(new Microformats[name].mfObject(microformatNodes[i]));
    }
    return microformats;
  },
  /**
   * Counts microformats objects of the given type from a document
   * 
   * @param  name          The name of the microformat (required)
   * @param  rootElement   The DOM element at which to start searching (required)
   * @param  recurseFrames Whether or not to search child frames for microformats (optional - defaults to true)
   * @param  count         The current count
   * @return The new count
   */
  count: function(name, rootElement, recurseFrames, count) {
    var i;

    if (!count) {
      count = 0;
    }
    if (!rootElement) {
      rootElement = content.document;
    }

    /* If recurseFrames is undefined or true, look through all child frames for microformats */
    if ((recurseFrames == undefined) || (recurseFrames == true)) {
      if (rootElement.defaultView && rootElement.defaultView.frames.length > 0) {
        for (i=0; i < rootElement.defaultView.frames.length; i++) {
          Microformats.count(name, rootElement.defaultView.frames[i].document, recurseFrames, count);
        }
      }
    }

    /* Get the microformat nodes for the document */
    var microformatNodes = [];
    if (Microformats[name]) {
      if (Microformats[name].className) {
        microformatNodes = Microformats.getElementsByClassName(rootElement,
                                          Microformats[name].className);
        /* alternateClassName is for cases where a parent microformat is inferred by the children */
        /* If we find alternateClassName, the entire document becomes the microformat */
        if ((microformatNodes.length == 0) && (Microformats[name].alternateClassName)) {
          var temp = Microformats.getElementsByClassName(rootElement, Microformats[name].alternateClassName);
          if (temp.length > 0) {
            microformatNodes.push(rootElement); 
          }
        }
      } else if (Microformats[name].attributeValues) {
        microformatNodes = Microformats.getElementsByAttribute(rootElement,
                                          Microformats[name].attributeName,
                                          Microformats[name].attributeValues);
        
      }
    }
    count += microformatNodes.length;
    return count;
  },
  /**
   * Returns true if the passed in node is a microformat. Does NOT return true
   * if the passed in node is a child of a microformat.
   *
   * @param  node          DOM node to check
   * @return true if the node is a microformat, false if it is not
   */
  isMicroformat: function(node) {
    var i;
    for (i in Microformats)
    {
      if (Microformats[i].className) {
        if (node.getAttribute('class')) {
          if (node.getAttribute('class').match("(^|\\s)" + Microformats[i].className + "(\\s|$)")) {
            return true;
          }
        }
      } else {
        var attribute;
        if (attribute = node.getAttribute(Microformats[i].attributeName)) {
          var attributeList = Microformats[i].attributeValues.split(" ");
          for (var j=0; j < attributeList.length; j++) {
            if (attribute.match("(^|\\s)" + attributeList[j] + "(\\s|$)")) {
              return true;
            }
          }
        }
      }
    }
    return false;
  },
  /**
   * If the passed in node is contained in a microformat, this function returns
   * the microformat that contains it. If the passed in node is a microformat,
   * it still returns the parent.
   *
   * @param  node          DOM node to check
   * @return If the node is contained in a microformat, it returns the parent
   *         DOM node, otherwise returns nothing
   */
  getParent: function(node) {
    var xpathExpression;
    var xpathResult;
    var mfname;
    var i, j;
    for (i in Microformats)
    {
      mfname = i;
      if (Microformats[mfname]) {
        if (Microformats[mfname].className) {
          xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' " + Microformats[mfname].className + " ')]";
        } else if (Microformats[mfname].attributeValues) {
          xpathExpression = "ancestor::*[";
          var attributeList = Microformats[i].attributeValues.split(" ");
          for (var j=0; j < attributeList.length; j++) {
            if (j != 0) {
              xpathExpression += " or ";
            }
            xpathExpression += "contains(concat(' ', @" + Microformats[mfname].attributeName + ", ' '), ' " + attributeList[j] + " ')";
          }
          xpathExpression += "]"; 
        } else {
          continue;
        }
        xpathResult = (node.ownerDocument || node).evaluate(xpathExpression, node, null,  Components.interfaces.nsIDOMXPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (xpathResult.singleNodeValue) {
          xpathResult.singleNodeValue.microformat = mfname;
          return xpathResult.singleNodeValue;
        }
      }
    }
    return;
  },
  /**
   * If the passed in node is a microformat, this function returns a space 
   * separated list of the microformat names that correspond to this node
   *
   * @param  node          DOM node to check
   * @return If the node is a microformat, a space separated list of microformat
   *         names, otherwise returns nothing
   */
  getNamesFromNode: function(node) {
    var i;
    var microformatNames = [];
    var xpathExpression;
    var xpathResult;
    var i, j;
    for (i in Microformats)
    {
      if (Microformats[i]) {
        if (Microformats[i].className) {
          if (node.getAttribute('class')) {
            if (node.getAttribute('class').match("(^|\\s)" + Microformats[i].className + "(\\s|$)")) {
              microformatNames.push(i);
              continue;
            }
          }
        } else if (Microformats[i].attributeValues) {
          var attribute;
          if (attribute = node.getAttribute(Microformats[i].attributeName)) {
            var attributeList = Microformats[i].attributeValues.split(" ");
            for (var j=0; j < attributeList.length; j++) {
              if (attribute.match("(^|\\s)" + attributeList[j] + "(\\s|$)")) {
                microformatNames.push(i);
                continue;
              }
            }
          }
        } else {
          continue;
        }
      }
    }
    return microformatNames.join(" ");
  },
  /**
   * Outputs the contents of a microformat object for debug purposes.
   *
   * @param  microformatObject JavaScript object that represents a microformat
   * @return string containing a visual representation of the contents of the microformat
   */
  debug: function debug(microformatObject) {
    function dumpObject(item, indent)
    {
      if (!indent) {
        indent = "";
      }
      var i;
      var toreturn = "";
      var testArray = [];
      
      for (i in item)
      {
        if (testArray[i]) {
          continue;
        }
        if (typeof item[i] == "object") {
          if ((i != "node") && (i != "resolvedNode")) {
            if (item[i].semanticType) {
              toreturn += indent + item[i].semanticType + " [" + i + "] { \n";
            } else {
              toreturn += indent + "object " + i + " { \n";
            }
            toreturn += dumpObject(item[i], indent + "\t");
            toreturn += indent + "}\n";
          }
        } else if ((typeof item[i] != "function") && (i != "semanticType")) {
          if (item[i]) {
            toreturn += indent + i + "=" + item[i] + "\n";
          }
        }
      }
      return toreturn;
    }
    return dumpObject(microformatObject);
  },
  add: function add(microformat, microformatDefinition) {
    /* We always replace an existing definition with the new one */
    if (microformatDefinition.mfVersion == Microformats.version) {
      Microformats[microformat] = microformatDefinition;
      Microformats.list.push(microformat); 
      microformatDefinition.mfObject.prototype.debug = function(microformatObject) {return Microformats.debug(microformatObject)};
    }
  },
  /* All parser specific function are contained in this object */
  parser: {
    /**
     * Uses the microformat patterns to decide what the correct text for a
     * given microformat property is. This includes looking at things like
     * abbr, img/alt, area/alt and value excerpting.
     *
     * @param  propnode   The DOMNode to check
     * @param  parentnode The parent node of the property. If it is a subproperty,
     *                    this is the parent property node. If it is not, this is the
     *                    microformat node.
     * @return A string with the value of the property
     */
    defaultGetter: function(propnode, parentnode) {
      if (((((propnode.localName.toLowerCase() == "abbr") || (propnode.localName.toLowerCase() == "html:abbr")) && !propnode.namespaceURI) || 
         ((propnode.localName.toLowerCase() == "abbr") && (propnode.namespaceURI == "http://www.w3.org/1999/xhtml"))) && (propnode.getAttribute("title"))) {
        return propnode.getAttribute("title");
      } else if ((propnode.nodeName.toLowerCase() == "img") && (propnode.getAttribute("alt"))) {
        return propnode.getAttribute("alt");
      } else if ((propnode.nodeName.toLowerCase() == "area") && (propnode.getAttribute("alt"))) {
        return propnode.getAttribute("alt");
      } else {
        var values;
        /* This is ugly. Some cases (email and tel for hCard) are called value */
        /* but can also use value-excerpting. This handles that */
        if (parentnode && propnode.getAttribute('class').match("(^|\\s)" + "value" + "(\\s|$)")) {
          var parent_values = Microformats.getElementsByClassName(parentnode, "value");
          if (parent_values.length > 1) {
            values = parent_values;
          }
        }
        if (!values) {
          values = Microformats.getElementsByClassName(propnode, "value");
        }
        if (values.length > 0) {
          var value = "";
          for (var j=0;j<values.length;j++) {
            if (values[j].innerText) {
              value += values[j].innerText;
            } else {
              value += values[j].textContent;
            }
          }
          return value;
        } else {
          var s;
          if (propnode.innerText) {
            s = propnode.innerText;
          } else {
            s = propnode.textContent;
          }
          /* Remove any HTML tags and their contents */
          /* This used to be replacing with a space - I don't like that */
          s	= s.replace(/\<.*?\>/gi, '');
          /* Remove new lines, carriage returns and tabs */
          s	= s.replace(/[\n\r\t]/gi, ' ');
          /* Replace any double spaces with single spaces */
          s	= s.replace(/\s{2,}/gi, ' ');
          /* Remove any double spaces that are left */
          s	= s.replace(/\s{2,}/gi, '');
          /* Remove any spaces at the beginning */
          s	= s.replace(/^\s+/, '');
          /* Remove any spaces at the end */
          s	= s.replace(/\s+$/, '');
          if (s.length > 0) {
            return s;
          }
        }
      }
    },
    /**
     * Used to specifically retrieve a date in a microformat node.
     * After getting the default text, it normalizes it to an ISO8601 date.
     *
     * @param  propnode   The DOMNode to check
     * @param  parentnode The parent node of the property. If it is a subproperty,
     *                    this is the parent property node. If it is not, this is the
     *                    microformat node.
     * @return A string with the normalized date.
     */
    dateTimeGetter: function(propnode, parentnode) {
      var date = Microformats.parser.defaultGetter(propnode, parentnode);
      if (date) {
        return Microformats.parser.normalizeISO8601(date);
      }
    },
    /**
     * Used to specifically retrieve a URI in a microformat node. This includes
     * looking at an href/img/object/area to get the fully qualified URI.
     *
     * @param  propnode   The DOMNode to check
     * @param  parentnode The parent node of the property. If it is a subproperty,
     *                    this is the parent property node. If it is not, this is the
     *                    microformat node.
     * @return A string with the fully qualified URI.
     */
    uriGetter: function(propnode, parentnode) {
      if (propnode.nodeName.toLowerCase() == "a") {
        return propnode.href;
      } else if (propnode.nodeName.toLowerCase() == "img") {
        return propnode.src;
      } else if (propnode.nodeName.toLowerCase() == "object") {
        return propnode.data;
      } else if (propnode.nodeName.toLowerCase() == "area") {
        return propnode.href;
      } else {
        return Microformats.parser.defaultGetter(propnode, parentnode);
      }
    },
    /**
     * Used to specifically retrieve an email address in a microformat node.
     * This includes at an href, as well as removing subject if specified and
     * the mailto prefix.
     *
     * @param  propnode   The DOMNode to check
     * @param  parentnode The parent node of the property. If it is a subproperty,
     *                    this is the parent property node. If it is not, this is the
     *                    microformat node.
     * @return A string with the email address.
     */
    emailGetter: function(propnode, parentnode) {
      if ((propnode.nodeName.toLowerCase() == "a") || (propnode.nodeName.toLowerCase() == "area")) {
        var mailto = propnode.href;
        if (mailto.indexOf('?') > 0) {
          return unescape(mailto.substring("mailto:".length, mailto.indexOf('?')));
        } else {
          return unescape(mailto.substring("mailto:".length));
        }
      } else {
        return Microformats.parser.defaultGetter(propnode, parentnode);
      }
    },
    /**
     * Used to specifically retrieve HTML in a microformat node.
     *
     * @param  propnode   The DOMNode to check
     * @param  parentnode The parent node of the property. If it is a subproperty,
     *                    this is the parent property node. If it is not, this is the
     *                    microformat node.
     * @return A string with the HTML including all tags.
     */
    HTMLGetter: function(propnode, parentnode) {
      return propnode.innerHTML;
    },
    /**
     * Internal parser API used to determine which getter to call based on the
     * datatype specified in the microformat definition.
     *
     * @param  prop       The microformat property in the definition
     * @param  propnode   The DOMNode to check
     * @param  parentnode The parent node of the property. If it is a subproperty,
     *                    this is the parent property node. If it is not, this is the
     *                    microformat node.
     * @return A string with the property value.
     */
    datatypeHelper: function(prop, node, parentnode) {
      var result;
      switch (prop.datatype) {
        case "dateTime":
          result = Microformats.parser.dateTimeGetter(node, parentnode);
          break;
        case "anyURI":
          result = Microformats.parser.uriGetter(node, parentnode);
          break;
        case "email":
          result = Microformats.parser.emailGetter(node, parentnode);
          break;
        case "HTML":
          result = Microformats.parser.HTMLGetter(node, parentnode);
          break;
        case "float":
          result = parseFloat(Microformats.parser.defaultGetter(node, parentnode));
          break;
        case "custom":
          result = prop.customGetter(node, parentnode);
          break;
        case "microformat":
          try {
            result = new Microformats[prop.microformat].mfObject(node);
          } catch (ex) {}
          if (result) {
            if (prop.microformat_property) {
              result = result[prop.microformat_property];
            }
            break;
          }
        default:
          result = Microformats.parser.defaultGetter(node, parentnode);
          if ((prop.implied) && (result)) {
            var temp = result;
            result = {};
            result[prop.implied] = temp;
          }
          break;
      }
      return result;
    },
    newMicroformat: function(object, in_node, microformat) {
      /* check to see if we are even valid */
      if (!Microformats[microformat]) {
        throw("Invalid microformat - " + microformat);
      }
      if (in_node.ownerDocument) {
        if (Microformats[microformat].attributeName) {
          if (!(in_node.getAttribute(Microformats[microformat].attributeName))) {
            throw("Node is not a microformat (" + microformat + ")");
          }
        } else {
          if (!(in_node.getAttribute('class').match("(^|\\s)" + Microformats[microformat].className + "(\\s|$)"))) {
            throw("Node is not a microformat (" + microformat + ")");
          }
        }
      }
      var node = in_node;
      if ((Microformats[microformat].className) && (in_node.ownerDocument)) {
        node = Microformats.parser.preProcessMicroformat(in_node);
      }
  
      for (var i in Microformats[microformat].properties) {
        object.__defineGetter__(i, Microformats.parser.getMicroformatPropertyGenerator(node, microformat, i, object));
      }
      
      /* The node in the object should be the original node */
      object.node = in_node;
      /* we also store the nodes that has been "resolved" */
      object.resolvedNode = node; 
      object.semanticType = microformat;
    },
    getMicroformatPropertyGenerator: function getMicroformatPropertyGenerator(node, name, property, microformat)
    {
      return function() {
        var result = Microformats.parser.getMicroformatProperty(node, name, property);
        delete microformat[property];
        if (result) {
          microformat[property] = result; 
          return result;
        }
      };
    },
    getMicroformatProperty: function getMicroformatProperty(in_mfnode, mfname, propname) {
      var i, j, k;
      var result;
      var mfnode = in_mfnode;
      if (!in_mfnode.origNode && Microformats[mfname].className && in_mfnode.ownerDocument) {
        mfnode = Microformats.parser.preProcessMicroformat(in_mfnode);
      }
      var foundProps = false;
      var tp;
      if (Microformats[mfname].properties[propname]) {
        tp = Microformats[mfname].properties[propname];
      }
  /* OK this is strange so let me explain it. If we didn't find the property
     that was passed in, look for it among the subproperties. If you find it, 
     AND the classname of the passed in mfnode matches the parent property,
     use it. This allows us to pass in an hentry and get it's entry-title
     for instance. This only works one level deep. */
      if (!tp) {
        for (i in Microformats[mfname].properties) {
          if (Microformats[mfname].properties[i].subproperties) {
            if (Microformats[mfname].properties[i].subproperties[propname]) {
              if (mfnode.getAttribute('class')) {
                if (mfnode.getAttribute('class').match("(^|\\s)" + i + "(\\s|$)")) {
                  tp = Microformats[mfname].properties[i].subproperties[propname];
                  break;
                }
              }
            }
          }
        }
      }
      var propnodes;
      if (!tp) {
        /* propname contains a . - dereference it */
        if (propname.indexOf(".") != -1) {
          var props = propname.split(".");
          tp = Microformats[mfname].properties[props[0]];
          if (tp && tp.rel == true) {
            propnodes = Microformats.getElementsByAttribute(mfnode, "rel", props[0]);
          } else {
            propnodes = Microformats.getElementsByClassName(mfnode, props[0]);
          }
        }
      } else {
        if (tp && tp.rel == true) {
          propnodes = Microformats.getElementsByAttribute(mfnode, "rel", propname);
        } else {
          propnodes = Microformats.getElementsByClassName(mfnode, propname);
        }
      }
  
      var property;
      if (!tp) {
  //      alert("Bad property name - " + propname);
        return;
      }
  //    if (tp.value instanceof Array) {
  //      property = [];
  //    } else {
  //      property = {};
  //    }
      var curprop = 0;
      var validType, type;
      for (j = 0; j < propnodes.length; j++) {
        foundProps = true;
        var callPropertyGetter = true;
        if (tp.subproperties) {
          var subprop;
          for (subprop in tp.subproperties) {
            var foundSubProperties = false;
            var subpropnodes = Microformats.getElementsByClassName(propnodes[j], subprop);
            var cursubprop = 0;
            for (k = 0; k < subpropnodes.length; k++) {
              if (tp.subproperties[subprop].datatype) {
                result = Microformats.parser.datatypeHelper(tp.subproperties[subprop], subpropnodes[k], propnodes[j]);
              } else {
                result = Microformats.parser.defaultGetter(subpropnodes[k], propnodes[j]);
                if ((tp.subproperties[subprop].implied) && (result)) {
                  var temp = result;
                  result = {};
                  result[tp.subproperties[subprop].implied] = temp;
                }
              }
              if (tp.subproperties[subprop].types) {
                validType = false;
                for (type in tp.subproperties[subprop].types) {
                  if (result.toLowerCase() == tp.subproperties[subprop].types[type]) {
                    validType = true;
                    break;
                  }
                }
                if (!validType) {
                  continue;
                }
              }
              if (result) {
                foundSubProperties = true;
                callPropertyGetter = false;
                if (tp.plural) {
                  if (!property) {
                    property = [];
                  }
                  if (!property[curprop]) {
                    property[curprop] = [];
                  }
                  if (tp.subproperties[subprop].plural) {
                    if (!property[curprop][subprop]) {
                      property[curprop][subprop] = [];
                    }
                    property[curprop][subprop][cursubprop] = result;
                  } else {
                    property[curprop][subprop] = result;
                  }
                } else {
                  if (!property) {
                    property = {};
                  }
                  if (tp.subproperties[subprop].plural) {
                    if (!property[subprop]) {
                      property[subprop] = [];
                    }
                    property[subprop][cursubprop] = result;
                  } else {
                    property[subprop] = result;
                  }
                }
              }
              
              if (!tp.subproperties[subprop].plural) {
                break;
              }
              cursubprop++;
            }
            if (!foundSubProperties) {
              if (tp.subproperties[subprop].virtual) {
                if (tp.subproperties[subprop].virtualGetter) {
                  result = tp.subproperties[subprop].virtualGetter(propnodes[j], propnodes[j]);
                } else {
                  result = Microformats.parser.datatypeHelper(tp.subproperties[subprop], propnodes[j]);
                }
                if (result) {
                  callPropertyGetter = false;
                  if (tp.plural) {
                    if (!property) {
                      property = [];
                    }
                    if (!property[curprop]) {
                      property[curprop] = [];
                    }
                    if (tp.subproperties[subprop].plural) {
                      if (!property[curprop][subprop]) {
                        property[curprop][subprop] = [];
                      }
                      property[curprop][subprop][cursubprop] = result;
                    } else {
                      property[curprop][subprop] = result;
                    }
                  } else {
                    if (!property) {
                      property = {};
                    }
                    if (tp.subproperties[subprop].plural) {
                      if (!property[subprop]) {
                        property[subprop] = [];
                      }
                      property[subprop][cursubprop] = result;
                    } else {
                      property[subprop] = result;
                    }
                  }
                }
              }
            }
          }
        }
        /* If we didn't find any sub properties for the property, check
           to see if the property has a getter. If it does, call it. This
           is to handle cases where the property sets up the subproperty
           (org->organization-name) */
        if (callPropertyGetter) {
          if (tp.datatype) {
            result = Microformats.parser.datatypeHelper(tp, propnodes[j]);
          } else {
            result = Microformats.parser.defaultGetter(propnodes[j]);
            if ((tp.implied) && (result)) {
              var temp = result;
              result = {};
              result[tp.implied] = temp;
            }
          }
          if (tp.types) {
            validType = false;
            for (type in tp.types) {
              if (result.toLowerCase() == tp.types[type]) {
                validType = true;
                break;
              }
            }
            if (!validType) {
              continue;
            }
          }
          if (result) {
            if (tp.plural) {
              if (!property) {
                property = [];
              }
              property[curprop] = result;
            } else {
              if (!property) {
                property = {};
              }
              property = result;
            }
          }
          if (!tp.plural) {
            break;
          }
        }
        curprop++;
      }
      /* If we didn't find the property, check to see if it is a virtual
         property and if so, call it's getter. */
      if (!foundProps) {
        if (tp.virtual) {
          if (tp.virtualGetter) {
            result = tp.virtualGetter(mfnode, mfnode);
          } else {
            result = Microformats.parser.datatypeHelper(tp, mfnode);
          }
          if (tp.cardinality == "plural") {
            if (result) {
              if (!property) {
                property = [];
              }
              property[0] = result;
            } else {
              return;
            }
          } else {
            if (result) {
              property = result;
            } else {
              return;
            }
          }
        } else {
          return;
        }
      }
      /* propname contains a . - dereference it */
      /* this needs to be way more robust */
      /* check if property is an array and if so only return 1st element */
      /* handle multuiple nestings */
      if (propname.indexOf(".") != -1) {
        var props = propname.split(".");
        return property[props[1]];
      }
      return property;
    },
    /**
     * Internal parser API used to resolve includes and headers. Includes are
     * resolved by simply cloning the node and replacing it in a clone of the
     * original DOM node. Headers are resolved by creating a span and then copying
     * the innerHTML and the class name.
     *
     * @param  in_mfnode The node to preProcess.
     * @return If the node had includes or headers, a cloned node otherwise
     *         the original node. You can check to see if the node was cloned
     *         by looking for .origNode in the new node.
     */
    preProcessMicroformat: function(in_mfnode) {
      var mfnode;
      var i;
      var includes = Microformats.getElementsByClassName(in_mfnode, "include");
      if ((includes.length > 0) || ((in_mfnode.nodeName.toLowerCase() == "td") && (in_mfnode.getAttribute("headers")))) {
        mfnode = in_mfnode.cloneNode(true);
        mfnode.origNode = in_mfnode;
        if (includes.length > 0) {
          includes = Microformats.getElementsByClassName(mfnode, "include");
          var includeId;
          var include_length = includes.length;
          for (i = include_length -1; i >= 0; i--) {
            if (includes[i].nodeName.toLowerCase() == "a") {
              includeId = includes[i].getAttribute("href").substr(1);
            }
            if (includes[i].nodeName.toLowerCase() == "object") {
              includeId = includes[i].getAttribute("data").substr(1);
            }
            try {
              includes[i].parentNode.replaceChild(in_mfnode.ownerDocument.getElementById(includeId).cloneNode(true), includes[i]);
            } catch(ex) {}
          }
        } else {
          var headers = in_mfnode.getAttribute("headers").split(" ");
          for (i = 0; i < headers.length; i++) {
            try {
              var tempNode = in_mfnode.ownerDocument.createElement("span");
              var headerNode = in_mfnode.ownerDocument.getElementById(headers[i]);
              tempNode.innerHTML = headerNode.innerHTML;
              tempNode.className = headerNode.className;
              mfnode.appendChild(tempNode);
            } catch(ex) {}
          }
        }
      } else {
        mfnode = in_mfnode;
      }
      return mfnode;
    },
    validate: function(mfnode, mfname, error) {
      if (Microformats[mfname].validate) {
        return Microformats[mfname].validate(mfnode, error);
      } else {
        var mfobject = new Microformats[mfname].mfObject(mfnode);
        if (Microformats[mfname].required) {
          error.message = "";
          for (var i=0;i<Microformats[mfname].required.length;i++) {
            if (!mfobject[Microformats[mfname].required[i]]) {
              error.message += "Required property " + Microformats[mfname].required[i] + " not specified\n";
            }
          }
          if (error.message.length > 0) {
            return false;
          }
        } else {
          if (!mfobject.toString()) {
            error.message = "Unable to create microformat";
            return false;
          }
        }
        return true;
      }
    },
    /* This function normalizes an ISO8601 date by adding punctuation and */
    /* ensuring that hours and seconds have values */
    normalizeISO8601: function(string)
    {
      var dateArray = string.match(/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(?:([-+Z])(?:(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
  
      var dateString;
      if (!dateArray) {
        return;
      }
      if (dateArray[1]) {
        dateString = dateArray[1];
        if (dateArray[2]) {
          dateString += "-" + dateArray[2];
          if (dateArray[3]) {
            dateString += "-" + dateArray[3];
            if (dateArray[4]) {
              dateString += "T" + dateArray[4];
              if (dateArray[5]) {
                dateString += ":" + dateArray[5];
              } else {
                dateString += ":" + "00";
              }
              if (dateArray[6]) {
                dateString += ":" + dateArray[6];
              } else {
                dateString += ":" + "00";
              }
              if (dateArray[7]) {
                dateString += "." + dateArray[7];
              }
              if (dateArray[8]) {
                dateString += dateArray[8];
                if ((dateArray[8] == "+") || (dateArray[8] == "-")) {
                  if (dateArray[9]) {
                    dateString += dateArray[9];
                    if (dateArray[10]) {
                      dateString += ":" + dateArray[10];
                    }
                  }
                }
              }
            }
          }
        }
      }
      return dateString;
    },
  },
  /**
   * Converts an ISO8601 date into a JavaScript date object, honoring the TZ
   * offset and Z if present to convert the date to local time
   * NOTE: I'm using an extra parameter on the date object for this function.
   * I set date.time to true if there is a date, otherwise date.time is false.
   * 
   * @param  string ISO8601 formatted date
   * @return JavaScript date object that represents the ISO date. 
   */
  dateFromISO8601: function dateFromISO8601(string) {
    var dateArray = string.match(/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(?:([-+Z])(?:(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
  
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
    if (dateArray[8]) {
      if (dateArray[8] == "-") {
        if (dateArray[9] && dateArray[10]) {
          date.setHours(date.getHours() + parseInt(dateArray[9], 10));
          date.setMinutes(date.getMinutes() + parseInt(dateArray[10], 10));
        }
      } else if (dateArray[8] == "+") {
        if (dateArray[9] && dateArray[10]) {
          date.setHours(date.getHours() - parseInt(dateArray[9], 10));
          date.setMinutes(date.getMinutes() - parseInt(dateArray[10], 10));
        }
      }
      /* at this point we have the time in gmt */
      /* convert to local if we had a Z - or + */
      if (dateArray[8]) {
        var tzOffset = date.getTimezoneOffset();
        if (tzOffset < 0) {
          date.setMinutes(date.getMinutes() + tzOffset); 
        } else if (tzOffset > 0) {
          date.setMinutes(date.getMinutes() - tzOffset); 
        }
      }
    }
    return date;
  },
  /**
   * Converts a Javascript date object into an ISO 8601 formatted date
   * NOTE: I'm using an extra parameter on the date object for this function.
   * If date.time is NOT true, this function only outputs the date.
   * 
   * @param  date        Javascript Date object
   * @param  punctuation true if the date should have -/:
   * @return string with the ISO date. 
   */
  iso8601FromDate: function iso8601FromDate(date, punctuation) {
    var string = date.getFullYear().toString();
    if (punctuation) {
      string += "-";
    }
    string += (date.getMonth() + 1).toString().replace(/\b(\d)\b/g, '0$1');
    if (punctuation) {
      string += "-";
    }
    string += date.getDate().toString().replace(/\b(\d)\b/g, '0$1');
    if (date.time) {
      string += "T";
      string += date.getHours().toString().replace(/\b(\d)\b/g, '0$1');
      if (punctuation) {
        string += ":";
      }
      string += date.getMinutes().toString().replace(/\b(\d)\b/g, '0$1');
      if (punctuation) {
        string += ":";
      }
      string += date.getSeconds().toString().replace(/\b(\d)\b/g, '0$1');
      if (date.getMilliseconds() > 0) {
        if (punctuation) {
          string += ".";
        }
        string += date.getMilliseconds().toString();
      }
    }
    return string;
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
  /**
   * Not intended for external consumption. Microformat implementations might use it.
   *
   * Retrieve elements matching all classes listed in a space-separated string.
   * I had to implement my own because I need an Array, not an nsIDomNodeList
   * 
   * @param  rootElement      The DOM element at which to start searching (optional)
   * @param  className        A space separated list of classenames
   * @return microformatNodes An array of DOM Nodes, each representing a
                              microformat in the document.
   */
  getElementsByClassName: function(rootNode, className)
  {
    var returnElements = [];

    if ((rootNode.ownerDocument || rootNode).getElementsByClassName) {
    /* Firefox 3 - native getElementsByClassName */
      var col = rootNode.getElementsByClassName(className);
      for (i = 0; i < col.length; i++) {
        returnElements[i] = col[i];
      }
    } else if ((rootNode.ownerDocument || rootNode).evaluate) {
    /* Firefox 2 and below - XPath */
      var xpathExpression;
      xpathExpression = ".//*[contains(concat(' ', @class, ' '), ' " + className + " ')]";
      var xpathResult = (rootNode.ownerDocument || rootNode).evaluate(xpathExpression, rootNode, null, 0, null);

      var node;
      while (node = xpathResult.iterateNext()) {
        returnElements.push(node);
      }
    } else {
    /* Slow fallback for testing */
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
  /**
   * Not intended for external consumption. Microformat implementations might use it.
   *
   * Retrieve elements matching an attribute and an attribute list in a space-separated string.
   * 
   * @param  rootElement      The DOM element at which to start searching (optional)
   * @param  atributeName     The attribute name to match against
   * @param  attributeValues  A space separated list of attribute values
   * @return microformatNodes An array of DOM Nodes, each representing a
                              microformat in the document.
   */
  getElementsByAttribute: function(rootNode, attributeName, attributeValues)
  {
    var attributeList = attributeValues.split(" ");

    var returnElements = [];

    if ((rootNode.ownerDocument || rootNode).evaluate) {
    /* Firefox 3 and below - XPath */
      /* Create an XPath expression based on the attribute list */
      var xpathExpression = ".//*[";
      for (var i = 0; i < attributeList.length; i++) {
        if (i != 0) {
          xpathExpression += " or ";
        }
        xpathExpression += "contains(concat(' ', @" + attributeName + ", ' '), ' " + attributeList[i] + " ')";
      }
      xpathExpression += "]"; 

      var xpathResult = (rootNode.ownerDocument || rootNode).evaluate(xpathExpression, rootNode, null, 0, null);

      var node;
      while (node = xpathResult.iterateNext()) {
        returnElements.push(node);
      }
    } else {
    /* Need Slow fallback for testing */
    }
    return returnElements;
  }
};

Microformats.init();
