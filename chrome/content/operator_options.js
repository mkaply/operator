/*extern Components, sizeToContent, Operator, ufJSActions */

var Operator_Options = {
  dataformats: [],
  prefBranch: null,
  enabledActions: [],
  saveOptions: function() 
  {
    var i;
    this.prefBranch.setBoolPref("batchPrefChanges", true);
    //this.checkAndSetIntPref("view", document.getElementById("view").value);
    this.checkAndSetBoolPref("useDescriptiveNames", document.getElementById("useDescriptiveNames").checked);
    this.checkAndSetBoolPref("useShortDescriptions", document.getElementById("useShortDescriptions").checked);
    this.checkAndSetBoolPref("debug", document.getElementById("debug").checked);
    this.checkAndSetBoolPref("statusbar", document.getElementById("statusbar").checked);
    this.checkAndSetBoolPref("urlbar", document.getElementById("urlbar").checked);
    this.checkAndSetBoolPref("autohide", document.getElementById("autohide").checked);
    this.checkAndSetBoolPref("highlightMicroformats", document.getElementById("highlightMicroformats").checked);
    this.checkAndSetBoolPref("removeDuplicates", document.getElementById("removeDuplicates").checked);
    this.checkAndSetBoolPref("showHidden", document.getElementById("showHidden").checked);
    this.checkAndSetBoolPref("observeDOMAttrModified", document.getElementById("observeDOMAttrModified").checked);
    var dataformats = document.getElementById("dataformats");
    for (i=0; i < dataformats.getRowCount(); i++) {
      var label = dataformats.getItemAtIndex(i).label;
      this.checkAndSetCharPref("dataformat" + (i+1), label); 
    }
    
    var haveMorePrefs = true;
    do {
	  if (this.prefBranch.prefHasUserValue("dataformat" + (i+1))) {
        try {
          this.prefBranch.clearUserPref("dataformat" + (i+1));
        }
        catch (ex) {}
	  } else {
		haveMorePrefs = false;
	  }
      i++;
    }
    while (haveMorePrefs);
    
    //var actions = document.getElementById("actions");
    //for (i=0; i < actions.getRowCount(); i++) {
    //  this.checkAndSetCharPref("action" + (i+1), actions.getItemAtIndex(i).value);
    //}
    //
    //haveMorePrefs = true;
    //do {
    //  try {
    //    this.prefBranch.clearUserPref("action" + (i+1));
    //  }
    //  catch (ex)
    //  {
    //    haveMorePrefs = false;
    //  }
    //  i++;
    //}
    //while (haveMorePrefs);


    var actionsPref = [];
    var enableactions = document.getElementById("enableactions");
	var checkboxes = enableactions.getElementsByTagName("checkbox");
	for (let i =0; i < checkboxes.length; i++) {
	  if (!checkboxes[i].checked) {
		actionsPref.push(checkboxes[i].id);
	  }
	}

	this.prefBranch.setCharPref("actions.disabled", actionsPref.join(","));

    this.prefBranch.setBoolPref("batchPrefChanges", false);
  },

  checkAndSetIntPref: function(pref, value)
  {
    if (Operator[pref] != value) {
      this.prefBranch.setIntPref(pref, value);
    }
  },
  checkAndSetBoolPref: function(pref, value)
  {
    if (Operator[pref] != value) {
      this.prefBranch.setBoolPref(pref, value);
    }
  },
  checkAndSetCharPref: function(pref, value)
  {
    var prefValue;
    try {
      prefValue = this.prefBranch.getCharPref(pref);
    } catch (ex)
    {
      prefValue = undefined;
    }
    if (prefValue != value) {
      this.prefBranch.setCharPref(pref, value);
    }
  },

  onPageLoad: function() 
  {
    for (i in Microformats) {
      Operator_Options.dataformats.push(i);
    }
    if ((typeof(RDFa) != "undefined") || (typeof(eRDF) != "undefined")) {
      Operator_Options.dataformats.push("RDF");
    }


    this.prefBranch = Components.classes["@mozilla.org/preferences-service;1"].
                                 getService(Components.interfaces.nsIPrefService).
                                 getBranch("extensions.operator.");


    //var view = 0;
    //try {
    //  view = this.prefBranch.getIntPref("view");
    //} catch (ex) {
    //  view = Operator.view;
    //}
    //document.getElementById("view").value = view;

    var useDescriptiveNames;
    try {
      useDescriptiveNames = this.prefBranch.getBoolPref("useDescriptiveNames");
    } catch (ex) {
      useDescriptiveNames = Operator.useDescriptiveNames;
    }
    document.getElementById("useDescriptiveNames").checked = useDescriptiveNames;

    var useShortDescriptions;
    try {
      useShortDescriptions = this.prefBranch.getBoolPref("useShortDescriptions");
    } catch (ex) {
      useShortDescriptions = Operator.useShortDescriptions;
    }
    document.getElementById("useShortDescriptions").checked = useShortDescriptions;

    var debug;
    try {
      debug = this.prefBranch.getBoolPref("debug");
    } catch (ex) {
      debug = Operator.debug;
    }
    document.getElementById("debug").checked = debug;

    var statusbar;
    try {
      statusbar = this.prefBranch.getBoolPref("statusbar");
    } catch (ex) {
      statusbar = Operator.statusbar;
    }
    document.getElementById("statusbar").checked = statusbar;
    
    var urlbar;
    try {
      urlbar = this.prefBranch.getBoolPref("urlbar");
    } catch (ex) {
      urlbar = Operator.urlbar;
    }
    document.getElementById("urlbar").checked = urlbar;

    var autohide;
    try {
      autohide = this.prefBranch.getBoolPref("autohide");
    } catch (ex) {
      urlbar = Operator.autohide;
    }
    document.getElementById("autohide").checked = autohide;

    var highlightMicroformats;
    try {
      highlightMicroformats = this.prefBranch.getBoolPref("highlightMicroformats");
    } catch (ex) {
      highlightMicroformats = Operator.highlightMicroformats;
    }
    document.getElementById("highlightMicroformats").checked = highlightMicroformats;

    var removeDuplicates;
    try {
      removeDuplicates = this.prefBranch.getBoolPref("removeDuplicates");
    } catch (ex) {
      removeDuplicates = Operator.removeDuplicates;
    }
    document.getElementById("removeDuplicates").checked = removeDuplicates;

    var showHidden;
    try {
      showHidden = this.prefBranch.getBoolPref("showHidden");
    } catch (ex) {
      showHidden = Operator.showHidden;
    }
    document.getElementById("showHidden").checked = showHidden;

    var observeDOMAttrModified;
    try {
      observeDOMAttrModified = this.prefBranch.getBoolPref("observeDOMAttrModified");
    } catch (ex) {
      observeDOMAttrModified = Operator.observeDOMAttrModified
    }
    document.getElementById("observeDOMAttrModified").checked = observeDOMAttrModified;
  
    var i=1;
    var dataformats = document.getElementById("dataformats");
    var dataformat, handler;
    do {
      try {
        dataformat = this.prefBranch.getCharPref("dataformat" + i);
      } catch (ex) {
        break;
      }
      if (dataformat) {
        dataformats.appendItem(dataformat);
      }
      i++;
    } while (1);
  
    i=1;
    //var actions = document.getElementById("actions");
    //var action;
    //do {
    //  try {
    //    action = this.prefBranch.getCharPref("action" + i );
    //  } catch (ex) {
    //    break;
    //  }
    //  if (Operator.actions[action]) {
    //    var listitemText;
    //    if (Operator.actions[action].doAction) {
    //      if (Operator.actions[action].description) {
    //        listitemText = Operator.actions[action].description;
    //      }
    //    } else if (Operator.actions[action].doActionAll) {
    //      if (Operator.actions[action].descriptionAll) {
    //        listitemText = Operator.actions[action].descriptionAll;
    //      }
    //    }
    //    if (!listitemText) {
    //      listitemText = action;
    //    }
    //    actions.appendItem(listitemText, action);
    //  }
    //  i++;
    //} while (1);

    var userscripts = document.getElementById("userscripts");
    var file = Components.classes["@mozilla.org/file/directory_service;1"].
                          getService(Components.interfaces.nsIProperties).
                          get("ProfD", Components.interfaces.nsILocalFile);
    file.append("operator");
    
    if (file.exists() && file.isDirectory()) {
      var e = file.directoryEntries;
      while (e.hasMoreElements()) {
        var f = e.getNext().QueryInterface(Components.interfaces.nsIFile);
        var splitpath = f.path.split(".");
        if ((splitpath[splitpath.length-1] == "js") || (splitpath[splitpath.length-1] == "xsl")) {
          var fileHandler = Components.classes["@mozilla.org/network/io-service;1"].
                                       getService(Components.interfaces.nsIIOService).
                                       getProtocolHandler("file").
                                       QueryInterface(Components.interfaces.nsIFileProtocolHandler);
          userscripts.appendItem(f.leafName, "");
        }
      }
    }
    var enableactions = document.getElementById("enableactions");
    for (i in Operator.actions)
    {
	  var richlistitem = document.createElement("richlistitem");
	  richlistitem.setAttribute("align", "center");
	  var checkbox = document.createElement("checkbox");
	  checkbox.setAttribute("id", i);
	  if (!Operator.actions[i].disabled) {
		checkbox.setAttribute("checked", "true");
	  }
	  richlistitem.appendChild(checkbox);
	  var label = document.createElement("label");
	  label.setAttribute("value", Operator.actions[i].description);
	  richlistitem.appendChild(label);
	  enableactions.appendChild(richlistitem);
    }


    var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]  
                            .getService(Components.interfaces.nsIXULAppInfo);
    if (appInfo.ID == "songbird@songbirdnest.com") {
      document.getElementById("urlbar").disabled = true;
      document.getElementById("autohide").disabled = true;
    }
  },

  doDataformatEnabling: function()
  {
    //if (document.getElementById('view').value == "1") {
    //  document.getElementById('useDescriptiveNames').setAttribute('disabled', 'true');
    //  document.getElementById('useShortDescriptions').setAttribute('disabled', 'false');
    //} else {
    //  document.getElementById('useDescriptiveNames').setAttribute('disabled', 'false');
    //  document.getElementById('useShortDescriptions').setAttribute('disabled', 'true');
    //}
  },
  
  onNewDataformat: function()
  {
    window.openDialog("chrome://operator/content/operator_options_dataformat.xul","newdataformat","chrome,centerscreen,modal");
  },
  
  onEditDataformat: function()
  {
    window.openDialog("chrome://operator/content/operator_options_dataformat.xul","editdataformat","chrome,centerscreen,modal");
  },
  
  onNewAction: function()
  {
    window.openDialog("chrome://operator/content/operator_options_action.xul","newaction","chrome,centerscreen,modal");
  },
  
  onEditAction: function()
  {
    window.openDialog("chrome://operator/content/operator_options_action.xul","editaction","chrome,centerscreen,modal");
  },
  
  disableNewDataformat: function()
  {
	var rowCount = document.getElementById("dataformats").getRowCount();
	if ((rowCount !=0) && (rowCount == Operator_Options.dataformats.length)) {
	  return true;
	}
	return false;
  },
  
  disableNewAction: function()
  {
    return (document.getElementById("actions").getRowCount() == Operator.actions.length);
  },
  
  /* dataformat dialog */
  
  
  onDataformatLoad: function()
  {
    var dataformat = null;
    var selectedItem = null;
    var edit = false;
    var dataformats = window.opener.document.getElementById("dataformats");
    if (window.name == 'editdataformat') {
      edit = true;
      dataformat = dataformats.selectedItem.label;
    }
  
    var dataformatmenu = document.getElementById("dataformats");
    var i, j;
    var add;
    
    for (i in Microformats) {
      Operator_Options.dataformats.push(i);
    }
    if ((typeof(RDFa) != "undefined") || (typeof(eRDF) != "undefined")) {
      Operator_Options.dataformats.push("RDF");
    }

    
    
    for (i=0; i< Operator_Options.dataformats.length; i++) {
      add = true;
      /* if it is not already in the list */
      for (j=0; j < dataformats.getRowCount(); j++) {
        var item = dataformats.getItemAtIndex(j);
        if (item.label == Operator_Options.dataformats[i]) {
          add = false;
          break;
        }
      }
      if ((add) || ((Operator_Options.dataformats[i] == dataformat) && (edit))) {
        var menulistitem = dataformatmenu.appendItem(Operator_Options.dataformats[i]);
        menulistitem.minWidth=dataformatmenu.width;
        if (Operator_Options.dataformats[i] == dataformat) {
          selectedItem = menulistitem;
        }
      }
      
    }
  
    if (window.name == 'editdataformat') {
      dataformatmenu.selectedItem = selectedItem;
    } else {
      dataformatmenu.selectedIndex = 0;
    }
    sizeToContent();
  },
  
  onDataformatOK: function()
  {
    var dataformats = window.opener.document.getElementById("dataformats");
    var dataformat = document.getElementById("dataformats").selectedItem.label;
  
    if (window.name == 'newdataformat') {
      var listitem = dataformats.appendItem(dataformat);
    } else {
      var selectedItem = dataformats.selectedItem;
      selectedItem.label = dataformat;
    }
  },
  
  
  /* Action dialog */
  
  onActionLoad: function()
  {
    var action = null;
    var selectedItem = null;
    var edit = false;
    var actions = window.opener.document.getElementById("actions");
    if (window.name == 'editaction') {
      edit = true;
      action = actions.selectedItem.value;
    }
  
    var actionmenu = document.getElementById("actions");
    var i, j;
    var add;
    for (i in Operator.actions)
    {
      add = true;
      /* if it is not already in the list */
      for (j=0; j < actions.getRowCount(); j++) {
        var item = actions.getItemAtIndex(j);
        if (item.value == i) {
          add = false;
          break;
        }
      }
      if ((add) || ((i == action) && (edit))) {
        var listitemText;
        if (Operator.actions[i].doAction) {
          if (Operator.actions[i].description) {
            listitemText = Operator.actions[i].description;
          }
        } else if (Operator.actions[i].doActionAll) {
          if (Operator.actions[i].descriptionAll) {
            listitemText = Operator.actions[i].descriptionAll;
          }
        }
        if (!listitemText) {
          listitemText = i;
        }
        var menulistitem = actionmenu.appendItem(listitemText, i);
        menulistitem.minWidth=actionmenu.width;
        if (i == action) {
          selectedItem = menulistitem;
        }
      }
    }
  
    if (window.name == 'editaction') {
      actionmenu.selectedItem = selectedItem;
    } else {
      actionmenu.selectedIndex = 0;
    }
    sizeToContent();
  },
  
  onActionOK: function()
  {
    var actions = window.opener.document.getElementById("actions");
  
    if (window.name == 'newaction') {
      var listitem = actions.appendItem(document.getElementById("actions").selectedItem.label, document.getElementById("actions").selectedItem.value);
    } else {
      var selectedItem = actions.selectedItem;
      selectedItem.label = document.getElementById("actions").selectedItem.label;
      selectedItem.value = document.getElementById("actions").selectedItem.value;
    }
  },
  
  onNewUserScript: function()
  {
    try {
      var nsIFilePicker = Components.interfaces.nsIFilePicker;
      var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      fp.init(window, "Choose File...", nsIFilePicker.modeOpen);
      fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterText |
                       nsIFilePicker.filterAll | nsIFilePicker.filterImages | nsIFilePicker.filterXML);
  
      if (fp.show() == nsIFilePicker.returnOK && fp.fileURL.spec && fp.fileURL.spec.length > 0) {
        var dest = Components.classes["@mozilla.org/file/directory_service;1"].
                              getService(Components.interfaces.nsIProperties).
                              get("ProfD", Components.interfaces.nsILocalFile);
        dest.append("operator");
        /* check if dataformats exists and if not, create it */
        try {
          var destfile = dest.clone();
          destfile.append(fp.file.leafName);
          if (destfile.exists()) {
            var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
                                           getService(Components.interfaces.nsIPromptService);
            var sure = promptService.confirm(window, "", fp.file.leafName + " already exists. Do you want to replace it?");
            if (sure) {
              destfile.remove(false);
            } else {
              return;
            }
          } else {
            document.getElementById('userscripts').appendItem(fp.file.leafName, "");
          }
          fp.file.copyTo(dest, "");
        } catch (ex) {
        }
      }
    }
    catch(ex) {
    }
  },
  
  onDeleteUserScript: function()
  {
    var listbox = document.getElementById('userscripts');
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
                                   getService(Components.interfaces.nsIPromptService);
    var sure = promptService.confirm(window, "", "This will remove " + listbox.selectedItem.label);
    if (sure) {
      var dest = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("ProfD", Components.interfaces.nsILocalFile);
      dest.append("operator");
      dest.append(listbox.selectedItem.label);
      try {
        dest.remove(true);
      } catch(ex) {}
      return true;
    }
    return false;
  }
};


