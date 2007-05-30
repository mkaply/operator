var Operator = {
  dataformats: [],
  prefBranch: null,
  debug: false,
  official: true,
  view: 1,
  upcomingBugFixed: false,
  highlightMicroformats: false,
  useDescriptiveNames: false,
  removeDuplicates: true,
  observeDOMAttrModified: false,
  statusbar: false,
  batchPrefChanges: false,
  customizeDone: false,
  languageBundle: null,
  highlightedElement: null,
  highlightedElementOutlineStyle: null,
  timerID: null,
  /* Operator maintains its own list of actions that combines RDFa and microformats into one */
  actions: {
    /* When an action is added, the name is placed in this list */
    list: [],
    /* need to check for clash and combine semantic scope */
    add: function add(action, actionDefinition) {
      if (!Operator.actions[action]) {
        Operator.actions[action] = {};
        Operator.actions[action].description = actionDefinition.description;
        Operator.actions[action].descriptionAll = actionDefinition.descriptionAll;
        Operator.actions[action].icon = actionDefinition.icon;
        Operator.actions[action].scope = actionDefinition.scope;
        if (actionDefinition.doActionAll) {
          Operator.actions[action].doActionAll = true;
        }
        Operator.actions.list.push(action);
      } else {
        var i;
        for (i in actionDefinition.scope.semantic) {
        /* Assume everything else is good. Just get the new scope */
          Operator.actions[action].scope.semantic[i] = actionDefinition.scope.semantic[i];
        }
      }
    },
    __iterator__: function () {
      var i;
      for (i=0; i < this.list.length; i++) {
        yield this.list[i];
      }
    },
  },
  init: function init()
  {
    var options = false;
    if (window.location.href.match("operator_options")) {
      options = true;
    }
    if (Components.utils.import) {
      try {
        Components.utils.import("rel:Microformats.js");
      } catch (ex) {}
    }
    var objScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
    if (typeof(Microformats) == "undefined") {
      objScriptLoader.loadSubScript("chrome://operator/content/Microformats/Microformats.js");
      Microformats.init(objScriptLoader, "chrome://operator/content/Microformats/");
    }
    /* Don't assume we have RDF */
    try {
      objScriptLoader.loadSubScript("chrome://operator/content/RDFa/rdfa.js");
    } catch (ex) {}
    objScriptLoader.loadSubScript("chrome://operator/content/SemanticActions/SemanticActions.js");

    if (!options) {
      /* Operator specific parser stuff */
      Microformats.hCard.icon = "chrome://operator/content/hCard.png";
      Microformats.hCalendar.icon = "chrome://operator/content/hCalendar.png";
      Microformats.geo.icon = "chrome://operator/content/geo.png";
      Microformats.tag.sort = true;
  
      objScriptLoader.loadSubScript("chrome://operator/content/operator_toolbar.js");
      objScriptLoader.loadSubScript("chrome://operator/content/operator_statusbar.js");
      objScriptLoader.loadSubScript("chrome://operator/content/operator_toolbar_button.js");
//      objScriptLoader.loadSubScript("chrome://operator/content/operator_toolbar_buttons.js");
      objScriptLoader.loadSubScript("chrome://operator/content/operator_sidebar.js");
    }
    var bundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].
                                   getService(Components.interfaces.nsIStringBundleService);
    this.languageBundle = bundleService.createBundle("chrome://operator/locale/operator.properties");

    var languageBundle = bundleService.createBundle("chrome://operator/locale/microformats.properties");
    var i, j;
    for (i in Microformats)
    {
      try {
        Microformats[i].description = languageBundle.GetStringFromName(i + ".description");
      } catch (ex) {
      }
    }
    
    var file = Components.classes["@mozilla.org/file/directory_service;1"].
                          getService(Components.interfaces.nsIProperties).
                          get("ProfD", Components.interfaces.nsILocalFile);
    file.append("operator");
    
    if (file.exists() && file.isDirectory()) {
      var e = file.directoryEntries;
      while (e.hasMoreElements()) {
        var f = e.getNext().QueryInterface(Components.interfaces.nsIFile);
        var splitpath = f.path.split(".");
        if (splitpath[splitpath.length-1] == "js") {
          var fileHandler = Components.classes["@mozilla.org/network/io-service;1"].
                                       getService(Components.interfaces.nsIIOService).
                                       getProtocolHandler("file").
                                       QueryInterface(Components.interfaces.nsIFileProtocolHandler);
          try {
            objScriptLoader.loadSubScript(fileHandler.getURLSpecFromFile(f));
          } catch (ex) {
            alert("Unable to load " + f.leafName + "\n\n" + "(" + ex.message + ")");
          }
        }
      }
    }

    for (i in SemanticActions) {
      Operator.actions.add(i, SemanticActions[i]);
    }
    for (i in Operator.actions)
    {
      try {
        Operator.actions[i].description = languageBundle.GetStringFromName(i + ".description");
      } catch (ex) {
      }
    }
    
    for (i in Microformats) {
      Operator.dataformats.push(i);
    }
    if (typeof(RDFa) != "undefined") {
      Operator.dataformats.push("RDFa");
    }
    if (typeof(eRDF) != "undefined") {
      Operator.dataformats.push("eRDF");
    }

    /* preference stuff */
    this.prefBranch = Components.classes["@mozilla.org/preferences-service;1"].
                                 getService(Components.interfaces.nsIPrefService).
                                 getBranch("extensions.operator.");
    /* Just delete the really old prefs if we find them */
    var prefBranchOld = Components.classes["@mozilla.org/preferences-service;1"].
                                   getService(Components.interfaces.nsIPrefService).
                                   getBranch("extensions.operator_toolbar.");
    var oldcount = { value: 0 };
    try {
      var prefArray = prefBranchOld.getChildList("", oldcount);
    } catch (ex) {
    }
    if (oldcount.value > 0) {
      prefBranchOld.deleteBranch("");
    }
    /* Check for ***PREFERENCE*** and if we find it, just wipe wll preferences */
    /* microformats1 */
    try {
      this.prefBranch.getCharPref("microformat1");
      /* If we got here, we have old stuff */
      this.prefBranch.deleteBranch("");
    } catch (ex) {}
    var newcount = { value: 0 };
    try {
      this.prefBranch.getChildList("", newcount);
    } catch (ex) {
    }
    if (newcount.value == 0) {
      j = 1;
      for (i=0; i< Operator.dataformats.length; i++) {
        this.prefBranch.setCharPref("dataformat" + (j), Operator.dataformats[i]);
        j++;
      }
      
      this.prefBranch.setCharPref("action1", "export_vcard");
      this.prefBranch.setCharPref("action2", "google_calendar");
      this.prefBranch.setCharPref("action3", "google_maps");
      this.prefBranch.setCharPref("action4", "flickr_search_tags");
      this.prefBranch.setCharPref("action5", "delicious_search_tags");
      this.prefBranch.setCharPref("action6", "technorati_search_tags");
    }

    try {
      this.debug = this.prefBranch.getBoolPref("debug");
    } catch (ex) {}
    try {
      this.release = this.prefBranch.getBoolPref("release");
    } catch (ex) {}
    try {
      this.useDescriptiveNames = this.prefBranch.getBoolPref("useDescriptiveNames");
    } catch (ex) {}
    try {
      this.highlightMicroformats = this.prefBranch.getBoolPref("highlightMicroformats");
    } catch (ex) {}
    try {
      this.removeDuplicates = this.prefBranch.getBoolPref("removeDuplicates");
    } catch (ex) {}
    try {
      this.observeDOMAttrModified = this.prefBranch.getBoolPref("observeDOMAttrModified");
    } catch (ex) {}
    try {
      this.upcomingBugFixed = this.prefBranch.getBoolPref("upcomingBugFixed");
    } catch (ex) {}
    try {
      this.view = this.prefBranch.getIntPref("view");
    } catch (ex) {}
    try {
      this.statusbar = this.prefBranch.getBoolPref("statusbar");
    } catch (ex) {}

    if (options) {
      return;
    }

    window.addEventListener("load", function(e)   { Operator.startup(); }, false);
    window.addEventListener("unload", function(e) { Operator.shutdown(); }, false);
    window.addEventListener("operator-sidebar-load", Operator_Sidebar.processSemanticData, false, true);
    
  },
  startup: function startup()
  {
    this.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefBranch.addObserver("", this, false);

    /* Window specific stuff */
    if (this.statusbar) {
      Operator_Statusbar.show();
    } else {
      Operator_Statusbar.hide();
    }
    Operator_Toolbar.create();
    getBrowser().addEventListener("pageshow", function(e) { Operator.onPageShow(e); }, true);
    getBrowser().addEventListener("pagehide", function(e) { Operator.onPageHide(e); }, true);
    getBrowser().tabContainer.addEventListener("select", function(e) { Operator.onTabChanged(e); }, true);
    var menu = document.getElementById("contentAreaContextMenu");
    menu.addEventListener("popupshowing", Operator.contextPopupShowing, false);
  },
  shutdown: function shutdown()
  {
    this.prefBranch.removeObserver("", this);
    getBrowser().removeEventListener("pageshow", function(e) { Operator.onPageShow(e); }, true);
    getBrowser().removeEventListener("pagehide", function(e) { Operator.onPageHide(e); }, true);
    getBrowser().tabContainer.removeEventListener("select", function(e) { Operator.onTabChanged(e); }, true);
    var menu = document.getElementById("contentAreaContextMenu");
    menu.removeEventListener("popupshowing", Operator.contextPopupShowing, false);
  },
  observe: function observe(subject, topic, data)
  {
    if (topic != "nsPref:changed")
    {
      return;
    }
    if (data == "batchPrefChanges") {
      try {
        this.batchPrefChanges = this.prefBranch.getBoolPref("batchPrefChanges");
      } catch(ex) {
        this.batchPrefChanges = false;
      }
    }
    if (data == "debug") {
      this.debug = this.prefBranch.getBoolPref("debug");
    }
    if (data == "release") {
      this.release = this.prefBranch.getBoolPref("release");
    }
    if (data == "useDescriptiveNames") {
      this.useDescriptiveNames = this.prefBranch.getBoolPref("useDescriptiveNames");
    }
    if (data == "removeDuplicates") {
      this.removeDuplicates = this.prefBranch.getBoolPref("removeDuplicates");
    }
    if (data == "observeDOMAttrModified") {
      this.observeDOMAttrModified = this.prefBranch.getBoolPref("observeDOMAttrModified");
    }
    if (data == "upcomingBugFixed") {
      this.upcomingBugFixed = this.prefBranch.getBoolPref("upcomingBugFixed");
    }
    if (data == "highlightMicroformats") {
      this.highlightMicroformats = this.prefBranch.getBoolPref("highlightMicroformats");
      if (this.highlightedElement) {
        this.highlightedElement.style.outline = this.highlightedElementOutlineStyle;
        this.highlightedElement = null;
      }
    }
    if (data == "view") {
      this.view = this.prefBranch.getIntPref("view");
    }
    if (data == "statusbar") {
      if (this.prefBranch.getBoolPref("statusbar")) {
        this.statusbar = true;
        Operator_Statusbar.show();
      } else {
        Operator_Statusbar.hide();
        this.statusbar = false;
      }
      return;
    }

    if (!this.batchPrefChanges) {
      Operator_Toolbar.create();
      Operator.processSemanticData();
    }
  },

  highlightCallbackGenerator: function highlightCallbackGenerator(item)
  {
    return function(event) {
      if (Operator.highlightDOMNode(item)) {
        item.scrollIntoView(false);
      }
    };
  },

  
  actionCallbackGenerator: function actionCallbackGenerator(semanticObject, semanticObjectType, semanticAction)
  {
    return function(event) {
      var url;
      url = SemanticActions[semanticAction].doAction(semanticObject, semanticObjectType)
      if ((url) && (url != true)) {
        openUILink(url, event);
      }
    };
  },
  actionAllCallbackGenerator: function actionAllCallbackGenerator(semanticArrays, semanticAction)
  {
    return function(event) {
      var url;
      url = SemanticActions[semanticAction].doActionAll(semanticArrays)
      if ((url) && (url != true)) {
        openUILink(url, event);
      }

    };
  },
  clickCallbackGenerator: function clickCallbackGenerator(semanticObject, semanticObjectType, semanticAction)
  {
    return function(event) {
      /* This is for middle click only */
      if (event.button == 1) {
        if (event.target.getAttribute("disabled") != "true") {
          var url;
          url = SemanticActions[semanticAction].doAction(semanticObject, semanticObjectType)
          if ((url) && (url != true)) {
            openUILink(url, event);
          }
          closeMenus(event.target);
        }
      }
    };
  },
  clickAllCallbackGenerator: function clickAllCallbackGenerator(semanticArrays, semanticAction)
  {
    return function(event) {
      /* This is for middle click only */
      if (event.button == 1) {
        if (event.target.getAttribute("disabled") != "true") {
          var url;
          url = SemanticActions[semanticAction].doActionAll(semanticArrays)
          if ((url) && (url != true)) {
            openUILink(url, event);
          }
          closeMenus(event.target);
        }
      }
    };
  },

  sourceCallbackGenerator: function sourceCallbackGenerator(formatname, item)
  {
    return function(event) {
      Operator.source(item, formatname);
    };
  },

  errorCallbackGenerator: function errorCallbackGenerator(semanticObject, semanticObjectType)
  {
    return function(event) {
      Operator.error(semanticObject, semanticObjectType);
    };
  },
  buildMenu: function buildMenu(semanticObjects, semanticObjectType, semanticAction)
  {
    var menu = null;
    var items;
    
    items = [];
    var displayname;
    var j, m;
    for (j=0; j < semanticObjects.length; j++) {
      items[j] = {} ;
      items[j].node = semanticObjects[j].node;
      items[j].object = semanticObjects[j];
      displayname = items[j].object.toString();
      if (displayname) {
        items[j].displayname = displayname;
        items[j].error = false;
      } else {
        items[j].displayname = "Invalid - select for more details";
        items[j].error = true;
      }
    }
    var sorted_items = items.slice();
    if (items.length > 1) {
      sorted_items = sorted_items.sort(
        function (a,b) {
          if (a.displayname.toLowerCase() < b.displayname.toLowerCase()) {
            return -1;
          }
          if (a.displayname.toLowerCase() > b.displayname.toLowerCase()) {
            return 1;
          }
          return 0;
        }
      );
      /* remove duplicates */
      j=1;
      if (this.removeDuplicates) {
        while (sorted_items[j]) {
          if ((sorted_items[j].displayname == sorted_items[j-1].displayname) && (sorted_items[j].error === false)) {
            if (Operator.areEqualObjects(sorted_items[j].object, sorted_items[j-1].object)) {
              for (m = 0; m < items.length; m++) {
                if (items[m].node == sorted_items[j].node) {
                  items[m].duplicate = true;
                }
//                break;
              }
              sorted_items.splice(j,1);
            } else {
              j++;
            }
          } else {
            j++;
          }
        }
      }
    }
    /* XXX TODO Need a better way to figure out sorting! */
    if (Microformats[semanticObjectType]) {
      if ((items.length > 1) && Microformats[semanticObjectType].sort) {
        items = sorted_items;
      }
    }

    var itemsadded = 0;
    var tempMenu;
    var menuitem;
    for (j=0; j < items.length; j++) {
      if (!items[j].duplicate) {
        if (!items[j].error || this.debug) {
          if (!menu) {
            menu = document.createElement("menupopup");
          }
          if ((this.view === 0) && (!items[j].error)) {
            tempMenu = document.createElement("menu");
          } else {
            tempMenu = document.createElement("menuitem");
          }
          tempMenu.store_onDOMMenuItemActive = this.highlightCallbackGenerator(items[j].node);
          tempMenu.addEventListener("DOMMenuItemActive", tempMenu.store_onDOMMenuItemActive, true);
          tempMenu.setAttribute("label", items[j].displayname);
          tempMenu.label = items[j].displayname;
          if (items[j].error) {
            tempMenu.store_oncommand = this.errorCallbackGenerator(items[j].object, semanticObjectType);
            tempMenu.addEventListener("command", tempMenu.store_oncommand, true);
            tempMenu.style.fontWeight = "bold";
            menu.error = true;
          } else {
            /* NOT ACTIONS */
            if (this.view === 0) {
              var submenu = document.createElement("menupopup");
              tempMenu.appendChild(submenu);
              tempMenu.store_onpopupshowing = this.popupShowing(items[j].object, semanticObjectType);
              tempMenu.addEventListener("popupshowing", tempMenu.store_onpopupshowing, false);
            } else {
              tempMenu.store_oncommand = this.actionCallbackGenerator(items[j].object, semanticObjectType, semanticAction);
              tempMenu.addEventListener("command", tempMenu.store_oncommand, true);
              tempMenu.store_onclick = this.clickCallbackGenerator(items[j].object, semanticObjectType, semanticAction);
              tempMenu.addEventListener("click", tempMenu.store_onclick, true);
            }
          }
          menu.appendChild(tempMenu);
          itemsadded++;
        } else {
          var error = {};
          
          /* XXX TODO Validate needs to be more generic? Or do we only call it in the microformat case? */
          Microformats.parser.validate(items[j].node, semanticObjectType, error);

          Operator.console_message(error.message, Operator.lineNumberFromDOMNode(items[j].node));
//          if (typeof Firebug != "undefined") {
//            Firebug.Console.log(Operator.microformats[microformat].getError(items[j].node), items[j].node);
//          }
        }
      }
    }
    
    /* XXX TODO Action All */
    if (this.view === 0) {
    } else {
      if (Operator.actions[semanticAction].scope.semantic[semanticObjectType]) {
        if ((Operator.actions[semanticAction].doActionAll) && (itemsadded > 0)) {
          var sep = document.createElement("menuseparator");
          menu.appendChild(sep);
          tempMenu = document.createElement("menuitem");
          tempMenu.label = Operator.actions[semanticAction].descriptionAll;
          tempMenu.setAttribute("label", tempMenu.label);
          tempMenu.store_oncommand = Operator.actionAllCallbackGenerator(semanticObjects, semanticObjectType, semanticAction);
          tempMenu.addEventListener("command", tempMenu.store_oncommand, true);
          tempMenu.store_onclick = Operator.clickAllCallbackGenerator(semanticObjects, semanticObjectType, semanticAction);
          tempMenu.addEventListener("click", tempMenu.store_onclick, true);
          menu.appendChild(tempMenu);
        }
      }
    }
    return menu;
  },
  popupShowing: function popupShowing(semanticObject, semanticObjectType)
  {
    return function(event) {
      if (event.target.childNodes.length == 0) {
        Operator.attachActions(event.target, semanticObject, semanticObjectType);
      }
    };
  },
  attachActions: function attachActions(parentmenu, semanticObject, semanticObjectType)
  {
    var required;
    var menuitem;
    var submenu = parentmenu;
    var k;
    var addedAction = false;
    for (k in Operator.actions) {
      if (!Operator.actions[k].scope.semantic[semanticObjectType]) {
        continue;
      }
      if ((Operator.actions[k].scope.semantic[semanticObjectType] != semanticObjectType)  && (semanticObjectType != "RDFa")) {
        var reqprop = Operator.actions[k].scope.semantic[semanticObjectType];
        var required;
        if (reqprop.indexOf(".") != -1) {
          var props = reqprop.split(".");
          if (semanticObject[props[0]]) {
            required = semanticObject[props[0]][props[1]];
          }
        } else {
          required = semanticObject[reqprop];
        }
        if (!required) {
          continue;
        }
      }
      if (Operator.actions[k].scope.url) {
        if (!(content.document.location.href.match(Operator.actions[k].scope.url))) {
          continue;
        }
      }
      if (semanticObjectType == "RDFa") {
        if ((semanticObject.$model.getProperty(semanticObject.$subject, Operator.actions[k].scope.semantic[semanticObjectType]["property"])).length == 0) {
          continue;
        } else {
          semanticObject.setDefaultNS(Operator.actions[k].scope.semantic[semanticObjectType]["defaultNS"]);
        }
      }
      menuitem = document.createElement("menuitem");
      menuitem.label = Operator.actions[k].description;
      menuitem.setAttribute("label", menuitem.label);
      menuitem.store_oncommand = this.actionCallbackGenerator(semanticObject, semanticObjectType, k);
      menuitem.addEventListener("command", menuitem.store_oncommand, true);
      menuitem.store_onclick = this.clickCallbackGenerator(semanticObject, semanticObjectType, k);
      menuitem.addEventListener("click", menuitem.store_onclick, true);
      submenu.appendChild(menuitem);
      addedAction = true;
    }
    if (this.debug) {
      if (addedAction) {
        menuitem = document.createElement("menuseparator");
        submenu.appendChild(menuitem);
      }
      menuitem = document.createElement("menuitem");
      menuitem.label = Operator.languageBundle.GetStringFromName("debug.label");
      menuitem.setAttribute("label", menuitem.label);
      menuitem.store_oncommand = this.errorCallbackGenerator(semanticObject, semanticObjectType);
      menuitem.addEventListener("command", menuitem.store_oncommand, true);
      submenu.appendChild(menuitem);
    }
    if ((!addedAction) && (!this.debug)) {
      menuitem = document.createElement("menuitem");
      menuitem.label = Operator.languageBundle.GetStringFromName("noActions.label");
      menuitem.setAttribute("label", menuitem.label);
      menuitem.setAttribute("disabled", true);
      submenu.appendChild(menuitem);
    }
  },
  /* This only works with microformats */
  contextPopupShowing: function contextPopupShowing(event) {
    gContextMenu.showItem("operator-menu-0", false);
    gContextMenu.showItem("operator-menu-1", false);
    gContextMenu.showItem("operator-menu-2", false);
    gContextMenu.showItem("operator-menu-3", false);
    gContextMenu.showItem("operator-menu-4", false);
    gContextMenu.showItem("operator-separator", false);
    var node = gContextMenu.target;
    var mfNode;
    if (Microformats.isMicroformat(node)) {
      mfNode = node;
    } else {
      mfNode = Microformats.getParent(node);
    }
    var curmenu = 0;
    while (mfNode) {
      var mfNameString = Microformats.getNamesFromNode(mfNode);
      var mfNames = mfNameString.split(" ");
      var i;
      var actionmenu;
      var shown_separator = false;
      for (i=0; i < mfNames.length; i++) {
        actionmenu = document.createElement("menupopup");
        Operator.attachActions(actionmenu, new Microformats[mfNames[i]].mfObject(mfNode), mfNames[i]);
        if (actionmenu.childNodes.length > 0) {
          if (!shown_separator) {
            gContextMenu.showItem("operator-separator", true);
          }
          gContextMenu.showItem("operator-menu-" + curmenu, true);
          var menuitem = document.getElementById("operator-menu-" + curmenu);
          curmenu++;
          if (Microformats[mfNames[i]].description) {
            menuitem.label = "Operator " + Microformats[mfNames[i]].description;
          } else {
            menuitem.label = "Operator " + mfNames[i];
          }
          menuitem.setAttribute("label", menuitem.label);
          for(var j=menuitem.childNodes.length - 1; j>=0; j--) {
            menuitem.removeChild(menuitem.childNodes.item(j));
          }
          menuitem.appendChild(actionmenu);
        }
      }
      mfNode = Microformats.getParent(mfNode);
    }
  },
  highlightDOMNode: function highlightDOMNode(node)
  {
    if (Operator.highlightMicroformats) {
      if (node) {
        if (Operator.highlightedElement != node) {
          if (Operator.highlightedElement) {
            Operator.highlightedElement.style.outline = this.highlightedElementOutlineStyle;
          }
          Operator.highlightedElement = node;
          Operator.highlightedElementOutlineStyle = node.style.outline;
          node.style.outline = "black solid medium";
        }
      } else {
        if (Operator.highlightedElement) {
          Operator.highlightedElement.style.outline = this.highlightedElementOutlineStyle;
          Operator.highlightedElement = null;
        }
      }
      return true;
    } else {
      return false;
    }
  },
  /* This only works with microformats */
  mouseOver: function mouseOver(event) {
    var element = (event.target) ? event.target : event.srcElement;
    var mfNode;
    if (Microformats.isMicroformat(element)) {
      mfNode = element;
    } else {
      mfNode = Microformats.getParent(element);
    }
    if (mfNode) {
      Operator.highlightDOMNode(mfNode);
    }
  },
  processSemanticDataDelayed: function processSemanticDataDelayed(event)
  {
    if (Operator.timerID) {
      window.clearTimeout(Operator.timerID);
    }
    Operator.timerID = window.setTimeout(Operator.processSemanticData, 100);
  },
  recursiveAddListeners: function recursiveAddListeners(window)
  {
    if (window && window.frames.length > 0) {
      for (var i=0; i < window.frames.length; i++) {
        Operator.recursiveAddListeners(window.frames[i]);
      }
    }
    window.document.addEventListener("mouseover", Operator.mouseOver, false);
    window.document.addEventListener("DOMNodeInserted", Operator.processSemanticDataDelayed, false);
    window.document.addEventListener("DOMNodeRemoved", Operator.processSemanticDataDelayed, false);
    if (Operator.observeDOMAttrModified) {
      window.document.addEventListener("DOMAttrModified", Operator.processSemanticDataDelayed, false);
    }
  },
  recursiveRemoveListeners: function recursiveRemoveListeners(window)
  {
    if (window && window.frames.length > 0) {
      for (var i=0; i < window.frames.length; i++) {
        Operator.recursiveRemoveListeners(window.frames[i]);
      }
    }
    window.document.removeEventListener("mouseover", Operator.mouseOver, false);
    window.document.removeEventListener("DOMNodeInserted", Operator.processSemanticDataDelayed, false);
    window.document.removeEventListener("DOMNodeRemoved", Operator.processSemanticDataDelayed, false);
    if (Operator.observeDOMAttrModified) {
      window.document.removeEventListener("DOMAttrModified", Operator.processSemanticDataDelayed, false);
    }
  },
  onPageShow: function onPageShow(event) 
  {
    {
      /* This is required so that things work properly when pages are opened */
      /* in background tabs (OR NOT - it broke nested page load notifications) */
//      if (content && (event.originalTarget == content.document)) {
        Operator.processSemanticDataDelayed();
        Operator.recursiveAddListeners(content);
//      }
    }
  },
  
  onPageHide: function onPageHide(event) 
  {
    {
      /* This is required so that things work properly when pages are opened */
      /* in background tabs */
      if (content && (event.originalTarget == content.document)) {
        /* These are required in case we go to a page that doesn't invoke our */
        /* onPageShow, like a non HTML document or an error page */
        Operator_Toolbar.disable();
        Operator_Toolbar.clearPopups();
        Operator_Statusbar.disable();
        Operator_ToolbarButton.disable();
      }
      Operator.recursiveRemoveListeners(content);
    }
  },


  onTabChanged: function onTabChanged(event) 
  {
    Operator.processSemanticData();
  },
  /* This function compares the strings in two objects to see if they are equal */
  areEqualObjects: function areEqualObjects(object1, object2)
  {
    if (object1.__count__ != object1.__count__) {
      return false;
    }
    for (var i in object1) {
      if (object1[i] instanceof String) {
        if (object1[i] == object2[i]) {
          continue;
        }
      } else if (object1[i] instanceof Array) {
        if (Operator.areEqualObjects(object1[i], object2[i])) {
          continue;
        }
      } else {
        continue;
      }
      alert('false2');
      return false;
    }
    return true;
  },
  debug_alert: function debug_alert(text)
  {
    if (!Operator.release) {
      window.openDialog("chrome://operator/content/operator_debug.xul","alert","chrome,centerscreen,modal", "Alert", text);
    }
  },
  console_message: function console_message(text, line_number)
  {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"].
                                    getService(Components.interfaces.nsIConsoleService);
    var scriptError = Components.classes["@mozilla.org/scripterror;1"].
                                 createInstance(Components.interfaces.nsIScriptError);
    if (!line_number) {
      line_number = 0;
    }                             
    scriptError.init("Operator: " + text, content.document.location.href, null, line_number, 
                     null, 0, 0);
    consoleService.logMessage(scriptError);
  },
  lineNumberFromDOMNode: function lineNumberFromDOMNode(node)
  {
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(content.document);
//    this.debug_alert(source);
    var node_source = serializer.serializeToString(node);
    var offset = source.indexOf(node_source);
    var less_source =source.substring(0, offset);
    var lines = less_source.split("\n");
    return lines.length;
  },
  error: function error(semanticObject, semanticObjectType)
  {
    var serializer = new XMLSerializer();
    var xmlString;
    if (semanticObject.node) {
      xmlString = serializer.serializeToString(semanticObject.node.origNode || semanticObject.node);
    }
    var vcfical = null;
    var X2V = null;
    
    if (semanticObjectType == "hCard") {
      try {
        vcfical = SemanticActions.export_vcard.vCard(semanticObject);
      } catch (ex) {}
      X2V = semanticObject.node;
    }
    if (semanticObjectType == "hCalendar") {
      try {
        vcfical = SemanticActions.export_icalendar.iCalendar(semanticObject, true, true);
      } catch (ex) {}
      X2V = semanticObject.node;
    }
    
    var error = {};
    /* XXX TODO Validate needs to be more generic? Or do we only call it in the microformat case? */
    if (semanticObjectType != "RDFa") {
      Microformats.parser.validate(semanticObject.node, semanticObjectType, error);
    }

    /* XXX TODO cross semantic validation */
    var dump;
    if (semanticObject.debug) {
      dump = semanticObject.debug(semanticObject);
    }

    window.openDialog("chrome://operator/content/operator_debug.xul","debug","chrome,centerscreen",
                      semanticObjectType,
                      error.message,
                      dump,
                      xmlString,
                      vcfical,
                      X2V);
  },
  getSemanticData: function getSemanticData(window, semanticArrays)
  {
    if (window && window.frames.length > 0) {
      for (var i=0; i < window.frames.length; i++) {
        Operator.getSemanticData(window.frames[i], semanticArrays);
      }
    }
    try {
      if(RDFa.hasRDFa(window.document)) {
        if (!semanticArrays["RDFa"]) {
          semanticArrays["RDFa"] = [];
        }
        /* Put model in the semanticArray (RDFa) */
        semanticArrays["RDFa"].push(RDFa.parse(window.document));
        
      }
    } catch (ex) {}
  },
  /* This is the heavy lifter for Operator. It goes through the document
     looking for semantic data and creates the menus and buttons */
  processSemanticData: function processSemanticData()
  {
    /* Reset the timer we're using to batch processing */
    Operator.timerID = null;

    /* Clear all the existing data and disable everything */
    Operator_Toolbar.clearPopups();
    Operator_Statusbar.clearPopup();
    Operator_ToolbarButton.clearPopup();
    Operator_Toolbar.disable();
    Operator_Statusbar.disable();
    Operator_ToolbarButton.disable();

    /* Get all semantic data from the web page */
    var semanticArrays = [];
    for (i in Microformats) {
      semanticArrays[i] = Microformats.get(i, content.document);
    }
    Operator.getSemanticData(content, semanticArrays);

    var i, j, k;
    var popup, menu, tempMenu, action;

    /* Actions */
    if (Operator.view == 1) {
      /* Enumerate through all the prefed actions */
      /* For each action, enumerate through microformats it recognizes (based on the semantic array) */
      /* If it is an understood microformat, check for requires and display/enable/disable item */
      i = 1;
      do {
        try {
          action = Operator.prefBranch.getCharPref("action" + i);
        } catch (ex) {
          break;
        }

        for (j in Operator.actions[action].scope.semantic) {
          if (semanticArrays[j]) {
            var objectArray;
            if (j == "RDFa") {
              /* Fill in objectArray by asking model for property */
              /* We actually need to loop through all RDFa models */
              /* and concatenate into one object array */
              objectArray = semanticArrays[j][0].getObjectsWithProperty(Operator.actions[action].scope.semantic[j]["property"],
                                                                        Operator.actions[action].scope.semantic[j]["defaultNS"]); 
            } else {
              objectArray = semanticArrays[j];
            }
            for (k=0; k < objectArray.length; k++) {
              /* Here we know we have objects that will work with this action */
              /* Create a menu that corresponds to the action? */
              /* Or postpone the creation until we are sure we have the first one? */
              if ((Operator.actions[action].scope.semantic[j] != j) && (j != "RDFa")) {
                var reqprop = Operator.actions[action].scope.semantic[j]
                var required;
                if (reqprop.indexOf(".") != -1) {
                  var props = reqprop.split(".");
                  if (objectArray[k][props[0]]) {
                    required = objectArray[k][props[0]][props[1]];
                  }
                } else {
                  required = objectArray[k][reqprop];
                }
                if (!required) {
                  continue;
                }
              }
              if (!menu) {
                menu = document.createElement("menupopup");
              }
              if (objectArray[k].toString()) {
                tempMenu = document.createElement("menuitem");
                tempMenu.label = objectArray[k].toString();
                tempMenu.setAttribute("label", tempMenu.label);
                tempMenu.store_oncommand = Operator.actionCallbackGenerator(objectArray[k], j, action);
                tempMenu.addEventListener("command", tempMenu.store_oncommand, true);
                tempMenu.store_onclick = Operator.clickCallbackGenerator(objectArray[k], j, action);
                tempMenu.addEventListener("click", tempMenu.store_onclick, true);
              } else if (Operator.debug) {
                tempMenu = document.createElement("menuitem");
                /* L10N */
                tempMenu.label = "Invalid - select for more details";
                tempMenu.setAttribute("label", tempMenu.label);
                tempMenu.store_oncommand = Operator.errorCallbackGenerator(objectArray[k], j);
                tempMenu.addEventListener("command", tempMenu.store_oncommand, true);
                tempMenu.style.fontWeight = "bold";
                menu.error = true;
              }
              if (tempMenu) {
                tempMenu.store_onDOMMenuItemActive = Operator.highlightCallbackGenerator(objectArray[k].node);
                tempMenu.addEventListener("DOMMenuItemActive", tempMenu.store_onDOMMenuItemActive, true);
                menu.appendChild(tempMenu);
              }
              tempMenu = null;
            }
          }
        }
        if (menu) {
          if ((Operator.actions[action].doActionAll)) {
            var sep = document.createElement("menuseparator");
            menu.appendChild(sep);
            tempMenu = document.createElement("menuitem");
            tempMenu.label = Operator.actions[action].descriptionAll;
            tempMenu.setAttribute("label", tempMenu.label);
            tempMenu.store_oncommand = Operator.actionAllCallbackGenerator(semanticArrays, action);
            tempMenu.addEventListener("command", tempMenu.store_oncommand, true);
            tempMenu.store_onclick = Operator.clickAllCallbackGenerator(semanticArrays, action);
            tempMenu.addEventListener("click", tempMenu.store_onclick, true);
            menu.appendChild(tempMenu);
          }

          if (!popup) {
            popup = document.createElement("menupopup");
          }               
          tempMenu = document.createElement("menu");
          tempMenu.label = Operator.actions[action].description;
          tempMenu.setAttribute("label", tempMenu.label);
          popup.appendChild(tempMenu);
          if (menu.error === true) {
            tempMenu.style.fontWeight = "bold";
          }
          tempMenu.appendChild(menu);

          Operator_Toolbar.addButtonMenu(menu, null, action);
        }
        menu = null;
        i++;
      } while (1);
    }

    /* Semantic Data */
    if (Operator.view == 0) /* OR WE HAVE BUTTONS */ {
      i = 1;
      var semanticType;
      do {
        /* Get the active semantic items from preferences */
        try {
          semanticType = Operator.prefBranch.getCharPref("dataformat" + i);
        } catch (ex) {
          break;
        }
        /* If the semantic item is in our array and has items in this documents,
           process it */
        if (semanticType && semanticArrays[semanticType] && semanticArrays[semanticType].length > 0) {
          var objectArray;
          if (semanticType == "RDFa") {
            objectArray = semanticArrays[semanticType][0].getObjects();
          } else {
            objectArray = semanticArrays[semanticType];
          }
          menu = Operator.buildMenu(objectArray, semanticType);
          if (menu) {
            if ((Operator.debug) && (semanticType == "RDFa")) {
              var sep = document.createElement("menuseparator");
              menu.insertBefore(sep, menu.firstChild);
              tempMenu = document.createElement("menuitem");
              tempMenu.label = "View Model";
              tempMenu.setAttribute("label", tempMenu.label);
              tempMenu.store_oncommand = Operator.errorCallbackGenerator(semanticArrays[semanticType][0], semanticType);
              tempMenu.addEventListener("command", tempMenu.store_oncommand, true);
              menu.insertBefore(tempMenu, menu.firstChild);
            }
            var sep = false;
            for (k in Operator.actions) {
              if (Operator.actions[k].scope.semantic[semanticType]) {
                if (Operator.actions[k].doActionAll) {
                  if (!sep) {
                    var sep = document.createElement("menuseparator");
                    menu.appendChild(sep);
                    sep = true;
                  }
                  tempMenu = document.createElement("menuitem");
                  tempMenu.label = Operator.actions[k].descriptionAll;
                  tempMenu.setAttribute("label", tempMenu.label);
                  tempMenu.store_oncommand = Operator.actionAllCallbackGenerator(semanticArrays, k);
                  tempMenu.addEventListener("command", tempMenu.store_oncommand, true);
                  tempMenu.store_onclick = Operator.clickAllCallbackGenerator(semanticArrays, k);
                  tempMenu.addEventListener("click", tempMenu.store_onclick, true);
                  menu.appendChild(tempMenu);
                }
              }
            }

            if (!popup) {
             popup = document.createElement("menupopup");
            }
            tempMenu = document.createElement("menu");

            if ((Operator.useDescriptiveNames) && Microformats[semanticType] && Microformats[semanticType].description) {
              tempMenu.label = Microformats[semanticType].description;
             } else {
              tempMenu.label = semanticType;
            }
            tempMenu.setAttribute("label", tempMenu.label);

            popup.appendChild(tempMenu);

            if (menu.error === true) {
              tempMenu.style.fontWeight = "bold";
            }

            tempMenu.appendChild(menu);

            Operator_Toolbar.addButtonMenu(menu, semanticType);
          }
        }
        i++;
      } while (1);
    }

    if (popup) {
      var clonePopup = false;
      tempMenu = document.createElement("menuseparator");
      popup.appendChild(tempMenu);
      tempMenu = document.createElement("menuitem");
      tempMenu.setAttribute("label", Operator.languageBundle.GetStringFromName("operatorOptions.label"));
      tempMenu.label = action;
      tempMenu.store_oncommand = function() {window.openDialog('chrome://operator/content/operator_options.xul','options','chrome,centerscreen,modal');};
      tempMenu.addEventListener("command", tempMenu.store_oncommand, true);
      popup.appendChild(tempMenu);

      /* add options to popup */
      
      if (!Operator_ToolbarButton.isHidden()) {
        Operator_ToolbarButton.enable();
        clonePopup = Operator_ToolbarButton.addPopup(popup);
      }
      if (!Operator_Statusbar.isHidden()) {
        Operator_Statusbar.enable();
        Operator_Statusbar.addPopup(popup, clonePopup);
      }
      Operator_Toolbar.enable();
    }
  },
  simpleEscape: function simpleEscape(s)
  {
    s = s.replace(/\&/g, '%26');
    s = s.replace(/\#/g, '%23');
    s = s.replace(/\+/g, '%2B');
    s = s.replace(/\=/g, '%3D');
    s = s.replace(/ /g, '+');
    return s;
  }
};

Operator.init();
