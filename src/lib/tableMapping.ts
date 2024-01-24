import type { MIAData } from "./types";
import { getChoices } from "./choices";

function get_choice_text(choices: {value: string, text: string}[], value: string) {
    for (let choice of choices) {
        if (choice.value === value) {
            return choice.text;
        }
    }
    return "inget";
}

function centerText(text: string): string {
    return `<div class="flex justify-center items-center">${text}</div>`;
}

function centerTwoText(text1: string, text2: string): string {
    return `<div class="flex flex-col">${text1}${text2}</div>`
}

function tableMapper(sourceData: MIAData[], displayMode: string): string[][] {
    let tableData: string[][] = [];
    let labels = ["alu", "tb", "fb", "s", "p", "lc", "seq"];
    for (let i = 0; i < sourceData.length; i++) {
        if (!sourceData[i].active) continue;
        let row: string[] = [];
        let total_bits: string[] = []
        
        for (const [label, bits] of Object.entries(sourceData[i])) {
            if (!labels.includes(label)) continue;
            total_bits.push(bits);

            let string_bits = centerText(bits)
            let description = centerText(get_choice_text(getChoices(label), bits))
            if (displayMode === "0") {
                row.push(
                    centerTwoText(description, string_bits)
                )
            }
            
            else if (displayMode === "1"){
                row.push(
                    description
                    )
            }

            else {
                row.push(
                    string_bits
                )
            }
        }

        let uadr_bits = centerText(sourceData[i].uadr);
        let uadr_hex = centerText("0x" + parseInt(sourceData[i].uadr, 2).toString(16).toUpperCase().padStart(2, "0"));
        total_bits.push(sourceData[i].uadr);
        
        let bits_text = centerText("0b" + total_bits.join(''))
        let hex_text = centerText("0x" + parseInt(total_bits.join(''), 2).toString(16).toUpperCase().padStart(7, "0"))

        let hex_pos = centerText("0x" + i.toString(16).padStart(2, "0").toUpperCase());
        let bits_pos = centerText("0b" + i.toString(2).padStart(8, "0"));

        if (displayMode === "0") {
            row = [centerTwoText(hex_pos, bits_pos), ...row];
            row.push(centerTwoText(uadr_hex, uadr_bits))
            row.push(centerTwoText(hex_text, bits_text))
        }
        else if (displayMode === "1") {
            row = [hex_pos, ...row];
            row.push(uadr_hex);
            row.push(hex_text);
        }
        else {
            row = [bits_pos, ...row];
            row.push(uadr_bits);
            row.push(bits_text);
        }

        if (sourceData[i].description === "") {
            sourceData[i].description = "-";
        }
        row.push(centerText(sourceData[i].description));
        
        tableData.push(row);
    }
    return tableData;
}


function tableMapperMeta(sourceData: MIAData[], displayMode: string): string[][] {
    let tableData = tableMapper(sourceData, displayMode);
    for (let i = 0; i < tableData.length; i++) {
        tableData[i] = [i.toString(), ...tableData[i]];
        tableData[i].push(sourceData[i].id);
    }
    return tableData;
}

function getActiveRows(rows: MIAData[]): MIAData[] {
    return rows.filter((row) => row.active);
}

export {tableMapper, tableMapperMeta, getActiveRows}