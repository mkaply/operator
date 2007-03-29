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
        cardinality: "plural",
        types: ["work", "home", "pref", "postal", "dom", "intl", "parcel"]
      },
      "post-office-box" : {
        cardinality: "singular"
      },
      "street-address" : {
        cardinality: "plural"
      },
      "extended-address" : {
        cardinality: "singular"
      },
      "region" : {
        cardinality: "singular"
      },
      "locality" : {
        cardinality: "singular"
      },
      "postal-code" : {
        cardinality: "singular"
      },
      "country-name" : {
        cardinality: "singular"
      }
    }
  }
};
