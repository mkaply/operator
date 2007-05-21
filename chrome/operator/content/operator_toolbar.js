/*extern Microformats, Operator, Components, content */

var Operator_Toolbar = {
  create: function()
  {
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
        button.label = ufJSActions.actions[action].description;
        button.setAttribute("label", button.label);
        button.setAttribute("origlabel", ufJSActions.actions[action].description);
        button.setAttribute("type", "menu");
        button.addEventListener("mouseover", Operator_Toolbar.mouseOver, false);

        if (ufJSActions.actions[action].icon) {
          button.style.listStyleImage = "url('" + ufJSActions.actions[action].icon + "')";
        } else {
          button.style.listStyleImage = "url('chrome://operator/content/other.png')";
        }
        button.id = "operator-" + action + "-toolbar-button";
        toolbar.insertBefore(button, document.getElementById("operator-spring"));
        var node = document.getAnonymousElementByAttribute(button, "class", "toolbarbutton-icon");
        node.style.opacity = 0.3;
        node.style.width = "16px";
        node.style.height = "16px";
        i++;
      } while (1)
    }

    if (Operator.view == 0) {
      var semanticType;
      i = 1;
      do {
        try {
          semanticType = Operator.prefBranch.getCharPref("microformat" + i);
        } catch (ex) {
          break;
        }
        if (semanticType) {
          button = document.createElement("toolbarbutton");
          button.setAttribute("disabled", "true");
          if ((Operator.useDescriptiveNames) && (Microformats[semanticType]) && (Microformats[semanticType].description)) {
            button.label = Microformats[semanticType].description;
          } else {
            button.label =  semanticType;
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
          node.style.width = "16px";
          node.style.height = "16px";
        }
        i++;
      } while (1);
    }


    return;
    
    
    var useActions = (Operator.view == 1);
    
    var microformat;
    var button;
    var handler;
    var popup;
    if (useActions) {
      i = 1;
      do {
        var action;
        try {
          action = Operator.prefBranch.getComplexValue("action" + i, Components.interfaces.nsISupportsString).data;
          microformat = Operator.prefBranch.getCharPref("action" + i + ".microformat");
          handler = Operator.prefBranch.getCharPref("action" + i + ".handler");
        } catch (ex) {
          break;
        }
        if ((action) && (microformat) && (handler)) {
          if (Microformats[microformat]) {
            button = document.createElement("toolbarbutton");
            button.setAttribute("disabled", "true");
            button.label = action;
            button.setAttribute("label", button.label);
            button.setAttribute("origlabel", action);
            button.setAttribute("type", "menu");
            button.addEventListener("mouseover", Operator_Toolbar.mouseOver, false);

            if ((ufJSActions.actions[handler].scope.semantic[microformat]) && (ufJSActions.actions[handler].icon)) {
              button.style.listStyleImage = "url('" + ufJSActions.actions[handler].icon + "')";
            } else {
              if (Microformats[microformat].icon) {
                button.style.listStyleImage = "url('" + Microformats[microformat].icon + "')";
              } else {
                button.style.listStyleImage = "url('chrome://operator/content/other.png')";
              }
            }
            button.id = "operator-" + microformat + "-" + handler + "-toolbar-button";
            toolbar.insertBefore(button, document.getElementById("operator-spring"));
            var node = document.getAnonymousElementByAttribute(button, "class", "toolbarbutton-icon");
            node.style.opacity = 0.3;
            node.style.width = "16px";
            node.style.height = "16px";
          }
        } else {
          break;
        }
        i++;
      } while (1);

    } else {
      i = 1;
      do {
        try {
          microformat = Operator.prefBranch.getCharPref("microformat" + i);
        } catch (ex) {
          break;
        }
        if (microformat) {
          if (Microformats[microformat]) {
            button = document.createElement("toolbarbutton");
            button.setAttribute("disabled", "true");
            if ((Operator.useDescriptiveNames) && (Microformats[microformat].description)) {
              button.label = Microformats[microformat].description;
            } else {
              button.label =  microformat;
            }
            button.setAttribute("label", button.label);
            button.setAttribute("origlabel", button.label);

            button.setAttribute("type", "menu");
            button.addEventListener("mouseover", Operator_Toolbar.mouseOver, false);

            if (Microformats[microformat].icon) {
              button.style.listStyleImage = "url('" + Microformats[microformat].icon + "')";
            } else {
              button.style.listStyleImage = "url('chrome://operator/content/other.png')";
            }

            button.id = "operator-" + microformat + "-toolbar-button";
            toolbar.insertBefore(button, document.getElementById("operator-spring"));
            var node = document.getAnonymousElementByAttribute(button, "class", "toolbarbutton-icon");
            node.style.opacity = 0.3;
            node.style.width = "16px";
            node.style.height = "16px";
          }
        } else {
          break;
        }
        i++;
      } while (1);
    }
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
        node.style.width = "16px";
        node.style.height = "16px";
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
          node.style.opacity = 1.0;
          node.style.width = "16px";
          node.style.height = "16px";
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
  isHidden: function()
  {
    if (document.getElementById("operator-toolbar")) {
      return false;
    }
    return true;
  },
  isVisible: function()
  {
    if (document.getElementById("operator-toolbar")) {
      return true;
    }
    return false;
  }
};

