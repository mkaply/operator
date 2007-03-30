function Address() {
}

ufJSParser.microformats.Address = {
  version: "0.2",
  mfName: "Address",
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
      "region" : {
      },
      "locality" : {
      },
      "postal-code" : {
      },
      "country-name" : {
      }
    }
  }
};
