const fs = require('fs')
const parser = require('../src/autoSql')

describe('autoSql parser', () => {
  it('simple example', () => {
    const s1 = `table addressBook
		"A simple address book"
    (
    string name;  "Name - first or last or both, we don't care"
    lstring address;  "Street address"
    string city;  "City"
    uint zipCode;  "A zip code is always positive, so can be unsigned"
    char[2] state;  "Just store the abbreviation for the state"
    )`

    const res = parser.parse(s1)
    expect(res).toMatchSnapshot()
  })
  it('resolves symbolic', () => {
    const s1 = `table symbolCols
    "example of enum and set symbolic columns"
    (
    int id;                                          "unique id"
    enum(male, female) sex;                          "enumerated column"
    set(cProg,javaProg,pythonProg,awkProg) skills;   "set column"
    )`
    const res = parser.parse(s1)
    expect(res).toMatchSnapshot()
  })

  it('resolves multiple values', () => {
    const s1 = `
    simple point
    "A three dimensional point"
      (
      float x;  "Horizontal coordinate"
      float y;  "Vertical coordinate"
      float z;  "In/out of screen coordinate"
      )`

    const s2 = `simple color
    "A red/green/blue format color"
      (
      ubyte red;  "Red value 0-255"
      ubyte green; "Green value 0-255"
      ubyte blue;  "Blue value 0-255"
      )`

    const s3 = `object face
    "A face of a three dimensional solid"
      (
      simple color color;  "Color of this face"
      int pointCount;    "Number of points in this polygon"
      uint[pointCount] points;   "Indices of points that make up face in polyhedron point array"
      )`

    const s4 = `table polyhedron
    "A solid three dimensional object"
      (
      int faceCount;  "Number of faces"
      object face[faceCount] faces; "List of faces"
      int pointCount; "Number of points"
      simple point[pointCount] points; "Array of points"
      )`

    expect(parser.parse(s1)).toMatchSnapshot()
    expect(parser.parse(s2)).toMatchSnapshot()
    expect(parser.parse(s3)).toMatchSnapshot()
    expect(parser.parse(s4)).toMatchSnapshot()
  })

  it('premade autosql for file types', () => {
    const files = ['bigGenePred', 'bigPsl', 'bigMaf']
    files.forEach(file => {
      const buf = fs.readFileSync(`src/as/${file}.as`).toString()
      expect(parser.parse(buf)).toMatchSnapshot()
    })
  })
})
