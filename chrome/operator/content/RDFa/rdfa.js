/*extern Operator, Components, content */

var RDFa = {
  version: 0.8,
  /* All action specific function are contained in this object */
  actions: {
    /* When an action is added, the name is placed in this list */
    list: [],
    add: function add(action, actionDefinition) {
      if (actionDefinition.version == RDFa.version) {
        RDFa.actions[action] = actionDefinition;
        RDFa.actions.list.push(action);
      }
    },
    __iterator__: function () {
      var i;
      for (i=0; i < this.list.length; i++) {
        yield this.list[i];
      }
    }
  },
  evaluateXPath: function(xpathExpression, rootElement, resultType)
  {
    return (rootElement.ownerDocument || rootElement).
      evaluate(xpathExpression, rootElement, null, resultType || 0, null);
  },
  hasRDF: function(rootElement)
  {
    return (RDFa.evaluateXPath("count(//" + RDFa.xpathExpression + ")", rootElement).numberValue > 0);
  },
  xpathExpression: "*[@about or @property or @instanceof or @datatype]",
  XHTML_VOCAB : 'http://www.w3.org/1999/xhtml/vocab#',
  DEFAULT_NS:  { 
    dc:'http://purl.org/dc/elements/1.1/',
    xhtml:'http://www.w3.org/1999/xhtml',
    cc:'http://web.resource.org/cc/',
    foaf:'http://xmlns.com/foaf/0.1/',
    rdfs:'http://www.w3.org/2000/01/rdf-schema#',
    rdf:'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    xsd :'http://www.w3.org/2001/XMLSchema#'
  },
  ns : {
    rdf : function(name) { return RDFa.DEFAULT_NS.rdf + name; },
    rdfs : function(name) { return RDFa.DEFAULT_NS.rdfs + name; },
    dc : function(name) { return RDFa.DEFAULT_NS.dc + name; },
    foaf : function(name) { return RDFa.DEFAULT_NS.foaf + name; },
    xsd : function(name) { return RDFa.DEFAULT_NS.xsd + name; }
  },
  attributes : [ "about", "content", "datatype", 
    "href", "instanceof", "property", 
    "rel", "resource", "rev", "src"
  ],
  xhtmlrel : [ "alternate","appendix","bookmark","cite",
    "chapter","contents","copyright","glossary",
    "help","icon","index","last",
    "license","meta","next","p3pv1",
    "prev","role","section","subsection",
    "start","stylesheet","up"
  ],
  parse: function(rootElement)
  {
    if(typeof rootElement == 'undefined' || rootElement == null) {
      return null;
    }
 
    var e = rootElement; 
    if(rootElement.nodeType == 9) {
      for(var i = 0; i < rootElement.childNodes.length; i++) {
        if(rootElement.childNodes[i].nodeType == 1) {
          e = rootElement.childNodes[i];
          break;
        }
      }
    }
    var env = RDFa.createInitialEnvironment(e);
    RDFa.processNode(e, env);
    return env.model;
  },
  processNode: function(e, env)
  {
    var context = RDFa.createContext(e, env);

    var attributes = {};

    RDFa.attributes.forEach(function(a) {
      attributes[a] = RDFa.getAttribute(e, a);
    });

    var setNewSubject = function (a) {
      if(attributes[a] != null) {
        var subjects = RDFa.expandURI(attributes[a], env);
        if(subjects.length > 0) {
          context.newSubject = subjects[0][1];
          context.retval = true;
        }
      }
      return context.newSubject == null;
    };
 
    var resourceAttributes = ["about", "src", "resource", "href"];
    var relrev = attributes.rel != null || attributes.rev != null;
    
    if(relrev) {
      resourceAttributes = resourceAttributes.slice(0,2);
    }

    // establish new subject
    if(resourceAttributes.every(setNewSubject)) {
      // No URI provided by a resource attribute
      if(["body","head"].indexOf(e.nodeName) > -1) {
        context.newSubject = RDFa.expandSingleURI('', env);
        context.retval = true;
      } else if(attributes["instanceof"] != null) {
        context.newSubject = RDFa.generateBNodeName(e, env.bnodes); 
      } else if(context.pObject != null) {
        context.newSubject = context.pObject;
        context.retval = true;
        context.skip = !relrev;
      }
    }

    // establish new object
    if(relrev) {
      ["resource","href"].every(function (a) {
        if(attributes[a] != null) {
          var objects = RDFa.expandURI(attributes[a], env);
          if(objects.length > 0) {
            context.currentObject = objects[0][1];
          }
        }
        return context.currentObject == null;
      });
    }

    // let's create some triples
    if(context.newSubject != null) {

      // create type triples
      if(attributes["instanceof"] != null) {
        var types = RDFa.expandURI(attributes["instanceof"], env);   
        for each(type in types) {
          env.model.addResource(context.newSubject, RDFa.ns.rdf("type"), type);
          context.retval = true;
        }
      }
    
      // create resource object triples
      var rels = RDFa.expandURI(attributes.rel, env);
      for each(rel in rels) {
        if(context.currentObject != null) {
          env.model.addResource(context.newSubject, rel, context.currentObject);
          context.retval = true;
        } else {
          context.incomplete.push([rel[1], true]);
        }
      }

      var revs = RDFa.expandURI(attributes.rev, env);
      for each(rev in revs) {
        if(context.currentObject != null) {
          env.model.addResource(context.currentObject, rev, context.newSubject);
          context.retval = true;
        } else {
          context.incomplete.push([rev[1], false]);
        }
      }

      if(context.incomplete.length > 0) {
        context.currentObject = RDFa.generateBNodeName(context.e, env.bnodes);
      }
    }

    // create literal object triples
    if(attributes.property != null) {
      var props = RDFa.expandURI(attributes.property, env);
      for each(prop in props) {
        var datatype = undefined;
        var content = undefined;
        
        if(attributes.datatype != null) {
          attributes.datatype = attributes.datatype.replace(/^\s+|\s+$/,'');
          if(attributes.datatype.length == 0) {
            datatype = "";
          } else {
            datatype = RDFa.expandURI(attributes.datatype, env);
            // What happens if multiple datatypes? ASK
            if(datatype.length > 0) {
              datatype = datatype[0][1];
            }
          }
        }

        var textNodes = [e.childNodes[i] 
          for each(i in RDFa.range(0,e.childNodes.length)) 
          if (e.childNodes[i].nodeType == 3)];

        var nonTextNodes = [e.childNodes[i] 
          for each(i in RDFa.range(0,e.childNodes.length)) 
          if (e.childNodes[i].nodeType != 3)];

        if(attributes.content != null) {
          content = attributes.content; 
        } else if(e.childNodes.length == textNodes.length ||
          (e.childNodes.length > 0 && datatype == '')) {
          content = "";
          textNodes.forEach(function (n) {
            content += n.textContent;
          });
        } else if(e.childNodes.length == 0) {
          content = "";
        } else if(datatype == RDFa.ns.xsd('string')) {
          content = [e.childNodes[i].textContent 
            for each(i in RDFa.range(0,e.childNodes.length))].join("");
        }

        if(content !== undefined) {
          if(typeof datatype == 'undefined' || datatype == '') {
            if(context.lang != null) {
              env.model.addLangLiteral(context.newSubject || context.pSubject, prop, content, context.lang); 
              context.retval = true;
            } else {
              env.model.addLiteral(context.newSubject || context.pSubject, prop, content); 
              context.retval = true;
            }
          } else {
            env.model.addTypedLiteral(context.newSubject || context.pSubject, prop, content, datatype); 
            context.retval = true;
          }
        } else if(nonTextNodes.length > 0 &&
          (attributes.datatype == null || 
            attributes.datatype == RDFa.ns.rdf("XMLLiteral"))) {
          env.model.addTypedLiteral(context.newSubject || context.pSubject, prop, e.innerHTML, RDFa.ns.rdf("XMLLiteral")); 
          context.retval = true;
          context.recurse = false;
        }
      }
    }

    if(context.recurse) {
       var retvals = [RDFa.processNode(e.childNodes[i], env) 
          for each(i in RDFa.range(0,e.childNodes.length)) 
          if (e.childNodes[i].nodeType === 1)];
    }

    // complete
    if(!context.skip || (context.retval ||
       retvals.some(function(retval) { return retval; })) &&
       context.pIncomplete.length > 0) {
      context.pIncomplete.forEach(function (i) {
        if(i[1]) {
          env.model.addResource(context.pSubject, i[0], context.newSubject);
        } else {
          env.model.addResource(context.newSubject, i[0], context.pSubject);
        }
      });
    } 
    env.contexts.pop();

    return context.retval;
  },
  range : function (begin, end) {
    for (let i = begin; i < end; ++i) {
      yield i;
    }
  },
  getAttribute : function(e, name) {
    if(e.attributes != null) {
      if(e.hasAttribute(name)) {
        return e.getAttribute(name);
      }
    }
    return null;
  },
  expandSingleURI: function(value, env) {
    var uris = RDFa.expandURI(value, env);
    if(uris != null && uris.length > 0) {
      return uris[0][1];
    }
    return null;
  },
  expandURI: function(value, env) {
    if(value == null) {
      return [];
    }

    var context = env.contexts[env.contexts.length-1];

    // empty URI, resolve e.g. @about=''
    if(value.length == 0) {
        return [[null, RDFa.resolveURL(value, context.base)]];
    }

    var expanded = [];

    for each(uri in value.split(/\s+/)) {
      // strip []
      if(uri[0] == "[" && uri[uri.length-1] == "]") {
        uri = uri.substr(1,uri.length-2);
        if(uri.length === 0) {
          // generate bnode
          uri = RDFa.generateBNodeName(context.e, env.bnodes);
        }
      }     

      // if bnode, we're done, no more expanding
      if(uri.indexOf("_:") === 0) {
        expanded.push([null, uri]);
        continue;
      }

      var prefix = uri.split(":",2);
      // no ':', let's resolve it to a local property
      if(prefix.length == 1) { 
        if(RDFa.xhtmlrel.indexOf(prefix[0]) > -1) {
          expanded.push([RDFa.XHTML_VOCAB, RDFa.XHTML_VOCAB + prefix[0]]);
        } else {
          expanded.push([null, RDFa.resolveURL(prefix[0], context.base)]);
        }
        continue;
      } else if(prefix.length == 2 && uri.indexOf(":") == 0) {
        expanded.push([RDFa.XHTML_VOCAB, RDFa.XHTML_VOCAB + prefix[1]]);
        continue;
      }

      with(env) {
        var found = false;
        for(var i = contexts.length-1; i >= 0 && !found; i--) {
          if(contexts[i].uriMap[prefix[0]]) {
            expanded.push([contexts[i].uriMap[prefix[0]], contexts[i].uriMap[prefix[0]] + prefix[1]]);
            found = true;
          } 
        }  
        if(found) {
          continue;
        }
      }

      // for sake of being practical
      if(RDFa.DEFAULT_NS[prefix[0]]) {
        expanded.push([RDFa.DEFAULT_NS[prefix[0]], RDFa.DEFAULT_NS[prefix[0]] + prefix[1]]);
        continue;
      }

      // most likely http://
      expanded.push([null, value]);
    }

    return expanded;
    
  },
  resolveURL: function(relURL, baseURL) {
    try {
      var base = Components.classes["@mozilla.org/network/standard-url;1"].createInstance();
      base = base.QueryInterface(Components.interfaces.nsIURL);
      base.spec = baseURL;
      return base.resolve(relURL);
    } catch(e) {
      return relURL;
    }
  },
  getDocumentBase: function(e)
  {
    var doc = e.nodeType == 9 ? e : e.ownerDocument;
    var href = doc.location.href;
    var bases = doc.getElementsByTagName("base");
    if(bases.length > 0) {
        // what should we do in case of multiple BASE ASK
        var base = bases[0];
        if(base.hasAttribute("href")) {
            // TODO: make sure this url is absolute
             href = base.getAttribute("href");
        }
    }
    return href;
  },
  createInitialEnvironment: function(e)
  {
    var env = { 
      model : new RDFa.Model(), 
      bnodes : { nodes:[], names:[], counter:[] },
      contexts : []
    };

    return env;
  },
  createContext: function(e, env)
  {
    var base = RDFa.getDocumentBase(e);

    var context = {
      base : base,
      pSubject : base,
      pObject : null,
      pIncomplete : [],

      /* local */
      e : e,
      uriMap : {},
      retval : false,
      lang : null,
      recurse : true,
      incomplete : [],
      skip : false,
      newSubject : null,
      currentObject : null,
    }; 

    if(env.contexts.length > 0) {
      var previous = env.contexts[env.contexts.length-1];
      if(previous.skip) {
        ["base","pSubject","pObject","pIncomplete"].forEach(function(prop) {
          context[prop] = previous[prop];
        });
      } else {
        if(previous.newSubject != null) {
          context.pSubject = previous.newSubject;
        } else if(previous.pSubject != null) {
          context.pSubject = previous.pSubject;
        }
        
        if(previous.currentObject != null) {
          context.pObject = previous.currentObject;
        } else if(previous.newSubject != null) {
          context.pObject = previous.newSubject;
        } else {
          context.pObject = previous.pSubject;
        }

        if(previous.incomplete.length > 0) {
          context.pIncomplete = previous.incomplete;
        }
      }
    }

    env.contexts.push(context);

    if(e.attributes != null) {
      // URI Mappings 
      for(var i = 0; i < e.attributes.length; i++) {
        var attrib = e.attributes.item(i);
        if(attrib.nodeName.indexOf("xmlns:") === 0) {
          // TODO: verify that is not empty
          context.uriMap[attrib.nodeName.substr(6)] = e.getAttribute(attrib.nodeName);
        } else if(attrib.nodeName == "xml:lang") {
          // TODO: verify that is not empty or even a valid lang
          context.lang = e.getAttribute("xml:lang");
        }
      }
    }

    return context;
  },
  generateBNodeName: function(e, bnodes)
  {
    var foundNode = bnodes.nodes.indexOf(e);
    if(foundNode > -1) { return bnodes.names[foundNode]; }
    
    var name = e.nodeName.toLowerCase();
    var nodeIndex = bnodes.nodes.push(e);
    nodeIndex--;
    bnodes.counter[name] = bnodes.counter[name] === undefined ? 0 : bnodes.counter[name] + 1;
    bnodes.names[nodeIndex] = "_:" + name + bnodes.counter[name];
    return bnodes.names[nodeIndex]; 
    
  }
};

