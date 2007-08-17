/*extern Microformats, Operator, Components, content */

var Operator_URLbarButton = {
  addPopup: function(menu, clone)
  {
    if (this.isVisible()) {
      if (menu) {
        /* Position popup? */
/*            popup.setAttribute("position", "before_start"); */
        if (clone) {
          var newmenu = menu.cloneNode(true);
          var menuitems = menu.getElementsByTagName("menuitem");
          var newmenuitems = newmenu.getElementsByTagName("menuitem");
          for(var i=0; i < menuitems.length; i++) {
            if (menuitems[i].store_oncommand) {
              newmenuitems[i].addEventListener("command", menuitems[i].store_oncommand, true);
            }
            if (menuitems[i].store_onclick) {
              newmenuitems[i].addEventListener("click", menuitems[i].store_onclick, true);
            }
            if (menuitems[i].store_onDOMMenuItemActive) {
              newmenuitems[i].addEventListener("DOMMenuItemActive", menuitems[i].store_onDOMMenuItemActive, true);
            }
          }
          var menus = menu.getElementsByTagName("menu");
          var newmenus = newmenu.getElementsByTagName("menu");
          for(var i=0; i < menus.length; i++) {
            if (menus[i].store_onpopupshowing) {
              newmenus[i].addEventListener("popupshowing", menus[i].store_onpopupshowing, true);
            }
          }
          var menupops = menu.getElementsByTagName("menupopup");
          var newmenupops = newmenu.getElementsByTagName("menupopup");
          for(var i=0; i < menupops.length; i++) {
            if (menupops[i].store_onpopupshowing) {
              newmenupops[i].addEventListener("popupshowing", menupops[i].store_onpopupshowing, true);
            }
          }
          document.getElementById("operator-urlbar-icon").appendChild(newmenu);
        } else {
          document.getElementById("operator-urlbar-icon").appendChild(menu);
        }
        return true;
      }
    }
    return false;
  },
  clearPopup: function()
  {
    if (this.isVisible()) {
      var toolbar = document.getElementById("operator-urlbar-icon");
      while (toolbar.firstChild) {
        toolbar.removeChild(toolbar.firstChild);
      }
    }
  },
  disable: function()
  {
    document.getElementById("operator-urlbar-icon").removeAttribute("microformats");
  },
  enable: function()
  {
    document.getElementById("operator-urlbar-icon").setAttribute("microformats", "true");
  },
  isVisible: function()
  {
    if (document.getElementById("operator-urlbar-icon")) {
      return true;
    }
    return false;
  }
};
