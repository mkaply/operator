/*extern Microformats, Operator, Components, content */

var Operator_ToolbarButton = {
  addPopup: function(menu, clone)
  {
    if (!this.isHidden()) {
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
          document.getElementById("operator-toolbar-button").appendChild(newmenu);
        } else {
          document.getElementById("operator-toolbar-button").appendChild(menu);
        }
        return true;
      }
    }
    return false;
  },
  clearPopup: function()
  {
    if (!this.isHidden()) {
      var toolbar = document.getElementById("operator-toolbar-button");
      while (toolbar.firstChild) {
        toolbar.removeChild(toolbar.firstChild);
      }
    }
  },
  disable: function()
  {
    if (!this.isHidden()) {
      document.getElementById("operator-toolbar-button").setAttribute("disabled", "true");
    }
  },
  enable: function()
  {
    if (!this.isHidden()) {
      document.getElementById("operator-toolbar-button").setAttribute("disabled", "false");
    }
  },
  isHidden: function()
  {
    if (document.getElementById("operator-toolbar-button")) {
      return false;
    }
    return true;
  }
};
