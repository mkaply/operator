if (Components.utils.import) {
  try {
    Components.utils.import("rel:Microformats.js");
    EXPORTED_SYMBOLS = ["Address"];
  } catch (ex) {}
}

function Address(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "Address");
  }
}

Address.prototype.toString = function() {
  var address_text = "";
  var start_parens = false;
  if (this["street-address"]) {
    address_text += this["street-address"][0];
    address_text += " ";
  }
  if (this["locality"]) {
    if (this["street-address"]) {
      address_text += "(";
      start_parens = true;
    }
    address_text += this["locality"];
  }
  if (this["region"]) {
    if ((this["street-address"]) && (!start_parens)) {
      address_text += "(";
      start_parens = true;
    } else if (this["locality"]) {
      address_text += ", ";
    }
    address_text += this["region"];
  }
  if (this["country-name"]) {
    if ((this["street-address"]) && (!start_parens)) {
      address_text += "(";
      start_parens = true;
      address_text += this["country-name"];
    } else if ((!this["locality"]) && (!this["region"])) {
      address_text += this["country-name"];
    } else if (((!this["locality"]) && (this["region"])) || ((this["locality"]) && (!this["region"]))) {
      address_text += ", ";
      address_text += this["country-name"];
    }
  }
  if (start_parens) {
    address_text += ")";
  }
  return address_text;
}

var Address_definition = {
  mfObject: Address,
  className: "adr",
  properties: {
    "type" : {
      plural: true,
      types: ["work", "home", "pref", "postal", "dom", "intl", "parcel"]
    },
    "post-office-box" : {
    },
    "street-address" : {
      plural: true,
    },
    "extended-address" : {
    },
    "locality" : {
    },
    "region" : {
    },
    "postal-code" : {
    },
    "country-name" : {
    }
  }
};

Microformats.add("Address", Address_definition);
