export const bigChain = `table bigChain
"bigChain pairwise alignment"
    (
    string chrom;       "Reference sequence chromosome or scaffold"
    uint   chromStart;  "Start position in chromosome"
    uint   chromEnd;    "End position in chromosome"
    string name;        "Name or ID of item, ideally both human readable and unique"
    uint score;         "Score (0-1000)"
    char[1] strand;     "+ or - for strand"
    uint tSize;         "size of target sequence"
    string qName;       "name of query sequence"
    uint qSize;         "size of query sequence"
    uint qStart;        "start of alignment on query sequence"
    uint qEnd;          "end of alignment on query sequence"
    uint chainScore;    "score from chain"
    )`

export const bigGenePred = `table bigGenePred
"bigGenePred gene models"
   (
   string chrom;       "Reference sequence chromosome or scaffold"
   uint   chromStart;  "Start position in chromosome"
   uint   chromEnd;    "End position in chromosome"
   string name;        "Name or ID of item, ideally both human readable and unique"
   uint score;         "Score (0-1000)"
   char[1] strand;     "+ or - for strand"
   uint thickStart;    "Start of where display should be thick (start codon)"
   uint thickEnd;      "End of where display should be thick (stop codon)"
   uint reserved;       "RGB value (use R,G,B string in input file)"
   int blockCount;     "Number of blocks"
   int[blockCount] blockSizes; "Comma separated list of block sizes"
   int[blockCount] chromStarts; "Start positions relative to chromStart"
   string name2;       "Alternative/human readable name"
   string cdsStartStat; "Status of CDS start annotation (none, unknown, incomplete, or complete)"
   string cdsEndStat;   "Status of CDS end annotation (none, unknown, incomplete, or complete)"
   int[blockCount] exonFrames; "Exon frame {0,1,2}, or -1 if no frame for exon"
   string type;        "Transcript type"
   string geneName;    "Primary identifier for gene"
   string geneName2;   "Alternative/human readable gene name"
   string geneType;    "Gene type"
   )`

export const bigInteract = `table interact
"interaction between two regions"
    (
    string chrom;        "Chromosome (or contig, scaffold, etc.). For interchromosomal, use 2 records"
    uint chromStart;     "Start position of lower region. For interchromosomal, set to chromStart of this region"
    uint chromEnd;       "End position of upper region. For interchromosomal, set to chromEnd of this region"
    string name;         "Name of item, for display.  Usually 'sourceName/targetName/exp' or empty"
    uint score;          "Score (0-1000)"
    double value;        "Strength of interaction or other data value. Typically basis for score"
    string exp;          "Experiment name (metadata for filtering). Use . if not applicable"
    string color;        "Item color.  Specified as r,g,b or hexadecimal #RRGGBB or html color name, as in //www.w3.org/TR/css3-color/#html4. Use 0 and spectrum setting to shade by score"
    string sourceChrom;  "Chromosome of source region (directional) or lower region. For non-directional interchromosomal, chrom of this region."
    uint sourceStart;    "Start position in chromosome of source/lower/this region"
    uint sourceEnd;      "End position in chromosome of source/lower/this region"
    string sourceName;   "Identifier of source/lower/this region"
    string sourceStrand; "Orientation of source/lower/this region: + or -.  Use . if not applicable"
    string targetChrom;  "Chromosome of target region (directional) or upper region. For non-directional interchromosomal, chrom of other region"
    uint targetStart;    "Start position in chromosome of target/upper/this region"
    uint targetEnd;      "End position in chromosome of target/upper/this region"
    string targetName;   "Identifier of target/upper/this region"
    string targetStrand; "Orientation of target/upper/this region: + or -.  Use . if not applicable"

    )`

export const bigLink = `table bigLink
"bigLink pairwise alignment"
    (
    string chrom;       "Reference sequence chromosome or scaffold"
    uint   chromStart;  "Start position in chromosome"
    uint   chromEnd;    "End position in chromosome"
    string name;        "Name or ID of item, ideally both human readable and unique"
    uint qStart;        "start of alignment on query sequence"
    )`

export const bigMaf = `table bedMaf
"Bed3 with MAF block"
    (
    string chrom;      "Reference sequence chromosome or scaffold"
    uint   chromStart; "Start position in chromosome"
    uint   chromEnd;   "End position in chromosome"
    lstring mafBlock;   "MAF block"
    )`
