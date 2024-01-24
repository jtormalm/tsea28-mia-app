import { getMIA, mia_text, MIAtoData, clearMIAmemory, verifyMIA } from '$lib/mia_file';
import { rows, currentEdit, displayMode, miaFile } from '$lib/stores';

import { toastStore } from '@skeletonlabs/skeleton';
import type { ToastSettings } from '@skeletonlabs/skeleton';


type MIAData = {alu: string, tb: string, fb: string, s: string, p: string, lc: string, seq: string, uadr: string, active: boolean, description: string, id: string};

function getDownload(mia_text: string, rows: MIAData[], filename: string) {
        let split = filename.split(".");
        if (split.length == 1 || split[split.length - 1] != "mia") {
            filename = filename + ".mia";
        }

        let mia_file = getMIA(rows, clearMIAmemory(mia_text));
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(mia_file));
        element.setAttribute('download', filename);
        let blob = new Blob([mia_file], {type: 'text/plain'});
        element.href = window.URL.createObjectURL(blob);
        element.click();	
}

const fileErrorToast: ToastSettings = {
    message: 'JSON is not valid',
    background: 'variant-filled-error',
};

const fileTypeErrorToast: ToastSettings = {
    message: 'Wrong file type',
    background: 'variant-filled-warning',
};

const fileSuccessToast: ToastSettings = {
    message: 'File loaded',
    background: 'variant-filled-success',
};

function readUpload(file: File) {
    const reader = new FileReader();
    console.log("File found");
    reader.onload = (e) => {
        console.log("File loaded");
        if (e.target) {
            let data = e.target.result?.toString();
            if (data === undefined) {
                console.log("File is not valid");
                toastStore.trigger(fileErrorToast);
                return;
            }
            if (verifyMIA(data)) {
                console.log("File is valid");
                miaFile.set(clearMIAmemory(data));
                rows.set(MIAtoData(data));
                toastStore.trigger(fileSuccessToast);
            }
            else {
                console.log("File is not valid");
                toastStore.trigger(fileErrorToast);
            }
        }
    };

    reader.readAsText(file);
}


export { getDownload, readUpload }