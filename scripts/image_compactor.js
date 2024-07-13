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
    if (h < tolerance) {return imageSrc;}

    const rowsDiscarded = new Set();
    var reference = data.subarray(4*0*w, 4*1*w); // 1st row

    // counter to count number of duplicate rows (excluding reference row)
    var duplicateCount = 0;

    for (let y = 1; y < h; y++) { // scan 2nd row onwards
        var isEqual = true;
        const goofyAah = 4*w*y;
        const row = data.subarray(4*w*y, 4*w*(y+1));

        // compare row pixels
        for (let x = 0; x < w; x++) {
            // for each R, G, B component, we check tolerance.
            for (let c = 0; c < 3; c++) {
                if (Math.abs(row[4*x + c] - reference[4*x + c]) > tolerance) {
                    isEqual = false;
                    break;
                }
            }

            // compare Alpha without tolerance.
            if (row[4*x + 3] != reference[4*x + 3]) {
                isEqual = false;
                break;
            }

            if (!isEqual) break;
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

    const dataFinal = data.slice();
    let ySrc = 0;
    for (let yDst = 0; yDst < hFinal; yDst++) {
        while (rowsDiscarded.has(ySrc)) {ySrc++;}
        if (ySrc != yDst) dataFinal.copyWithin(4*w*yDst, 4*w*ySrc, 4*w*(ySrc + 1));
        ySrc++;
    }

    return new ImageData(dataFinal.subarray(0, 4*w*hFinal), w, hFinal, {colorSpace: "srgb"});
}
