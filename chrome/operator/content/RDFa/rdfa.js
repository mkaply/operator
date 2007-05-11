/*extern Operator, Components, content */

var RDFa = {
  xpathExpression: "*[contains(@rel,':') or contains(@rev,':') or @property or contains(@class,':')]",
  DEFAULT_NS:  { 
    dc:'http://purl.org/dc/elements/1.1/',
    xhtml:'http://www.w3.org/1999/xhtml',
    cc:'http://web.resource.org/cc/',
    foaf:'http://xmlns.com/foaf/0.1/',
    rdfs:'http://www.w3.org/2000/01/rdf-schema#',
    rdf:'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
  },
  ns : {
    rdf : function(name) { return RDFa.DEFAULT_NS.rdf + name },
    rdfs : function(name) { return RDFa.DEFAULT_NS.rdfs + name },
    dc : function(name) { return RDFa.DEFAULT_NS.dc + name },
  },
  parse: function(rootElement)
  {
    var bnodes = {nodes:[], counter:[]};
    var model = new RDFa.Model();

    if(!RDFa.hasRDFa(rootElement)) 
      return;

    var ctx = [RDFa.createContext(rootElement.documentElement || rootElement.ownerDocument.documentElement)];

    var xpathResult = RDFa.evaluateXPath("//" + RDFa.xpathExpression, rootElement, 5);

    var node = xpathResult.iterateNext();

    while(node) {
    
      while(ctx.length > 0 && !RDFa.isAncestor(ctx[ctx.length-1].e, node))
        ctx.pop(-1);
    
      ctx.push(RDFa.createContext(node, ctx[ctx.length-1], bnodes));

      if(node.hasAttribute("property")) {
        var properties = node.getAttribute("property").split(" ");
        for(var p = 0; p < properties.length; p++) {
          var expandedProperty = RDFa.expandURI(properties[p],ctx);
          model.addLiteral(ctx[ctx.length-1].about,expandedProperty,node.innerHTML);
        }
      }

      if(node.hasAttribute("rel")) {
        var rels = node.getAttribute("rel").split(" ");
        for(var r = 0; r < rels.length; r++) {
          var rel = RDFa.expandURI(rels[r], ctx);
          if(node.hasAttribute("href")) {
            model.addResource(ctx[ctx.length-1].about,rel,node.getAttribute("href"));
          } else {
            model.addResource(ctx[ctx.length-2].about,rel,ctx[ctx.length-1].about);
          }
        }
        
      }

      if(node.hasAttribute("rev") && node.hasAttribute("href")) {
        var revs = node.getAttribute("rev").split(" ");
        for(var r = 0; r < rels.length; r++) {
          var rev = RDFa.expandURI(revs[r], ctx);
          model.addResource(node.getAttribute("href"),rev,ctx[ctx.length-1].about);
        }
      }

      node = xpathResult.iterateNext();
    }


    // load NS
    var prefixes = {};
    for(var i = ctx.length - 1; i >= 0; i--) {
      for(p in ctx[i].prefixes) {
        model.setNamespace(p, ctx[i].prefixes[p]);
      }  
    }
    return model;
  },
  hasRDFa: function(rootElement)
  {
    return (RDFa.evaluateXPath("count(//" + RDFa.xpathExpression + ")", rootElement).numberValue > 0);
  },
  expandURI: function(prefixed, context) {
    if(prefixed == undefined || prefixed.length == 0)
      return null;

    if(prefixed[0] == "[" && prefixed.endsWith("]")) {
      prefixed = prefixed.substr(1,prefixed.length-2);
      if(prefixed.length == 0) {
        // generate bnode
        prefixed = RDFa.generateBNodeName(context.e, context.bnodes);
      }
    }

    if(prefixed.indexOf("_:") == 0) {
      return [null, prefixed];
    }

    var prefix = prefixed.split(":",2);
    // no ':', let's resolve it to a local property
    if(prefix.length == 0) { 
      return [null, RDFa.resolveURL(context.base, prefix)];
    }

    for(var i = context.length - 1; i >= 0; i--) {
        if(context[i].prefixes[prefix[0]]) {
            return [context[i].prefixes[prefix[0]], context[i].prefixes[prefix[0]] + prefix[1]];
        } 
    }  

    // for sake of being practical
    if(RDFa.DEFAULT_NS[prefix[0]]) {
      return [RDFa.DEFAULT_NS[prefix[0]], RDFa.DEFAULT_NS[prefix[0]] + prefix[1]];
    }

    // most likely http://
    return [null, prefixed];
  },
  resolveURL: function(baseURL, relURL) {
    try {
      var base = Components.classes["@mozilla.org/network/standard-url;1"].createInstance();
      base = base.QueryInterface(Components.interfaces.nsIURL);
      base.spec = baseURL;
      return base.resolve(relURL);
    } catch(e) {
      return relURL;
    }
  },
  createContext: function(e, context, bnodes)
  {
    var newContext = {};

    newContext.e = e;
    newContext.bnodes = bnodes;

    // set prefixes
    var prefixes = {};

    for(var i = 0; i < e.attributes.length; i++) {
      var attrib = e.attributes.item(i);
      if(attrib.nodeName.indexOf("xmlns:") == 0) {
        prefixes[attrib.nodeName.substr(6)] = e.getAttribute(attrib.nodeName);
      } else if(attrib.nodeName.indexOf("xml:base") == 0) {
        newContext.base = attrib.nodeName.indexOf("xml:base"); 
      }
    }

    newContext.prefixes = prefixes;

    // set base
    if(newContext.base && context && context.length > 0) {
      newContext.base = RDFa.resolveURL(context[context.length-1].base, newContext.base);
    } else {
      newContext.base = e.ownerDocument.location.href;
    }

    // set about
    var about = context ? context.about : e.ownerDocument.location.href;

    if(e.hasAttribute("about")) {
      about = e.getAttribute("about");
    } else if(e.hasAttribute("rel") && !e.hasAttribute("href")) {
       about = RDFa.generateBNodeName(e, bnodes);
    }

    if(about && about.indexOf("_:") != 0)  {
        newContext.about = RDFa.resolveURL(newContext.base,about);
    } else {
        newContext.about = about;
    }

    // TODO: set xml:lang or lang

    return newContext;
  },
  evaluateXPath: function(xpathExpression, rootElement, resultType)
  {
    return (rootElement.ownerDocument || rootElement).
      evaluate(xpathExpression, rootElement, null, resultType || 0, null);
  },
  generateBNodeName: function(e, bnodes)
  {
    if(bnodes.nodes[e]) return bnodes.nodes[e];
    
    var name = e.nodeName.toLowerCase();
    bnodes.counter[name] = !bnodes.counter[name] ? 0 : bnodes.counter[name] + 1;
    bnodes.nodes[e] = "_:" + name + bnodes.counter[name];
    return bnodes.nodes[e]; 
    
  },
  isAncestor: function(ancestor, descendant)
  {
    return !!(ancestor.compareDocumentPosition(descendant) & 16);
  }
};

