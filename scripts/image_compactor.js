"use strict";

/**
 * Compacts an image vertically. To compact it horizontally, just rotate the
 * image.
 * @param {ImageData} imageSrc The image to compact.
 * @param {number} maxStripSize The maximum size of a strip. (maxStripSize+1)th
 * row onwards will be discarded.
 * @param {number} tolerance `0`-`255`. The maximum difference allowed to be
 * considered "similar". `0` means there must be an exact match, `255` is
 * pointless. Note that Alpha component is not affected by `tolerance`, i.e.
 * both Alpha values must be exactly equal to be considered a duplicate.
 * @returns {ImageData} The compacted image. If the image cannot be compacted,
 * the original `image` itself is returned.
 */
export function compactImageVertically(imageSrc, maxStripSize, tolerance) {
    const data = imageSrc.data;
    const w = imageSrc.width;
    const h = imageSrc.height;
    const stride = 4*w;
    if (h < tolerance) {return imageSrc;}

    const rowsDiscarded = new Set();
    var reference = data.subarray(stride*0, stride*1); // 1st row

    // counter to count number of duplicate rows (excluding reference row)
    var duplicateCount = 0;

    console.timeStamp("Compact: Scan");
    for (let y = 1; y < h; y++) { // scan 2nd row onwards
        var isEqual = true;
        const goofyAah = stride*y;
        const row = data.subarray(stride*y, stride*(y+1));

        // compare row pixels
        for (let xOffset = 0; xOffset < stride - 1; xOffset = xOffset + 4) {
            // for each R, G, B component, we check tolerance.
            if(
                (Math.abs(row[xOffset    ] - reference[xOffset    ]) > tolerance)
             || (Math.abs(row[xOffset + 1] - reference[xOffset + 1]) > tolerance)
             || (Math.abs(row[xOffset + 2] - reference[xOffset + 2]) > tolerance)
             || (row[xOffset + 3] != reference[xOffset + 3])
            ) {
                isEqual = false;
                break;
            }
        }

        // if unequal row is encountered, reset counter and update reference.
        if (!isEqual) {
            duplicateCount = 0;
            reference = row;
            continue;
        }

        // at this point, the current row is equal to the reference row (and
        // the current row is NOT the reference row itself).
        duplicateCount++;

        if (duplicateCount >= maxStripSize) {
            rowsDiscarded.add(y);
        }
    }

    if (rowsDiscarded.size == 0) {return imageSrc;}
    const hFinal = h - rowsDiscarded.size;

    console.timeStamp("Compact: Compact");
    const dataFinal = data.slice();
    let ySrc = 0;
    for (let yDst = 0; yDst < hFinal; yDst++) {
        while (rowsDiscarded.has(ySrc)) {ySrc++;}
        if (ySrc != yDst)
            dataFinal.copyWithin(stride*yDst, stride*ySrc, stride*(ySrc + 1));
        ySrc++;
    }

    return new ImageData(dataFinal.subarray(0, stride*hFinal), w, hFinal, {colorSpace: "srgb"});
}