RDFa.Resource = function(_s, _model) {
  var model = _model;
  var s = _s;

  this.toString = function() {
    return model.$uris[s];
  };
  this.isBlank = function() {
    return model.$uris[s].indexOf("_:") === 0;
  };
  this.prettyPrint = function() {
    if (this.isBlank()) {
      return this.toString();
    } else {
      return "<" + this.toString() + ">";
    }
  };
  this.equals = function(obj) {
    try {
      if(obj.$url !== undefined) {
         if(obj.$model === obj.$model && obj.$index == s) {
           return true; 
         }
      }
    } catch(e) {
        // ignore
    }
    return false;
  };
  this.__defineGetter__("$url", function() { return model.$uris[s]; });
  this.__defineGetter__("$model", function() { return model; });
  this.__defineGetter__("$index", function() { return s; });
};

RDFa.Literal = function(_value, _type, _lang, _model) {
  var model = _model;
  var value = _value;
  var type = _type;
  var lang = _lang;

  this.toString = function() {
    return model.literals[value];
  };
  this.prettyPrint = function() {
    if(this.$type != null) {
      return "\"" + this.toString() + "\"" + "^^" + new RDFa.Resource(type, model).prettyPrint();
    } else if (this.$lang != null) {
      return "\"" + this.toString() + "\"" + "@" + lang;
    } else {
      return "\"" + this.toString() + "\"";
    }
  };
  this.equals = function(obj) {
    try {
      if(obj.$value !== undefined) {
         if(obj.$model === obj.$model && obj.$index == value) {
           return true; 
         }
      }
    } catch(e) {
        // ignore
    }
    return false;
  };
  this.__defineGetter__("$value", function() { return model.literals[value]; });
  this.__defineGetter__("$model", function() { return model; });
  this.__defineGetter__("$index", function() { return value; });
  this.__defineGetter__("$type", function() { return type ? model.$uris[type] : null; });
  this.__defineGetter__("$lang", function() { return lang; });
};

