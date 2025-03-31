"use strict";
// A common module to store all global variables for the current session.

/** @type {ImageBitmap | null} */
let loadedImage = null;

/** @type {ImageData | null} */
let loadedImageData = null;


function getLoadedImage() {return loadedImage;}
function setLoadedImage(newLoadedImage, newLoadedImageData) {
    loadedImage = newLoadedImage
    loadedImageData = newLoadedImageData
}
