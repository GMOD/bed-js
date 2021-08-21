import { parse } from "./autoSql";
import * as types from "./as/autoSqlSchemas";

export default Object.fromEntries(
  Object.entries(types).map(([key, val]) => {
    return [key, parse(val.trim())];
  })
);