RDFa.Model = function() {

  var triples = [];
  var subjects = {};
  var properties = {};
  var objects = {};
  var namespaces = {};
  var uris_map = {};
  var uris_arr = [];
  var uris_ns = {};
  var literals_map = {};
  var literals_arr = [];

  this.__defineGetter__("triples", function() { return triples; });
  this.__defineGetter__("subjects", function() { return this.getSubjects(); });
  this.__defineGetter__("$uris", function() { return uris_arr; });
  this.__defineGetter__("literals", function() { return literals_arr; });
  this.__defineGetter__("$uris_ns", function() { return uris_ns; });
  this.__defineGetter__("$uris_map", function() { return uris_map; });
  this.__defineGetter__("$objects", function() { return objects; });
  this.__defineGetter__("$properties", function() { return properties; });
  this.__defineGetter__("namespaces", function() { return namespaces; });
  this.setNamespace = function(prefix, url) {
    namespaces[prefix] = url;
  };
  this.getUriNs = function(uri) {
    if(uris_map[uri] !== undefined) {
      uri = uris_map[uri];
    } 

    if(uris_ns[uri] !== undefined) {
      return uris_arr[uris_ns[uri]];
    }
    return null;
  };
  this.indexURI = function(uri) {
    if(uri && uri !== undefined && typeof(uri) == 'object' && uri.length && uri.length == 2) {
      var u = this.indexURI(uri[1]);
      if(uri[0] !== undefined) {
        uris_ns[u] = this.indexURI(uri[0]);  
      }
      return u;
    } else {
      if(uris_map[uri] === undefined) {
        uris_map[uri] = uris_arr.push(uri) - 1;
      }
      return uris_map[uri];
    }
  };
  this.indexLiteral = function(literal) {
    if(literals_map[literal] === undefined) {
      literals_map[literal] = literals_arr.push(literal) - 1;
    }
    return literals_map[literal];
  };
  this.addLiteral = function(s, p, o) {
    this.add(this.createResource(s),this.createResource(p),this.createLiteral(o));
  };
  this.addTypedLiteral = function(s, p, o, t) {
    this.add(this.createResource(s),this.createResource(p),this.createLiteral(o,t));
  };
  this.addLangLiteral = function(s, p, o, l) {
    this.add(this.createResource(s),this.createResource(p),this.createLiteral(o,null,l));
  };
  this.addResource = function(s, p, o) {
    this.add(this.createResource(s),this.createResource(p),this.createResource(o));
  };
  this.add = function(s, p, o) {
    if(subjects[s.$index] === undefined) {
      subjects[s.$index] = {};
    }
    if(subjects[s.$index][p.$index] === undefined) {
      subjects[s.$index][p.$index] = [];
    }
    var existing = subjects[s.$index][p.$index];

    for(var i = 0; i < existing.length; i++) {
        if(triples[existing[i]][2].equals(o)) {
            return;
        }
    } 
    var index = triples.push([s.$index,p.$index,o]);
    subjects[s.$index][p.$index].push(index-1);

    if(properties[p.$index] === undefined) {
      properties[p.$index] = [];
    }
    properties[p.$index].push(index-1);

    if(o.$url) {
      if(objects[o.$index] === undefined) {
        objects[o.$index] = [];
      }
      objects[o.$index].push(index-1);
    }
  };
  this.getObject = function(s) {
    if(uris_map[s] !== undefined) {
      s = uris_map[s];
    }
    if(subjects[s] === undefined) {
      return null;
    }
    return new RDFa.SemanticObject(this, s);
  };
  this.getObjectsWithProperty = function(p, ns) {
    if(uris_map[p] !== undefined) {
      p = uris_map[p];
    }
    if(properties[p] !== undefined) {
      var objects = [];
      var ts = properties[p];
      for(var x = 0; x < ts.length; x++) {
        var sub = triples[ts[x]][0];
        var newObj = new RDFa.SemanticObject(this, uris_arr[sub]);
        if(ns !== undefined) {
          if(typeof(ns) == 'string') {
            newObj.setDefaultNS(ns);
          }
        }
        objects.push(newObj); 
      }
      return objects;
    }
    return [];
  };
  this.getObjects = function() {
    var objects = [];
    for(var i in subjects) { 
      if(uris_arr[i].indexOf("_:") === 0) { continue; }
      var newObj = new RDFa.SemanticObject(this, uris_arr[i]);
      objects.push(newObj); 
    } 
    return objects;
  };
  this.getProperty = function(s, p) {
    if(uris_map[s] !== undefined) {
      s = uris_map[s];
    }
    if(uris_map[p] !== undefined) {
      p = uris_map[p];
    }
    if(subjects[s] !== undefined && subjects[s][p] !== undefined) {
      var props = [];
      var ts = subjects[s][p];
      for(var x = 0; x < ts.length; x++) {
        props.push(triples[ts[x]][2]);
      }
      return props;
    }
    return [];
  };
  this.enumProperties = function(s) {
    if(uris_map[s] !== undefined) {
      s = uris_map[s];
    }
    if(subjects[s] !== undefined && subjects) {
      var props = [];
      var ts = subjects[s];
      for(var x in ts) {
        props.push(new RDFa.Resource(x, this));
      }
      return props;
    }
    return [];
  };
  this.getSubjects = function() {
    var results = [];
    for(var i in subjects) { 
      if(uris_arr[i].indexOf("_:") === 0) { continue; }
      results.push(uris_arr[i]);
    } 
    return results;
  };
  this.hasSubject = function(r) {
    if(uris_map[r] !== undefined) {
      if(subjects[uris_map[r]] !== undefined) {
        return true;
      }
    }
    return false;
  };
  this.createResource = function(s) {
    var index = this.indexURI(s);
    return new RDFa.Resource(index, this);
  };
  this.createLiteral = function(l,t,lang) {
    var index = this.indexLiteral(l);
    var tindex = (t !== undefined) ? this.indexURI(t) : null;
    return new RDFa.Literal(index, tindex, lang, this);
  };
  this.dumpTriples = function() {
    var ntriples = "";
    for each(t in triples) {
      ntriples += new RDFa.Resource(t[0], this).prettyPrint() +
         " " + new RDFa.Resource(t[1], this).prettyPrint() +
         " " + t[2].prettyPrint() + " .\n";
    }
    return ntriples;
  };
  this.dump = function() {
    var turtle = "";
    for(var prefix in namespaces) {
      if(prefix != '_default_') {
        turtle += "@prefix " + prefix + ": " + "<" + namespaces[prefix] + "> .\n"
      }
    }

    if(namespaces['_default_'] !== undefined) {
      turtle += "@prefix : " + "<" + namespaces['_default_'] + "> .\n"
    }

    if (turtle.length > 0) turtle += "\n";

    var inverted_ns = {};
    for(var prefix in namespaces) {
        inverted_ns[namespaces[prefix]] = prefix;
    }

    var context = { seen : [] , subjects : [], suppress : false };

    for(var s in subjects) { 
      context.subjects.push(s);
    } 

    while(context.subjects.length > 0) {
      turtle += this.dumpSubject(context.subjects[0], 1, context);
    }

    return turtle;
  };
  this.debug = this.dump;

  this.dumpSubject = function (s, depth, context, anon) {
    if(depth === undefined) {
        depth = 0;
    }
    if(typeof uris_map[s] != 'undefined') {
      s = uris_map[s];
    }
    if(context === undefined) {
      context = { seen : [], subjects : [] };
    }
    if(context.seen[s] !== undefined) {
      throw new RDFa.Exceptions.CycleDetected("A cycle has been detected in the graph");
    }
    if(typeof uris_arr[s] != 'undefined' && uris_arr[s].indexOf("_:") === 0) {
      anon = true;
    } else if(typeof anon == 'undefined') {
      anon = false;
    }

    context.seen[s] = true;

    var turtle = !anon ? "<" + uris_arr[s] + ">\n" : "";
    var props = this.enumProperties(uris_arr[s]);
    for(var p = 0; p < props.length; p++) {
      var prop_name = this.prettyURI(props[p].$url);
      var values = this.getProperty(uris_arr[s],props[p].$url);
      for(var v = 0; v < values.length; v++) {
          turtle += RDFa.Utilities.string_repeat(" ", depth * 2);
          if(values[v].$url) {
            if(values[v].$url.indexOf("_:") === 0 
                && objects[values[v].$index].length == 1 
                && triples[objects[values[v].$index]][0] == s) {
              try {
                var innerTurtle = this.dumpSubject(values[v].$url, depth+1, context, true);
                turtle += prop_name + " [ \n" + innerTurtle + "\n" + RDFa.Utilities.string_repeat(" ", depth * 2) + "]";
              } catch(e) {
                if(e.type && e.type == "CycleDetected") {
                  turtle += prop_name + " " + values[v].$url;                  
                }
              }
            } else {
              turtle += prop_name + " " + this.prettyURI(values[v].$url);
            }
          } else {
              var append = "";
              if(values[v].$type !== undefined && values[v].$type != null) {
                 append += "^^" + this.prettyURI(values[v].$type);
              } else if(values[v].$lang !== undefined && values[v].$lang != null) {
                 append += "@" + values[v].$lang;
              } 
              turtle += prop_name + " \"" + values[v].toString() + "\"" + append;
          }
          if((p == props.length -1) && (v == values.length -1)) {
            if(!anon) {
              turtle += " .\n\n";
            }
          } else {
            turtle += " ;\n";
          }
      }
    }
    for(var xx = 0; xx < context.subjects.length; xx++) {
      if(context.subjects[xx] == s) {
        context.subjects.splice(xx, 1);
      }
    }
    return turtle;
  };
  this.prettyURI = function(uri) {

      var prefix_found = undefined;
      var prefix_ns = undefined;
      for(var prefix in namespaces) {
          if(uri.indexOf(namespaces[prefix]) == 0) {
              prefix_found = prefix;
              prefix_ns = namespaces[prefix];
              break;
          }
      }

      if(prefix_found === undefined) {
        /*
        for(var prefix in RDFa.DEFAULT_NS) {
            if(uri.indexOf(RDFa.DEFAULT_NS[prefix]) == 0) {
                prefix_found = prefix;
                prefix_ns = RDFa.DEFAULT_NS[prefix];
                break;
            }
        }
        */
      }

      var prefixed = "<" + uri + ">";
      if(prefix_found !== undefined) {
          prefixed = (prefix_found != '_default_') ? prefix_found : "";
          prefixed += ":" + uri.substring(prefix_ns.length);
      }
      return prefixed;
  };
};

