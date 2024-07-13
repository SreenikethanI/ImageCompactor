/** Try to load an image from the selected files list.
 * @param {HTMLInputElement} filePicker The file picker to get the items from.
 */
export async function loadImageFromFilePicker(filePicker, createBlobUrl=false) {
    const files = filePicker.files;
    if (files.length != 1) {return;}
    var bitmap;
    try {bitmap = await createImageBitmap(files[0]);}
    catch (error) {return;}

    const w = bitmap.width, h = bitmap.height;
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    return {
        imageData: ctx.getImageData(0, 0, w, h),
        blobURL: createBlobUrl ? URL.createObjectURL(files[0]) : null,
    };
}

/** Export the given `imageData` to a file in PNG format.
 * @param {ImageData} imageData
 * @param {string} fileName
 */
export async function saveImageData(imageData, fileName) {
    const canvas = new OffscreenCanvas(imageData.width, imageData.height)
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);

    const blob = await canvas.convertToBlob({type: "image/png"});
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", blobUrl);
    link.setAttribute("download", fileName);
    await new Promise((resolve, reject) => {link.click(); resolve();});
    URL.revokeObjectURL(blobUrl);
}
