function Address(node) {
  if (node) {
    ufJSParser.newMicroformat(this, node, "Address");
  }
}
Address.prototype.toString = function() {
  var address_text = "";
  if (this["post-office-box"]) {
    address_text += this["post-office-box"];
    address_text += " ";
  }
  if (this["street-address"]) {
    address_text += this["street-address"][0];
    address_text += " ";
  }
  if (this["locality"]) {
    address_text += this["locality"];
    address_text += " ";
  }
  if (this["region"]) {
    address_text += this["region"];
    address_text += " ";
  }
  return address_text;
}

ufJSParser.microformats.Address = {
  version: "0.7",
  mfObject: Address,
  className: "adr",
  definition: {
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
  }
};