RDFa.SemanticProperty = function (_prop, _name, _parent) {
  var prop = _prop;
  var pname = _name;
  var parent = _parent;
  var subproperties = [];
  var _this = this;

  this.model = parent.model;

  init();

  function init() {
    var results = _this.model.getProperty(parent.subject, prop);
    for(var r in results) {
      if(results[r].$url !== undefined && _this.model.hasSubject(results[r].$url)) {
        var child = new RDFa.SemanticObject(_this.model, results[r].$url);
        child.namespaces = parent.namespaces;
        RDFa.Utilities.rebind.apply(child, [child.subject]);
        subproperties.push(child); 
      } else {
        subproperties.push(results[r]); 
      }
    }
  }

  function first() {
    return (subproperties.length > 0) ? subproperties[0] : null;
  }
  function all() {
    return subproperties;
  }
  function hasMore() {
    return (subproperties.length > 1);
  }
  function namespace() {
    return _this.model.getUriNs(prop);
  }
  this.toString = function() {
    return first() ? first().toString() : "null";
  };
  this.__defineGetter__("$first", first);
  this.__defineGetter__("$all", all);
  this.__defineGetter__("$hasMore", hasMore);
  this.__defineGetter__("$ns", namespace);
};

RDFa.SemanticObject = function (_model, _subject) {
  var _this = this;
  var nslist = null;

  this.namespaces = {};
  this.model = _model;
  var model = _model;
  this.subject = _subject;
  var subject = _subject;

  if(!this.model.hasSubject(this.subject)) {
    throw new Error("Invalid subject passed to constructor.");
  }

  this.getNamespaceList = function() {
    var props = this.model.enumProperties(this.subject);
    var ns_stats = {};
    for(var j = 0; j < props.length; j++) {
      var ns = this.model.getUriNs(props[j]); 
      ns_stats[ns] = 1;
    }
    var nslist = [];
    for(ns in ns_stats) {
      nslist.push(ns);
    }
    return nslist;
  };
  this.setDefaultNS = function(_ns) {
    this.namespaces['_default_'] = _ns;
    RDFa.Utilities.rebind.apply(this, [this.subject]);
  };
  this.addNS = function(prefix, _ns) {
    this.namespaces[prefix] = _ns;
    RDFa.Utilities.rebind.apply(this, [this.subject]);
  };
  this.toString = function() {

    var objects  = this.model.getProperty(this.subject, RDFa.ns.rdfs("label"));

    if(objects === undefined || objects.length === 0) {
      objects = this.model.getProperty(this.subject, RDFa.ns.dc("title"));
    }

    if(objects !== undefined && objects.length > 0) {
      return objects[0].toString();
    } else {
      return this.subject;
    }
 
    return this.subject;
  };
  this.dump = function() {
    return this.model.dumpSubject(_subject,1);
  }
  this.debug = this.dump;
  this.__defineGetter__("$model", function() { return model; });
  this.__defineGetter__("$subject", function() { return subject; });
};

