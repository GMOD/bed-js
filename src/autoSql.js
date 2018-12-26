var peg = require('pegjs')

// based on https://genome-source.gi.ucsc.edu/gitlist/kent.git/blob/master/src/hg/autoSql/autoSql.doc
// also see http://genomewiki.ucsc.edu/index.php/AutoSql and https://www.linuxjournal.com/article/5949
//
var grammar = `
declaration
	= type:declareType _ name:declareName _ comment:comment _ '(' _ fields:fieldList _ ')' _ { return { type, name, comment, fields } }

declareType =
   'simple'/
   'object'/
   'table'

declareName
    =	name /
        name indexType /
        name 'auto' /
        name indexType 'auto'

indexType =
        'primary' /
        'index' /
        'unique'

comment =
	quotedString

fieldList =
    f1:field _ fds:(_ w:field { return w; })* _  {
        fds.unshift(f1);
        return fds;
    }

field =
        type:fieldType _ name:fieldName _ ';' _ comment:comment { return { type, name, comment } } /
        type:fieldType _ '[' _ size:fieldSize _ ']' _ name:name _ ';' _ comment:comment { return { type, size, name, comment } } /
        type:fieldType _ '(' _ vals:fieldValues _ ')' _ name:name _ ';' _ comment:comment { return { type, vals, name, comment } } /
        type:fieldType _ name:fieldName _ ';' _ { return { type, name } }

fieldName = name

fieldValues
    = w1:name _ ',' _ wds:(w:name { return w; })* _  {
        wds.unshift(w1);
        return wds;
    }

fieldType =
    "int"/"uint"/"short"/"ushort"/"byte"/"ubyte"/"float"/"char"/"string"/"lstring"/"enum"/"set"/
	declareType _ declareName

fieldSize = number /
             fieldName

name = t:([a-zA-Z][a-zA-Z0-9_]*) { return text() }

quotedString   = '"' t:(([^"]*)) '"' { return t.join('') }

number "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \\t\\n\\r]*
`

var parser = peg.generate(grammar)
console.log(parser)
module.exports = parser


