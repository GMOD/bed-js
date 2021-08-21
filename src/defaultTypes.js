import parser from "./parser";
import * as types from "./as/autoSqlSchemas";

export default Object.fromEntries(
  Object.entries(types).map((key, val) => {
    return [key, parser.parse(val.trim())];
  })
);
