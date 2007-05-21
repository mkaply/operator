/*extern ufJS, ufJSParser, ufJSActions, Microformats, Components, Operator_Statusbar, Operator_Toolbar, Operator_ToolbarButton, getBrowser, content, HTMLDocument, XMLSerializer, Operator_Sidebar, closeMenus, gContextMenu, openUILink, XSLTProcessor */

var Operator = {
  microformats: {},
  prefBranch: null,
  debug: false,
  official: true,
  view: 1,
  upcomingOrgBugFixed: false,
  highlightMicroformats: false,
  useDescriptiveNames: false,
  removeDuplicates: true,
  observeDOMAttrModified: false,
  batchPrefChanges: false,
  customizeDone: false,
  languageBundle: null,
  highlightedElement: null,
  highlightedElementOutlineStyle: null,
  timerID: null,
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

    objScriptLoader.loadSubScript("chrome://operator/content/Microformats/ufJSActions.js");
    ufJSActions.init(objScriptLoader, "chrome://operator/content/Microformats/");
    /* Don't assume we have RDF */
    try {
      objScriptLoader.loadSubScript("chrome://operator/content/RDFa/rdfa.js");
    } catch (ex) {}

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
    var i;
    for (i in Microformats)
    {
      try {
        Microformats[i].description = languageBundle.GetStringFromName(i + ".description");
      } catch (ex) {
      }
    }
    for (i in ufJSActions.actions)
    {
      try {
        ufJSActions.actions[i].description = languageBundle.GetStringFromName(i + ".description");
      } catch (ex) {
      }
    }
    
    var file = Components.classes["@mozilla.org/file/directory_service;1"].
                          getService(Components.interfaces.nsIProperties).
                          get("ProfD", Components.interfaces.nsILocalFile);
    file.append("microformats");
    
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

    if (options) {
      return;
    }

    
    window.addEventListener("load", function(e)   { Operator.startup(); }, false);
    window.addEventListener("unload", function(e) { Operator.shutdown(); }, false);
    window.addEventListener("operator-sidebar-load", Operator_Sidebar.processSemanticData, false, true);
    
  },
  startup: function startup()
  {
    
    var i,j;
    this.prefBranch = Components.classes["@mozilla.org/preferences-service;1"].
                                 getService(Components.interfaces.nsIPrefService).
                                 getBranch("extensions.operator.");
    var newcount = { value: 0 };
    try {
      this.prefBranch.getChildList("", newcount);
    } catch (ex) {}
    /* that nine is an attempt to handle the 0.5 to 0.6 failure case and fix it */
    if ((newcount.value === 0) || (newcount.value == 9) || (newcount.value == 10)) {
      var action;
      /* check for old prefs and migrate them if they are there */
      var prefBranchOld = Components.classes["@mozilla.org/preferences-service;1"].
                                     getService(Components.interfaces.nsIPrefService).
                                     getBranch("extensions.operator_toolbar.");
      var oldcount = { value: 0 };
      try {
        var prefArray = prefBranchOld.getChildList("", oldcount);
      } catch (ex) {
      }
      if (oldcount.value > 0) {
        try {
        for (i = 0; i < oldcount.value; i++) {
          switch (prefBranchOld.getPrefType(prefArray[i])) {
            case Components.interfaces.nsIPrefBranch.PREF_STRING:
              this.prefBranch.setCharPref(prefArray[i], prefBranchOld.getCharPref(prefArray[i]));
              break;
            case Components.interfaces.nsIPrefBranch.PREF_INT:
              this.prefBranch.setIntPref(prefArray[i], prefBranchOld.getIntPref(prefArray[i]));
              break;
            case Components.interfaces.nsIPrefBranch.PREF_BOOL:
              this.prefBranch.setBoolPref(prefArray[i], prefBranchOld.getBoolPref(prefArray[i]));
              break;
          }
        }
        } catch (ex) {
        }
        prefBranchOld.deleteBranch("");
      } else {
        /* Set initial prefs. We can't do this in an extension prefs.js 
           because we want to cerate default toolbar items that might get
           deleted */
        this.prefBranch.setIntPref("view", 1);
        this.prefBranch.setBoolPref("useDescriptiveNames", false);
        this.prefBranch.setBoolPref("debug", false);
        this.prefBranch.setBoolPref("statusbar", false);
        this.prefBranch.setBoolPref("highlightMicroformats", false);
        this.prefBranch.setBoolPref("upcomingOrgBugFixed", false);
        this.prefBranch.setBoolPref("removeDuplicates", true);
        this.prefBranch.setBoolPref("observeDOMAttrModified", false);
        j = 1;
        for (i in Microformats)
        {
          if (Microformats[i].description) {
            this.prefBranch.setCharPref("microformat" + (j), i);
            j++;
          }
        }
        i = 1;
        var microformat;
        var handler;
        do {
          try {
            action = this.languageBundle.GetStringFromName("action" + i);
            microformat = this.languageBundle.GetStringFromName("action" + i + ".microformat");
            handler = this.languageBundle.GetStringFromName("action" + i + ".handler");
            this.prefBranch.setCharPref("action" + i, action);
            this.prefBranch.setCharPref("action" + i + ".microformat", microformat);
            this.prefBranch.setCharPref("action" + i + ".handler", handler);
            i++;
          } catch (ex) {
            break;
          }
        }
        while(1);
      }
    }
    try {
      var displayAllHandlers = this.prefBranch.getBoolPref("displayAllHandlers");
      i = 1;
      do {
        try {
          action = Operator.prefBranch.getComplexValue("action" + i, Components.interfaces.nsISupportsString).data;
          microformat = Operator.prefBranch.getCharPref("action" + i + ".microformat");
          handler = Operator.prefBranch.getCharPref("action" + i + ".handler");
          
          switch (microformat) {
            case "hCalendar":
              switch (handler) {
                case "yahoo":
                case "google":
                  Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_calendar");
                  break;
                case "export":
                  Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_icalendar");
                  break;
              }
              break; 
            case "hCard":
              switch (handler) {
                case "yahoo":
                  Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_contact");
                  break;
                case "export":
                  Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_vcard");
                  break;
              }
              break; 
            case "hResume":
            case "hReview":
              if ((handler == "google") || (handler == "yahoo")) {
                Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_search");
              }
              break;
            case "tag":
              if ((handler == "delicious") || (handler == "flickr") ||
                  (handler == "upcoming") || (handler == "technorati") ||
                  (handler == "yedda") || (handler == "magnolia")) {
                Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_search_tags");
              }
              break; 
            case "xfolk":
              if ((handler == "delicious") || (handler == "magnolia")) {
                Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_bookmark");
              }
              break;
          }
        } catch (ex) {
          break;
        }
        i++;
      } while (1);
      for (i in Microformats) {
        try {
          Operator.prefBranch.clearUserPref(i + ".defaultHandler");
        } catch (ex) {}
      }

      Operator.prefBranch.clearUserPref("displayAllHandlers");

    } catch (ex) {}
    
    this.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefBranch.addObserver("", this, false);

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
      this.upcomingOrgBugFixed = this.prefBranch.getBoolPref("upcomingOrgBugFixed");
    } catch (ex) {}
    try {
      this.view = this.prefBranch.getIntPref("view");
    } catch (ex) {}
    try {
      var statusbar = this.prefBranch.getBoolPref("statusbar");
      if (statusbar) {
        Operator_Statusbar.show();
      } else {
        Operator_Statusbar.hide();
      }
    } catch (ex) {
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
    if (data == "upcomingOrgBugFixed") {
      this.upcomingOrgBugFixed = this.prefBranch.getBoolPref("upcomingOrgBugFixed");
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
        Operator_Statusbar.show();
      } else {
        Operator_Statusbar.hide();
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
      if (url = ufJSActions.actions[semanticAction].doAction(semanticObject, semanticObjectType)) {
        openUILink(url, event);
      }
    };
  },
  actionAllCallbackGenerator: function actionAllCallbackGenerator(semanticArrays, semanticAction)
  {
    return function(event) {
      var url;
      if (url = ufJSActions.actions[semanticAction].doActionAll(semanticArrays)) {
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
          if (url = ufJSActions.actions[semanticAction].doAction(semanticObject, semanticObjectType)) {
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
          if (url = ufJSActions.actions[semanticAction].doActionAll(semanticArrays)) {
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
    if ((items.length > 1) && Microformats[semanticObjectType].sort) {
      items = sorted_items;
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
              tempMenu.store_onpopupshowing = this.popupShowing(items[j].object, semanticObjectType, semanticAction);
              tempMenu.addEventListener("popupshowing", tempMenu.store_onpopupshowing, false);
            } else {
              this.attachActions(tempMenu, items[j].object, semanticObjectType, semanticAction);
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
      if (ufJSActions.actions[semanticAction].scope.semantic[semanticObjectType]) {
        if ((ufJSActions.actions[semanticAction].doActionAll) && (itemsadded > 0)) {
          var sep = document.createElement("menuseparator");
          menu.appendChild(sep);
          tempMenu = document.createElement("menuitem");
          tempMenu.label = ufJSActions.actions[semanticAction].descriptionAll;
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
  popupShowing: function popupShowing(semanticObject, semanticObjectType, semanticAction)
  {
    return function(event) {
      if (event.target.childNodes.length == 0) {
        Operator.attachActions(event.target, semanticObject, semanticObjectType, semanticAction);
      }
    };
  },
  attachActions: function attachActions(parentmenu, semanticObject, semanticObjectType, semanticAction)
  {
    var required;
    var menuitem;
    if (this.view === 0) {
      
      var submenu = parentmenu;
      var k;
      var addedAction = false;
      for (k in ufJSActions.actions) {
        if (!ufJSActions.actions[k].scope.semantic[semanticObjectType]) {
          continue;
        }
        if (ufJSActions.actions[k].scope.semantic[semanticObjectType] != semanticObjectType) {
          required = semanticObject[ufJSActions.actions[k].scope.semantic[semanticObjectType]];
          if (!required) {
            continue;
          }
        }
        if (ufJSActions.actions[k].scope.url) {
          if (!(content.document.location.href.match(ufJSActions.actions[k].scope.url))) {
            continue;
          }
        }
        menuitem = document.createElement("menuitem");
        menuitem.label = ufJSActions.actions[k].description;
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
        menuitem.label = "Debug";
        menuitem.setAttribute("label", menuitem.label);
        menuitem.store_oncommand = this.errorCallbackGenerator(semanticObject, semanticObjectType);
        menuitem.addEventListener("command", menuitem.store_oncommand, true);
        submenu.appendChild(menuitem);
      }
    } else {
      parentmenu.store_oncommand = this.actionCallbackGenerator(semanticObject, semanticObjectType, semanticAction);
      parentmenu.addEventListener("command", parentmenu.store_oncommand, true);
      parentmenu.store_onclick = this.clickCallbackGenerator(semanticObject, semanticObjectType, semanticAction);
      parentmenu.addEventListener("click", parentmenu.store_onclick, true);
    }
  },
  buildPopupMenu: function buildPopupMenu(semanticObject, semanticObjectType)
  {
    var menu = document.createElement("menupopup");
    var menuitem;
    var required;
    var k;
    for (k in ufJSActions.actions) {
      if (!ufJSActions.actions[k].scope.semantic[semanticObjectType]) {
        continue;
      }
      if (ufJSActions.actions[k].scope.semantic[semanticObjectType] != semanticObjectType) {
        required = semanticObject[ufJSActions.actions[k].scope.semantic[semanticObjectType]];
        if (!required) {
          continue;
        }
      }
      if (ufJSActions.actions[k].scope.url) {
        if (!(content.document.location.href.match(ufJSActions.actions[k].scope.url))) {
          continue;
        }
      }
      menuitem = document.createElement("menuitem");
      menuitem.label = ufJSActions.actions[k].description;
      menuitem.setAttribute("label", menuitem.label);
      menuitem.addEventListener("command", this.actionCallbackGenerator(semanticObject, semanticObjectType, k), true);
      menuitem.addEventListener("click", this.clickCallbackGenerator(semanticObject, semanticObjectType, k), true);
      menu.appendChild(menuitem);

    }
    if (this.debug) {
      menuitem = document.createElement("menuseparator");
      menu.appendChild(menuitem);
      menuitem = document.createElement("menuitem");
      menuitem.label = "Debug";
      menuitem.setAttribute("label", menuitem.label);
      menuitem.addEventListener("command", this.errorCallbackGenerator(semanticObject, semanticObjectType), true);
      menu.appendChild(menuitem);
    }

    return menu;
  },

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
        actionmenu = Operator.buildPopupMenu(new Microformats[mfNames[i]].mfObject(mfNode), mfNames[i]);
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
  mouseOver: function mouseOver(event) {
    var element = (event.target) ? event.target : event.srcElement;
    var mfNode = Microformats.isMicroformat(element);
    Operator.highlightDOMNode(mfNode);
  },
  processSemanticDataDelayed: function processSemanticDataDelayed(event)
  {
    if (Operator.timerID) {
      window.clearTimeout(Operator.timerID);
    }
    Operator.timerID = window.setTimeout(Operator.processSemanticData, 250);
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
    Operator.processSemanticDataDelayed();
  },
  /* This function compares the strings in two objects to see if they are equal */
  areEqualObjects: function(object1, object2)
  {
    if (object1.__count__ != object2.__count__) {
      return false;
    }
    for (var i in object1) {
      if (!object2[i]) {
        return false;
      }
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
      return false;
    }
    return true;
  },
  debug_alert: function(text)
  {
    if (!Operator.release) {
      window.openDialog("chrome://operator/content/operator_debug.xul","alert","chrome,centerscreen,modal", "Alert", text);
    }
  },
  console_message: function(text, line_number)
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
  lineNumberFromDOMNode: function(node)
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
  error: function(semanticObject, semanticObjectType)
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
        vcfical = ufJSActions.actions.export_vcard.vCard(semanticObject);
      } catch (ex) {}
      X2V = semanticObject.node;
    }
    if (semanticObjectType == "hCalendar") {
      try {
        vcfical = ufJSActions.actions.export_icalendar.iCalendar(semanticObject, true, true);
      } catch (ex) {}
      X2V = semanticObject.node;
    }
    
    var error = {};
    /* XXX TODO Validate needs to be more generic? Or do we only call it in the microformat case? */
    Microformats.parser.validate(semanticObject.node, semanticObjectType, error);

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
  getSemanticData: function(window, semanticArrays)
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
  processSemanticData: function()
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
//          var action = Operator.prefBranch.getComplexValue("action" + i, Components.interfaces.nsISupportsString).data;
          action = Operator.prefBranch.getCharPref("action" + i);
        } catch (ex) {
          break;
        }

        for (j in ufJSActions.actions[action].scope.semantic) {
          if (semanticArrays[j]) {
            var objectArray;
            if (j == "RDFa") {
              /* Fill in objectArray by asking model for property */
              /* We actually need to loop through all RDFa models */
              /* and concatenate into one object array */
              objectArray = semanticArrays[j][0].getObjectsWithProperty(ufJSActions.actions[action].scope.semantic[j]["property"],
                                                                        ufJSActions.actions[action].scope.semantic[j]["defaultNS"]); 
            } else {
              objectArray = semanticArrays[j];
            }
            for (k=0; k < objectArray.length; k++) {
              /* Here we know we have objects that will work with this action */
              /* Create a menu that corresponds to the action? */
              /* Or postpone the creation until we are sure we have the first one? */
              if ((ufJSActions.actions[action].scope.semantic[j] != j) && (j != "RDFa")) {
                if (!objectArray[k][ufJSActions.actions[action].scope.semantic[j]]) {
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
                Operator.attachActions(tempMenu, objectArray[k], j, action);
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
          if ((ufJSActions.actions[action].doActionAll)) {
            var sep = document.createElement("menuseparator");
            menu.appendChild(sep);
            tempMenu = document.createElement("menuitem");
            tempMenu.label = ufJSActions.actions[action].descriptionAll;
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
          tempMenu.label = ufJSActions.actions[action].description;
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
          semanticType = Operator.prefBranch.getCharPref("microformat" + i);
        } catch (ex) {
          break;
        }
        /* If the semantic item is in our array and has items in this documents,
           process it */
        if (semanticType && semanticArrays[semanticType] && semanticArrays[semanticType].length > 0) {
          menu = Operator.buildMenu(semanticArrays[semanticType], semanticType);
          if (menu) {
            var sep = false;
            for (k in ufJSActions.actions) {
              if (ufJSActions.actions[k].scope.semantic[semanticType]) {
                if (ufJSActions.actions[k].doActionAll) {
                  if (!sep) {
                    var sep = document.createElement("menuseparator");
                    menu.appendChild(sep);
                    sep = true;
                  }
                  tempMenu = document.createElement("menuitem");
                  tempMenu.label = ufJSActions.actions[k].descriptionAll;
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
            
//            if ((this.useDescriptiveNames) && (Microformats[microformat].description)) {
//              tempItem.label = Microformats[microformat].description;
//            } else {
              tempMenu.label = semanticType;
//            }
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
      var optionsLabel = "Options";
      try {
        optionsLabel = this.languageBundle.GetStringFromName("operatorOptions.label");
      } catch (ex) {
        optionsLabel = "Options";
      }
      tempMenu.setAttribute("label", optionsLabel);
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
  simpleEscape: function(s)
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
