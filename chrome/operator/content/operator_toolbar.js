/*extern Microformats, Operator, Components, content */

var Operator_Toolbar = {
  create: function()
  {
    var button, action;
    var i;
    var toolbar = document.getElementById("operator-toolbar");
    var toolbarbuttons = toolbar.getElementsByTagName("toolbarbutton");
    for(i=toolbarbuttons.length - 1; i>=0; i--) {
      if (toolbarbuttons[i].id != "operator-options") {
        toolbar.removeChild(toolbar.childNodes[i]);
      }
    }
    /* Actions */
    if (Operator.view == 1) {
      /* Enumerate through all the actions (eventually all prefed actions */
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
        button = document.createElement("toolbarbutton");
        button.setAttribute("disabled", "true");
        if (Operator.useShortDescriptions && Operator.actions[action].shortDescription) {
          button.label = Operator.actions[action].shortDescription;
          button.setAttribute("origlabel", Operator.actions[action].shortDescription);
        } else {
          button.label = Operator.actions[action].description;
          button.setAttribute("origlabel", Operator.actions[action].description);
        }
        button.setAttribute("label", button.label);
        button.setAttribute("type", "menu");
        button.addEventListener("mouseover", Operator_Toolbar.mouseOver, false);

        if (Operator.actions[action].icon) {
          button.style.listStyleImage = "url('" + Operator.actions[action].icon + "')";
        } else {
          button.style.listStyleImage = "url('chrome://operator/content/other.png')";
        }
        button.id = "operator-" + action + "-toolbar-button";
        toolbar.insertBefore(button, document.getElementById("operator-spring"));
        var node = document.getAnonymousElementByAttribute(button, "class", "toolbarbutton-icon");
        node.style.opacity = 0.3;
        i++;
      } while (1)
    }

    if (Operator.view == 0) {
      var semanticType;
      i = 1;
      do {
        try {
          semanticType = Operator.prefBranch.getCharPref("dataformat" + i);
        } catch (ex) {
          break;
        }
        if (semanticType) {
          button = document.createElement("toolbarbutton");
          button.setAttribute("disabled", "true");
          if (Operator.useDescriptiveNames) {
            if (Microformats[semanticType] && Microformats[semanticType].description) {
              button.label = Microformats[semanticType].description;
            } else if (semanticType == "RDF") {
              button.label = Operator.languageBundle.GetStringFromName("rdf.description");
            }
          }
          if (!button.label) {
            button.label = semanticType;
          }

          button.setAttribute("label", button.label);
          button.setAttribute("origlabel", button.label);

          button.setAttribute("type", "menu");
          button.addEventListener("mouseover", Operator_Toolbar.mouseOver, false);

          if ((Microformats[semanticType]) && (Microformats[semanticType].icon)) {
            button.style.listStyleImage = "url('" + Microformats[semanticType].icon + "')";
          } else {
            button.style.listStyleImage = "url('chrome://operator/content/other.png')";
          }

          button.id = "operator-" + semanticType + "-toolbar-button";
          toolbar.insertBefore(button, document.getElementById("operator-spring"));
          var node = document.getAnonymousElementByAttribute(button, "class", "toolbarbutton-icon");
          node.style.opacity = 0.3;
        }
        i++;
      } while (1);
    }


    return;
    
  },

  addButtonMenu: function(menu, semanticObjectType, semanticAction)
  {
    var useActions = (Operator.view == 1);
    var button;
    var newmenu = menu.cloneNode(true);
    var menuitems = menu.getElementsByTagName("menuitem");
    var newmenuitems = newmenu.getElementsByTagName("menuitem");
    var numitems = 0;
    for(var i=0; i < menuitems.length; i++) {
      if (menuitems[i].store_oncommand) {
        newmenuitems[i].addEventListener("command", menuitems[i].store_oncommand, true);
      }
      if (menuitems[i].store_onclick) {
        newmenuitems[i].addEventListener("click", menuitems[i].store_onclick, true);
      }
      if (menuitems[i].store_onDOMMenuItemActive) {
        newmenuitems[i].addEventListener("DOMMenuItemActive", menuitems[i].store_onDOMMenuItemActive, true);
        numitems++;
      }
    }
    var menus = menu.getElementsByTagName("menu");
    var newmenus = newmenu.getElementsByTagName("menu");
    for(var i=0; i < menus.length; i++) {
      if (menus[i].store_onDOMMenuItemActive) {
        newmenus[i].addEventListener("DOMMenuItemActive", menus[i].store_onDOMMenuItemActive, true);
        numitems++;
      }
      if (menus[i].store_onpopupshowing) {
        newmenus[i].addEventListener("popupshowing", menus[i].store_onpopupshowing, true);
      }
    }

    if (semanticAction) {
      button = document.getElementById("operator-" + semanticAction + "-toolbar-button");
    } else {
      button = document.getElementById("operator-" + semanticObjectType + "-toolbar-button");
    }
    if (menu.error === true) {
      button.style.fontWeight = "bold";
    }
    for(i=button.childNodes.length - 1; i>=0; i--) {
      button.removeChild(button.childNodes.item(i));
    }
  
    button.appendChild(newmenu);
    if (newmenu.childNodes.length > 0) {
      if (useActions) {
        button.label = button.getAttribute("origlabel");
      } else {
        button.label = button.getAttribute("origlabel") + " (" + numitems + ")";
      }
      button.setAttribute("label", button.label);
      button.numitems = numitems;
    }
  },
  disable: function()
  {
    var toolbar = document.getElementById("operator-toolbar");
    var toolbarbuttons = toolbar.getElementsByTagName("toolbarbutton");
    for(var i=0; i < toolbarbuttons.length; i++) {
      if (toolbarbuttons[i].id != "operator-options") {
        toolbarbuttons[i].numitems = 0;
        toolbarbuttons[i].setAttribute("disabled", "true");
        var node = document.getAnonymousElementByAttribute(toolbarbuttons[i], "class", "toolbarbutton-icon");
        node.style.opacity = 0.3;
      }
    }
  },
  clearPopups: function()
  {
    var toolbar = document.getElementById("operator-toolbar");
    var toolbarbuttons = toolbar.getElementsByTagName("toolbarbutton");
    for(var i=0; i < toolbarbuttons.length; i++) {
      if (toolbarbuttons[i].id != "operator-options") {
        toolbarbuttons[i].label = toolbarbuttons[i].getAttribute("origlabel");
        toolbarbuttons[i].setAttribute("label", toolbarbuttons[i].label);
        toolbarbuttons[i].style.fontWeight = "normal";
      }
    }
  },
  enable: function()
  {
    var toolbar = document.getElementById("operator-toolbar");
    var toolbarbuttons = toolbar.getElementsByTagName("toolbarbutton");
    var classes;
    for(var i=0; i < toolbarbuttons.length; i++) {
      if (toolbarbuttons[i].id != "operator-options") {
        if (toolbarbuttons[i].numitems > 0) {
          toolbarbuttons[i].setAttribute("disabled", "false");
          var node = document.getAnonymousElementByAttribute(toolbarbuttons[i], "class", "toolbarbutton-icon");
          node.style.opacity = 0.99;
        }
      }
    }

  },
  mouseOver: function(event)
  {
    if ((!event.originalTarget.open) && (!event.originalTarget.disabled)) {
      var toolbarbuttons = event.originalTarget.parentNode.getElementsByTagName("toolbarbutton");
      for(var i=0; i<toolbarbuttons.length; i++)
      {
        if (toolbarbuttons[i].open && (toolbarbuttons[i] != event.originalTarget)) {
          toolbarbuttons[i].open = false;
          event.originalTarget.open = true;
          break;
        }
      }
    }
  },
  isVisible: function()
  {
    return !document.getElementById("operator-toolbar").collapsed;
  },
  hide: function()
  {
    document.getElementById("operator-toolbar").collapsed = true;
  },
  show: function()
  {
    document.getElementById("operator-toolbar").collapsed = false;
  }
};

