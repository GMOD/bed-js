declaration
        = _ type:declareType _ name:declareName _ comment:comment _ '(' _ fields:fieldList _ ')' _ { return { type, name, comment, fields } }

declareType =
   v:('simple'i / 'object'i / 'table'i) { return v.toLowerCase() }

declareName = name

indexType =
        'primary' ![a-zA-Z0-9_] /
        'index' ![a-zA-Z0-9_] /
        'unique' ![a-zA-Z0-9_]

comment = nonQuotedString

fieldList =
    f1:field _ fds:(_ w:field { return w; })* _  {
      if(f1.name) {
        fds.unshift(f1);
      }
      return fds;
    }

commentStart = '#'
internalComment = _ commentStart nonQuotedString _

fieldModifier =
        indexType (_ '[' _ number _ ']')? /
        'auto' ![a-zA-Z0-9_]

field =
        type:fieldType _ name:fieldName (_ fieldModifier)* _ ';' _ comment:comment { return { type, name, comment } } /
        type:fieldType _ '[' _ size:fieldSize _ ']' _ name:name (_ fieldModifier)* _ ';' _ comment:comment { return { type, size, name, comment } } /
        type:fieldType _ '(' _ vals:fieldValues _ ')' _ name:name (_ fieldModifier)* _ ';' _ comment:comment { return { type, vals, name, comment } } /
        internalComment

fieldName = name

fieldValues =
    f1:name fds:(',' _ w:name { return w; })* {
        fds.unshift(f1);
        return fds;
    }

fieldType =
    v:('int'i / 'uint'i / 'short'i / 'ushort'i / 'byte'i / 'ubyte'i / 'float'i / 'char'i /
    'string'i / 'lstring'i / 'enum'i / 'double'i / 'bigint'i / 'set'i) { return v.toLowerCase() } /
        t:declareType _ n:declareName { return t+' '+n }

fieldSize = number /
             fieldName

name = [a-zA-Z_][a-zA-Z0-9_]* { return text() }

nonQuotedString = t:([^\n\r]*) { return t.join('').trim().replace(/^"|"$/g, '') }

number "integer"
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*
