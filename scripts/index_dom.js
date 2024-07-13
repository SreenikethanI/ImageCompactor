"use strict";

//=| DOM |====================================================================//


//=| CSS |====================================================================//


//=| Contents |===============================================================//


//=| TEMP |===================================================================//
export const ID_TEMP_FILE_CHOOSER = "temp_file_chooser";
/** @type {HTMLInputElement} */ export var TEMP_FILE_CHOOSER;

//=| Loader |=================================================================//
var loaded = false;
function e(id) {return document.getElementById(id);}

/** Returns whether DOM element references have been loaded. @return {boolean} */
export function isLoaded() {return loaded;}

/** Load references to DOM elements. @param {boolean} [forceReload=false] */
export function loadReferences(forceReload=false) {
    if (!forceReload && loaded) {return;}

    TEMP_FILE_CHOOSER = e(ID_TEMP_FILE_CHOOSER);

    loaded = true;
}