RDFa.Resource = function(_s, _model) {
  var model = _model;
  var s = _s;

  this.toString = function() {
    return model.$uris[s];
  };
  this.isBlank = function() {
    return model.$uris[s].indexOf("_:") == 0;
  };
  this.equals = function(obj) {
    try {
      if(obj.url !== undefined) {
         if(obj.model === obj.model && obj.index == s)
           return true; 
      }
    } catch(e) {
        // ignore
    }
    return false;
  };
  this.__defineGetter__("url", function() { return model.$uris[s]; });
  this.__defineGetter__("model", function() { return model; });
  this.__defineGetter__("index", function() { return s; });
};

RDFa.Literal = function(_value, _type, _lang, _model) {
  var model = _model;
  var value = _value;
  var type = _type;
  var lang = _lang;

  this.toString = function() {
    return model.literals[value];
  };
  this.equals = function(obj) {
    try {
      if(obj.value !== undefined) {
         if(obj.model === obj.model && obj.index == s)
           return true; 
      }
    } catch(e) {
        // ignore
    }
    return false;
  };
  this.__defineGetter__("value", function() { return model.literals[value] });
  this.__defineGetter__("model", function() { return model; });
  this.__defineGetter__("index", function() { return value; });
};

RDFa.Model = function() {

  var triples = [];
  var subjects = {};
  var properties = []
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
  this.__defineGetter__("namespaces", function() { return namespaces; });
  this.setNamespace = function(prefix, url) {
    namespaces[prefix] = url;
  };
  this.getUriNs = function(uri) {
    if(uris_map[uri] != undefined) {
      uri = uris_map[uri];
    } 

    if(uris_ns[uri] !== undefined) {
      return uris_arr[uris_ns[uri]];
    }
  };
  this.indexURI = function(uri) {
    if(typeof(uri) == 'object' && uri.length && uri.length == 2) {
      var u = this.indexURI(uri[1]);
      if(uri[0] !== undefined) {
        uris_ns[u] = this.indexURI(uri[0]);  
      }
      return u;
    } else {
      if(uris_map[uri] == undefined)
        uris_map[uri] = uris_arr.push(uri) - 1;
      return uris_map[uri];
    }
  };
  this.indexLiteral = function(literal) {
    if(literals_map[literal] == undefined)
      literals_map[literal] = literals_arr.push(literal) - 1;
    return literals_map[literal];
  };
  this.addLiteral = function(s, p, o) {
    this.add(this.createResource(s),this.createResource(p),this.createLiteral(o));
  };
  this.addResource = function(s, p, o) {
    this.add(this.createResource(s),this.createResource(p),this.createResource(o));
  };
  this.add = function(s, p, o) {
    if(subjects[s.index] == undefined) {
      subjects[s.index] = {};
    }
    if(subjects[s.index][p.index] == undefined) {
      subjects[s.index][p.index] = [];
    }
    var existing = subjects[s.index][p.index];

    for(var i = 0; i < existing.length; i++) {
        if(triples[existing[i]][2].equals(o)) {
            return;
        }
    } 
    var index = triples.push([s.index,p.index,o]);
    subjects[s.index][p.index].push(index-1);

    if(properties[p.index] == undefined) {
      properties[p.index] = [];
    }
    properties[p.index].push(index-1);
  };
  this.getObject = function(s) {
    if(subjects[s] == undefined) {
      return null;
    }
    return new RDFa.SemanticObject(s, model);
  };
  this.getObjectsWithProperty = function(p) {
    if(uris_map[p] !== undefined) {
      p = uris_map[p];
    }
    if(properties[p] !== undefined) {
      var objects = [];
      var ts = properties[p];
      for(var x = 0; x < ts.length; x++) {
        var sub = triples[ts[x]][0];
        objects.push(new RDFa.SemanticObject(this, uris_arr[sub])); 
      }
      return objects;
    }
    return [];
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
      for(x in ts) {
        props.push(new RDFa.Resource(x, this));
      }
      return props;
    }
    return [];
  };
  this.getSubjects = function() {
    var results = [];
    for(i in subjects) { 
      if(uris_arr[i].indexOf("_:") == 0) continue;
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
    return new RDFa.Literal(index, t, lang, this);
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
    for(r in results) {
      if(results[r].url !== undefined && _this.model.hasSubject(results[r].url)) {
        var child = new RDFa.SemanticObject(_this.model, results[r].url);
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
  };
  function all() {
    return subproperties;
  };
  function hasMore() {
    return (subproperties.length > 1);
  };
  function namespace() {
    return _this.model.getUriNs(prop);
  };
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
  this.subject = _subject;


  if(!this.model.hasSubject(this.subject)) {
    throw new Error("Invalid subject passed to constructor.");
  }

  this.getNamespaceList = function() {
    var props = this.model.enumProperties(this.subject);
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

    if(objects == undefined || objects.length == 0) {
      objects = this.model.getProperty(this.subject, RDFa.ns.dc("title"));
    }

    if(objects !== undefined && objects.length > 0) {
      return objects[0].toString();
    } else {
      return this.subject;
    }
 
    return this.subject;
  };
};

RDFa.Utilities = {
  getter : function (obj) { 
    return function() {
        return obj;
    };
  },
  nullGetter : function () {
    return null;
  },
  rebind : function(subject) {
    for(p in this.namespaces) {
        var base = '';
        if(p != '_default_') {
            base = p + "_";
        }
        var props = this.model.enumProperties(subject);
        for(var i = 0; i < props.length; i++) {
          var u = props[i].url;
          if(u.indexOf(this.namespaces[p]) != 0) 
            continue;
          var name = base + u.substring(this.namespaces[p].length);
          var objects  = this.model.getProperty(subject, u);
          var all_objects = true;
          for(o in objects) {
            if(objects[o].url !== undefined) {
              if(this.model.hasSubject(objects[o].url))
                continue;
            }
            all_objects = false;
            break;
          }
          if(all_objects) {
            var child = new RDFa.SemanticObject(this.model, objects[0].url);
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

RDFa.TestSuite = {
  ns : {
    foaf : function(name) { return "http://xmlns.com/foaf/0.1/" + name },
    rdf : function(name) { return "http://www.w3.org/1999/02/22-rdf-syntax-ns#" + name },
  }, 
  run : function() {
    for(var i = 0; i < RDFa.TestSuite.tests.length; i++) {
        if(typeof(RDFa.TestSuite.tests[i]) == 'function')
          RDFa.TestSuite.tests[i].apply(RDFa.TestSuite);
    }
    alert("Success!");
  },
  assert : function(expr, msg) {
    if(expr !== undefined && !expr) {
        throw new Error(msg || "test failed");
    }
  },
  assertTrue : function(expected, result) {
    if(expected !== undefined && result !== undefined && expected != result) {
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

        model.addResource(s1, ns.foaf("knows"), "http://www.w3.org/People/djweitzner/foaf#DJW");
        model.addResource(s1, ns.foaf("knows"), "http://www.w3.org/People/Berners-Lee/card#i");
        model.addResource(s1, ns.foaf("knows"), "http://www.w3.org/People/EM/contact#me");

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
        var b1 = "_:div0";

        model.addResource(s1, ns.foaf("knows"), b1);
        model.addResource(s1, ns.foaf("knows"), b1);
        model.addResource(s1, ns.foaf("knows"), b1);
    
        this.assertTrue(1, model.triples.length);
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