RDFa.Utilities = {
  log : function() {
    if (console) console.log.apply(null, arguments);
  },
  debug : function() {
    if (console) console.debug.apply(null, arguments);
  },
  warn : function() {
    if (console) console.warn.apply(null, arguments);
  },
  info : function() {
    if (console) console.info.apply(null, arguments);
  },
  string_repeat : function(str, n) {
   var s = "";
   while (--n >= 0) s += str;
   return s
  },
  getter : function (obj) { 
    return function() {
        return obj;
    };
  },
  nullGetter : function () {
    return null;
  },
  rebind : function(subject) {
    for(var p in this.namespaces) {
        var base = '';
        if(p != '_default_') {
            base = p + "_";
        }
        var props = this.model.enumProperties(subject);
        for(var i = 0; i < props.length; i++) {
          var u = props[i].$url;
          if(u.indexOf(this.namespaces[p]) !== 0) {
            continue;
          }
          var name = base + u.substring(this.namespaces[p].length);
          var objects  = this.model.getProperty(subject, u);
          var all_objects = true;
          for(var o in objects) {
            if(objects[o].$url !== undefined) {
              if(this.model.hasSubject(objects[o].$url)) {
                continue;
              }
            }
            all_objects = false;
            break;
          }
          if(all_objects) {
            var child = new RDFa.SemanticObject(this.model, objects[0].$url);
            child.namespaces = this.namespaces;
            RDFa.Utilities.rebind.apply(child, [child.subject]);
            this.__defineGetter__(name, RDFa.Utilities.getter(child));
          } else {
            this.__defineGetter__(name, RDFa.Utilities.getter(new RDFa.SemanticProperty(u, name, this)));
          }
        }
    }
  }
};

