import parser from "./autoSql";
import types from "./defaultTypes";
import { detectTypes } from "./util";

const strandMap = { ".": 0, "-": -1, "+": 1 };

export default class BED {
  constructor(args = {}) {
    if (args.autoSql) {
      this.autoSql = detectTypes(parser.parse(args.autoSql));
    } else if (args.type) {
      if (!types[args.type]) {
        throw new Error("Type not found");
      }
      this.autoSql = detectTypes(types[args.type]);
    } else {
      this.autoSql = detectTypes(types.defaultBedSchema);
      this.attemptDefaultBed = true;
    }
  }

  /*
   * parses a line of text as a BED line with the loaded autoSql schema
   *
   * @param line - a BED line as tab delimited text or array
   * @param opts - supply opts.uniqueId
   * @return a object representing a feature
   */
  parseLine(line, opts = {}) {
    const { autoSql } = this;
    const { uniqueId } = opts;
    let fields = line;
    if (!Array.isArray(line)) {
      if (line.startsWith("track") || line.startsWith("browser")) {
        throw new Error(
          `track and browser line parsing is not supported, please filter:\n${line}`
        );
      }
      fields = line.split("\t");
    }

    let feature = {};

    if (
      (this.attemptDefaultBed && fields.length === 12) ||
      !this.attemptDefaultBed
    ) {
      for (let i = 0; i < autoSql.fields.length; i++) {
        const autoField = autoSql.fields[i];
        let columnVal = fields[i];
        const { isNumeric, isArray, arrayIsNumeric, name } = autoField;
        if (columnVal === null || columnVal === undefined) {
          break;
        }
        if (columnVal !== ".") {
          if (isNumeric) {
            const num = Number(columnVal);
            columnVal = Number.isNaN(num) ? columnVal : num;
          } else if (isArray) {
            columnVal = columnVal.split(",");
            if (columnVal[columnVal.length - 1] === "") {
              columnVal.pop();
            }
            if (arrayIsNumeric) {
              columnVal = columnVal.map((str) => Number(str));
            }
          }

          feature[name] = columnVal;
        }
      }
    } else {
      const fieldNames = ["chrom", "chromStart", "chromEnd", "name"];
      feature = Object.fromEntries(
        fields.map((f, i) => [fieldNames[i] || "field" + i, f])
      );
      feature.chromStart = +feature.chromStart;
      feature.chromEnd = +feature.chromEnd;
      if (!Number.isNaN(Number.parseFloat(feature.field4))) {
        feature.score = +feature.field4;
        delete feature.field4;
      }
      if (feature.field5 === "+" || feature.field5 === "-") {
        feature.strand = feature.field5;
        delete feature.field5;
      }
    }
    if (uniqueId) {
      feature.uniqueId = uniqueId;
    }
    feature.strand = strandMap[feature.strand] || 0;

    feature.chrom = decodeURIComponent(feature.chrom);
    return feature;
  }
}