export const bigNarrowPeak = `table bigNarrowPeak
"BED6+4 Peaks of signal enrichment based on pooled, normalized (interpreted) data."
(
    string chrom;        "Reference sequence chromosome or scaffold"
    uint   chromStart;   "Start position in chromosome"
    uint   chromEnd;     "End position in chromosome"
    string name;	 "Name given to a region (preferably unique). Use . if no name is assigned"
    uint   score;        "Indicates how dark the peak will be displayed in the browser (0-1000) "
    char[1]  strand;     "+ or - or . for unknown"
    float  signalValue;  "Measurement of average enrichment for the region"
    float  pValue;       "Statistical significance of signal value (-log10). Set to -1 if not used."
    float  qValue;       "Statistical significance with multiple-test correction applied (FDR -log10). Set to -1 if not used."
    int   peak;         "Point-source called for this peak; 0-based offset from chromStart. Set to -1 if no point-source called."
)`
export const bigPsl = `table bigPsl
"bigPsl pairwise alignment"
    (
    string chrom;       "Reference sequence chromosome or scaffold"
    uint   chromStart;  "Start position in chromosome"
    uint   chromEnd;    "End position in chromosome"
    string name;        "Name or ID of item, ideally both human readable and unique"
    uint score;         "Score (0-1000)"
    char[1] strand;     "+ or - indicates whether the query aligns to the + or - strand on the reference"
    uint thickStart;    "Start of where display should be thick (start codon)"
    uint thickEnd;      "End of where display should be thick (stop codon)"
    uint reserved;       "RGB value (use R,G,B string in input file)"
    int blockCount;     "Number of blocks"
    int[blockCount] blockSizes; "Comma separated list of block sizes"
    int[blockCount] chromStarts; "Start positions relative to chromStart"

    uint    oChromStart;"Start position in other chromosome"
    uint    oChromEnd;  "End position in other chromosome"
    char[1] oStrand;    "+ or -, - means that psl was reversed into BED-compatible coordinates"
    uint    oChromSize; "Size of other chromosome."
    int[blockCount] oChromStarts; "Start positions relative to oChromStart or from oChromStart+oChromSize depending on strand"

    lstring  oSequence;  "Sequence on other chrom (or empty)"
    string   oCDS;       "CDS in NCBI format"

    uint    chromSize;"Size of target chromosome"

    uint match;        "Number of bases matched."
    uint misMatch; " Number of bases that don't match "
    uint repMatch; " Number of bases that match but are part of repeats "
    uint nCount;   " Number of 'N' bases "
    uint seqType;    "0=empty, 1=nucleotide, 2=amino_acid"
    )`

export const defaultBedSchema = `table defaultBedSchema
"BED12"
    (
    string chrom;      "The name of the chromosome (e.g. chr3, chrY, chr2_random) or scaffold (e.g. scaffold10671)."
    uint   chromStart; "The starting position of the feature in the chromosome or scaffold. The first base in a chromosome is numbered 0."
    uint   chromEnd;   "The ending position of the feature in the chromosome or scaffold. The chromEnd base is not included in the display of the feature. For example, the first 100 bases of a chromosome are defined as chromStart=0, chromEnd=100, and span the bases numbered 0-99."
    string   name;   "Defines the name of the BED line."
    float   score;   "Feature score, doesn't care about the 0-1000 limit as in bed"
    char   strand;   "Defines the strand. Either '.' (=no strand) or '+' or '-'"
    uint thickStart; "The starting position at which the feature is drawn thickly (for example, the start codon in gene displays). When there is no thick part, thickStart and thickEnd are usually set to the chromStart position."
    uint thickEnd; "The ending position at which the feature is drawn thickly (for example the stop codon in gene displays)."
    string itemRgb; "An RGB value of the form R,G,B (e.g. 255,0,0). "
    uint blockCount; " The number of blocks (exons) in the BED line."
    uint[blockCount] blockSizes; " A comma-separated list of the block sizes. The number of items in this list should correspond to blockCount."
    uint[blockCount] blockStarts; "A comma-separated list of block starts. All of the blockStart positions should be calculated relative to chromStart. The number of items in this list should correspond to blockCount."
    )`

export const mafFrames = `table mafFrames
"codon frame assignment for MAF components"
    (
    string chrom;      "Reference sequence chromosome or scaffold"
    uint   chromStart; "Start range in chromosome"
    uint   chromEnd;   "End range in chromosome"
    string src;        "Name of sequence source in MAF"
    ubyte frame;       "frame (0,1,2) for first base(+) or last bast(-)"
    char[1] strand;    "+ or -"
    string name;       "Name of gene used to define frame"
    int    prevFramePos;  "target position of the previous base (in transcription direction) that continues this frame, or -1 if none, or frame not contiguous"
    int    nextFramePos;  "target position of the next base (in transcription direction) that continues this frame, or -1 if none, or frame not contiguous"
    ubyte  isExonStart;  "does this start the CDS portion of an exon?"
    ubyte  isExonEnd;    "does this end the CDS portion of an exon?"
    )`

export const mafSummary = `table mafSummary
"Positions and scores for alignment blocks"
    (
    string chrom;      "Reference sequence chromosome or scaffold"
    uint   chromStart; "Start position in chromosome"
    uint   chromEnd;   "End position in chromosome"
    string src;        "Sequence name or database of alignment"
    float  score;      "Floating point score."
    char[1] leftStatus;  "Gap/break annotation for preceding block"
    char[1] rightStatus; "Gap/break annotation for following block"
    )`
