const getDefaults = () => {
  return {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
    addPath: "/locales/{{lng}}/{{ns}}.missing.json",
    parse: JSON.parse,
  };
};

const readFile = (filename: string, callback: Function) => {
  const fs = require("fs");
  fs.readFile(filename, "utf8", function (err: any, data: string) {
    if (err) {
      callback(err);
    } else {
      let result;

      try {
        result = JSON.parse(data);
      } catch (err) {
        return callback(err);
      }

      callback(null, result);
    }
  });
};

class Backend {
  type: string;
  services: any;
  options: any;
  static type: "backend" | "logger" = "backend";
  constructor(services: any, options = {}) {
    this.init(services, options);
    this.type = "backend";
  }

  init(services: any, options: {}) {
    this.services = services;
    this.options = options || getDefaults();
  }

  read(language: string, namespace: string, callback: Function) {
    const filename = this.services.interpolator.interpolate(
      this.options.loadPath,
      { lng: language, ns: namespace }
    );

    readFile(filename, (err: any, resources: {}) => {
      if (err) return callback(err, false);
      callback(null, resources);
    });
  }
}

export default Backend;
