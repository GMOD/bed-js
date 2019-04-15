table defaultBedSchema
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
    )
