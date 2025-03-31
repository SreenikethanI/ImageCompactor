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
        console.time("Load file");
        const fileIn = await FileHandling.loadImageFromFilePicker(DOM.TEMP_FILE_CHOOSER, false);
        console.timeEnd("Load file");
        if (fileIn == null) {
            console.error("Failed to load file.");
            return;
        }
        const imageDataIn = fileIn.imageData;
        if (!imageDataIn) {return;}

        // console.group("Iterations");
        // for (let i = 1; i <= 1; i++) {
        //     console.time(`${i}`);
        //     ImageCompactor.compactImageVertically(imageDataIn, 7, 0);
        //     console.timeEnd(`${i}`);
        // }
        // console.groupEnd("Iterations");

        console.time("Compact duration");
        const imageDataOut = ImageCompactor.compactImageVertically(imageDataIn, 50, 0);
        console.timeEnd("Compact duration");
        console.log(imageDataOut);
        await FileHandling.saveImageData(imageDataOut, "bruh.png");
    });
}
