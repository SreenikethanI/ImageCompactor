"use strict";
import * as ImageCompactor from './image_compactor.js';
import * as DOM from './index_dom.js';
import * as FileHandling from './file_handling.js';

//=| General |================================================================//
// MARK: General

async function init() {
    DOM.loadReferences();

    await test_afterInit();
}

//=| Testing - before init |==================================================//
// MARK: Testing - before init

//=| Init |===================================================================//
// MARK: Init
if (document.readyState === "complete") {
    // If the document completes loading before the script does, directly invoke
    // the init function instead of attaching an event handler.
    init();
} else {
    window.addEventListener("load", init, false);
}

//=| Testing - after init |===================================================//
// MARK: Testing - after init

async function test_afterInit() {
    DOM.TEMP_FILE_CHOOSER.addEventListener("input", async (ev) => {
        const fileIn = await FileHandling.loadImageFromFilePicker(DOM.TEMP_FILE_CHOOSER, false);
        const imageDataIn = fileIn.imageData;
        // const blobURL = result.blobURL;
        if (!imageDataIn) {return;}

        const imageDataOut = ImageCompactor.compactImageVertically(imageDataIn, 7, 0);
        console.log(imageDataOut);
        await FileHandling.saveImageData(imageDataOut, "bruh.png");
    });
}
