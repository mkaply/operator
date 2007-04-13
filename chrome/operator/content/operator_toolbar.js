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
          if (ufJSParser.microformats[microformat]) {
            button = document.createElement("toolbarbutton");
            button.setAttribute("disabled", "true");
            button.label = action;
            button.setAttribute("label", button.label);
            button.setAttribute("origlabel", action);
            button.setAttribute("type", "menu");
            button.addEventListener("mouseover", Operator_Toolbar.mouseOver, false);

            if ((ufJSActions.actions[handler].scope.microformats[microformat]) && (ufJSActions.actions[handler].icon)) {
              button.style.listStyleImage = "url('" + ufJSActions.actions[handler].icon + "')";
            } else {
              if (ufJSParser.microformats[microformat].icon) {
                button.style.listStyleImage = "url('" + ufJSParser.microformats[microformat].icon + "')";
              } else {
                button.style.listStyleImage = "url('chrome://operator/content/other.png')";
              }
            }
            button.id = "microformats-" + microformat + "-" + handler + "-toolbar-button";
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
          if (ufJSParser.microformats[microformat]) {
            button = document.createElement("toolbarbutton");
            button.setAttribute("disabled", "true");
            if ((Operator.useDescriptiveNames) && (ufJSParser.microformats[microformat].description)) {
              button.label = ufJSParser.microformats[microformat].description;
            } else {
              button.label =  microformat;
            }
            button.setAttribute("label", button.label);
            button.setAttribute("origlabel", button.label);

            button.setAttribute("type", "menu");
            button.addEventListener("mouseover", Operator_Toolbar.mouseOver, false);

            if (ufJSParser.microformats[microformat].icon) {
              button.style.listStyleImage = "url('" + ufJSParser.microformats[microformat].icon + "')";
            } else {
              button.style.listStyleImage = "url('chrome://operator/content/other.png')";
            }

            button.id = "microformats-" + microformat + "-toolbar-button";
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

  addButtonMenu: function(menu, microformat, handler)
  {
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

    if (handler) {
      button = document.getElementById("microformats-" + microformat + "-" + handler + "-toolbar-button");
      newmenu.id = "microformats-" + microformat + "-" + handler + "-menu";
    } else {
      button = document.getElementById("microformats-" + microformat + "-toolbar-button");
      newmenu.id = "microformats-" + microformat + "-menu";
    }
    if (menu.error === true) {
      button.style.fontWeight = "bold";
    }
    for(i=button.childNodes.length - 1; i>=0; i--) {
      button.removeChild(button.childNodes.item(i));
    }
  
    button.appendChild(newmenu);
    if (newmenu.childNodes.length > 0) {
//      button.label = button.getAttribute("origlabel") + " (" + newmenu.childNodes.length + ")";
      button.label = button.getAttribute("origlabel") + " (" + numitems + ")";
      button.setAttribute("label", button.label);
    }
  },
  disable: function()
  {
    var toolbar = document.getElementById("operator-toolbar");
    var toolbarbuttons = toolbar.getElementsByTagName("toolbarbutton");
    for(var i=0; i < toolbarbuttons.length; i++) {
      if (toolbarbuttons[i].id != "operator-options") {
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
        if ((toolbarbuttons[i].label) != toolbarbuttons[i].getAttribute("origlabel")) {
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
  }
};