RDFa.Exceptions = {
  CycleDetected: function(msg) {
    this.msg = msg;    
    this.type = "CycleDetected";
  } 
};

RDFa.TestSuite = {
  ns : {
    foaf : function(name) { return "http://xmlns.com/foaf/0.1/" + name; },
    rdf : function(name) { return "http://www.w3.org/1999/02/22-rdf-syntax-ns#" + name; },
    dc : function(name) { return "http://purl.org/dc/elements/1.1/" + name; }
  }, 
  run : function() {
    for(var i = 0; i < RDFa.TestSuite.tests.length; i++) {
        if(typeof(RDFa.TestSuite.tests[i]) == 'function') {
          RDFa.TestSuite.tests[i].apply(RDFa.TestSuite);
        }
    }
    alert("Success!");
  },
  assert : function(expr, msg) {
    if(expr !== undefined && !expr) {
        throw new Error(msg || "test failed");
    }
  },
  assertTrue : function(expected, result) {
    if(expected != result) {
        throw new Error("Expected: " + expected + ", and found: " + result);
    }
  },
  tests : [
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var s2 = "http://www.w3.org/People/djweitzner/foaf#DJW";
        var s3 = "http://www.w3.org/People/Berners-Lee/card#i";
        var s4 = "http://www.w3.org/People/EM/contact#me";
        var b1 = "_:div0";
        var b2 = "_:span0";

        model.addResource(s1, ns.rdf("type"), ns.foaf("Person"));
        model.addLiteral(s1, ns.foaf("givenname"), "Ben");
        model.addLiteral(s1, ns.foaf("family_name"), "Adida");
        model.addLiteral(s1, ns.foaf("nick"), "Ben");

        model.addResource(s1, ns.foaf("knows"), s2);
        model.addResource(s1, ns.foaf("knows"), s3);
        model.addResource(s1, ns.foaf("knows"), s4);

        model.addResource(s1, ns.foaf("office"), b1);
        model.addResource(b1, ns.foaf("address"), b2);

        model.addLiteral(b2, ns.foaf("street"), "32 Vassar Street");
        model.addLiteral(b2, ns.foaf("street2"), "MIT CSAIL Room 32G-694");
        model.addLiteral(b2, ns.foaf("city"), "Cambridge");
        model.addLiteral(b2, ns.foaf("postalCode"), "02139");
        model.addLiteral(b2, ns.foaf("country"), "USA");

        this.assert(model.subjects.length == 1, "model should have 1 subject.");
        
        var x = model.subjects[0];
        this.assertTrue(x, s1); 

        this.assert(model.hasSubject(b1));
        this.assert(model.hasSubject(b2));
        this.assert(!model.hasSubject(s2));
        this.assert(!model.hasSubject(s3));
        this.assert(!model.hasSubject(s4));

        var props = model.enumProperties(x);
        this.assertTrue(6, props.length); 

        var props = model.getProperty(x,ns.foaf("knows"));
        this.assertTrue(3, props.length); 

        var y = new RDFa.SemanticObject(model, x);
        y.setDefaultNS("http://xmlns.com/foaf/0.1/");

        this.assertTrue("32 Vassar Street", y.office.address.street.toString());
        this.assertTrue("MIT CSAIL Room 32G-694", y.office.address.street2.toString());
        this.assertTrue("Cambridge", y.office.address.city.toString());
        this.assertTrue("USA", y.office.address.country.toString());
        this.assertTrue("02139", y.office.address.postalCode.toString());
        
        this.assertTrue(3, y.knows.$all.length);
        this.assertTrue(s2, y.knows.$all[0].toString());
        this.assertTrue(s3, y.knows.$all[1].toString());
        this.assertTrue(s4, y.knows.$all[2].toString());
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var s2 = "http://www.w3.org/People/djweitzner/foaf#DJW";
        var s3 = "http://www.w3.org/People/Berners-Lee/card#i";
        var s4 = "http://www.w3.org/People/EM/contact#me";
        var b1 = "_:div0";
        var b2 = "_:span0";
        var b3 = "_:div1";

        model.addResource(s1, ns.rdf("type"), ns.foaf("Person"));
        model.addLiteral(s1, ns.foaf("givenname"), "Ben");
        model.addLiteral(s1, ns.foaf("family_name"), "Adida");
        model.addLiteral(s1, ns.foaf("nick"), "Ben");

        model.addResource(s1, ns.foaf("knows"), s2);
        model.addResource(s1, ns.foaf("knows"), s3);
        model.addResource(s1, ns.foaf("knows"), s4);

        model.addResource(s1, ns.foaf("office"), b1);
        model.addResource(b1, ns.foaf("address"), b2);

        model.addLiteral(b2, ns.foaf("street"), "32 Vassar Street");
        model.addLiteral(b2, ns.foaf("country"), "USA");

        model.addResource(s1, ns.foaf("met"), s2);
        model.addResource(s1, ns.foaf("met"), s3);
        model.addResource(s1, ns.foaf("met"), s4);
        
        model.setNamespace("foaf", ns.foaf(""));
        
        model.dump();
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var s2 = "http://www.w3.org/People/djweitzner/foaf#DJW";
        var s3 = "http://www.w3.org/People/Berners-Lee/card#i";
        var s4 = "http://www.w3.org/People/EM/contact#me";
        var b1 = "_:div0";
        var b2 = "_:span0";
        var b3 = "_:div1";

        model.addResource(s1, ns.rdf("type"), ns.foaf("Person"));
        model.addLiteral(s1, ns.foaf("givenname"), "Ben");
        model.addLiteral(s1, ns.foaf("family_name"), "Adida");
        model.addLiteral(s1, ns.foaf("nick"), "Ben");

        model.addResource(s1, ns.foaf("knows"), s2);
        model.addResource(s1, ns.foaf("knows"), s3);
        model.addResource(s1, ns.foaf("knows"), s4);

        model.addResource(s1, ns.foaf("office2"), b1);
        model.addResource(s1, ns.foaf("office"), b1);
        model.addResource(b1, ns.foaf("address"), b2);

        model.addLiteral(b2, ns.foaf("street"), "32 Vassar Street");
        model.addLiteral(b2, ns.foaf("country"), "USA");

        model.addResource(s1, ns.foaf("met"), s2);
        model.addResource(s1, ns.foaf("met"), s3);
        model.addResource(s1, ns.foaf("met"), s4);
        
        model.setNamespace("foaf", ns.foaf(""));
        
        model.dump();
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";

        model.addLiteral(s1, ns.foaf("givenname"), "Ben");
        model.addLiteral(s1, ns.foaf("nick"), "Elias");

        var x = model.subjects[0];
        var props1 = model.getProperty(x, ns.foaf("givenname"));
        var props2 = model.getProperty(x, ns.foaf("nick"));
        var props3 = model.getProperty(x, ns.foaf("givenname"));
        
        this.assert(props1[0].equals(props3[0]));
        this.assert(!props1[0].equals(props2[0]));
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var s2 = "http://www.w3.org/People/djweitzner/foaf#DJW";
        var s3 = "http://www.w3.org/People/Berners-Lee/card#i";
        var s4 = "http://www.w3.org/People/EM/contact#me";
        var b1 = "_:div0";
        var b2 = "_:span0";
        var b3 = "_:div1";

        model.addResource(s1, ns.rdf("type"), ns.foaf("Person"));
        model.addResource(s1, ns.foaf("office2"), b1);
        model.addResource(s1, ns.foaf("office"), b1);
        model.addResource(b1, ns.foaf("address"), b2);
        model.addResource(b2, ns.foaf("address"), b1);
        
        model.setNamespace("foaf", ns.foaf(""));
        
        model.dump();
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var s2 = "http://www.w3.org/People/djweitzner/foaf#DJW";
        var s3 = "http://www.w3.org/People/Berners-Lee/card#i";
        var s4 = "http://www.w3.org/People/EM/contact#me";
        var b1 = "_:div0";
        var b2 = "_:span0";
        var b3 = "_:div1";

        model.addResource(s1, ns.rdf("type"), ns.foaf("Person"));
        model.addResource(s1, ns.foaf("office2"), b1);
        model.addResource(s1, ns.foaf("office"), b1);
        model.addResource(b1, ns.foaf("address"), b2);
        model.addResource(b2, ns.foaf("address"), b1);
        
        model.setNamespace("_default_", ns.foaf(""));
        
        model.dump();
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var s2 = "http://www.w3.org/People/djweitzner/foaf#DJW";
        var s3 = "http://www.w3.org/People/Berners-Lee/card#i";
        var s4 = "http://www.w3.org/People/EM/contact#me";
        var b1 = "_:div0";
        var b2 = "_:span0";

        model.addResource(s1, ns.rdf("type"), ns.foaf("Person"));
        model.addLiteral(s1, ns.foaf("givenname"), "Ben");
        model.addLiteral(s1, ns.foaf("family_name"), "Adida");
        model.addLiteral(s1, ns.foaf("nick"), "Ben");
        model.addLiteral(s1, "http://example.org/ns/foo", "Ben");

        model.addResource(s1, ns.foaf("knows"), s2);
        model.addResource(s1, ns.foaf("knows"), s3);
        model.addResource(s1, ns.foaf("knows"), s4);

        model.addResource(s1, ns.foaf("office"), b1);
        model.addResource(b1, ns.foaf("address"), b2);

        model.addLiteral(b2, ns.foaf("street"), "32 Vassar Street");
        model.addLiteral(b2, ns.foaf("street2"), "MIT CSAIL Room 32G-694");
        model.addLiteral(b2, ns.foaf("city"), "Cambridge");
        model.addLiteral(b2, ns.foaf("postalCode"), "02139");
        model.addLiteral(b2, ns.foaf("country"), "USA");

        model.setNamespace("_default_", ns.foaf(""));
        
        var x = model.subjects[0];
        var y = new RDFa.SemanticObject(model, x);
        y.dump();
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var b1 = "_:div0";
        var b2 = "_:span0";

        model.addLiteral(s1, ns.foaf("knows"), "Lee");
        model.addResource(s1, ns.foaf("knows"), b1);

        model.addResource(b1, ns.foaf("knows"), "Elias");

        var x = model.subjects[0];
        var y = new RDFa.SemanticObject(model, x);
        y.setDefaultNS("http://xmlns.com/foaf/0.1/");

        this.assertTrue(2, y.knows.$all.length);
        this.assertTrue("Lee", y.knows.$all[0].toString());
        this.assertTrue(b1, y.knows.$all[1].toString());
        this.assertTrue("Elias", y.knows.$all[1].knows.toString());
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var s2 = "http://example.org/card.xhtml#you";
        var s3 = "http://example.org/card.xhtml#her";

        model.addLiteral(s1, ns.foaf("knows"), "Lee");
        model.addResource(s2, ns.foaf("knows"), "Whatever");

        var objects = model.getObjectsWithProperty(ns.foaf("knows"));

        this.assertTrue(2, objects.length);
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var s2 = "http://example.org/card.xhtml#you";
        var s3 = "http://example.org/card.xhtml#her";

        model.addLiteral(s1, ns.foaf("knows"), "Lee");
        model.addResource(s2, ns.foaf("knows"), "Whatever");

        var objects = model.getObjectsWithProperty(ns.foaf("knows"), ns.foaf(""));

        this.assertTrue(2, objects.length);
        for(var i = 0; i < objects.length; i++) {
            this.assert(objects[i].knows, "missing foaf:knows property, default NS did not work");
        }

    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var b1 = "_:div0";

        model.addResource(s1, ns.foaf("knows"), b1);
        model.addResource(s1, ns.foaf("knows"), b1);
        model.addResource(s1, ns.foaf("knows"), b1);
    
        this.assertTrue(1, model.triples.length);
    },
    function() {
        var ns = RDFa.TestSuite.ns;

        if(document && document.location.href.indexOf("rdfa-test.html") == -1) return;
        
        var model = RDFa.parse(document);

        RDFa.Utilities.log(model.dump());
    },
    function() {
        var ns = RDFa.TestSuite.ns;
        var model = new RDFa.Model();
        var s1 = "http://example.org/card.xhtml#i";
        var b1 = "_:div0";
        var b2 = "_:span0";

        model.addResource(s1, ns.foaf("knows"), b1);
        model.addResource(b1, ns.foaf("knows"), s1);

        /*
        // for now recursion doesn't work. :(

        var x = model.subjects[0];
        var y = new RDFa.SemanticObject(model, x);
        y.setDefaultNS("http://xmlns.com/foaf/0.1/");

        this.assertTrue(1, y.knows.$all.length);
        */
    }
  ]
};


