
interface IChoices {
    alu: ChoiceValue[];
    tb: ChoiceValue[];
    fb: ChoiceValue[];
    s: ChoiceValue[];
    m: ChoiceValue[];
    p: ChoiceValue[];
    lc: ChoiceValue[];
    seq: ChoiceValue[];
}

interface ChoiceValue {
    value: string;
    text: string;
}

let choices: IChoices = {
    alu: [
        {value: "0000", text: "inget"},
        {value: "0001", text: "AR:= buss"},
        {value: "0010", text: "AR:= buss (ettkomplementet)"},
        {value: "0011", text: "AR:= 0"},
        {value: "0100", text: "AR:= AR+buss "},
        {value: "0101", text: "AR:= AR-buss"},
        {value: "0110", text: "AR:= AR AND buss"},
        {value: "0111", text: "AR:= AR OR buss"},
        {value: "1000", text: "AR:= AR+buss "},
        {value: "1001", text: "skifta AR vänster, noll in "},
        {value: "1010", text: "skifta ARHR vänster (32 bit), noll in"},
        {value: "1011", text: "skifta AR höger aritmetiskt, teckenbit in"},
        {value: "1100", text: "skifta ARHR höger aritmetiskt (32 bit), teckenbit in"},
        {value: "1101", text: "skifta AR höger logiskt, noll in"},
        {value: "1110", text: "rotera AR vänster"},
        {value: "1111", text: "rotera ARHR vänster(32 bit)"},
    ],
    seq: [
        {value: "0000", text: "uPC räknas upp med ett"},
        {value: "0001", text: "uPC laddas från K1"},
        {value: "0010", text: "uPC laddas från K2"},
        {value: "0011", text: "uPC nollställs"},
        {value: "0100", text: "hopp till uADR om Z=0, annars uPC+1"},
        {value: "0101", text: "ovillkorligt hopp till uADR"},
        {value: "0110", text: "subrutinhopp till uADR (SuPC:= uPC+1, uPC:= uADR)"},
        {value: "0111", text: "subrutinåterhopp (uPC:= SuPC)"},
        {value: "1000", text: "hopp till uADR om Z=1, annars uPC+1"},
        {value: "1001", text: "hopp till uADR om N=1, annars uPC+1"},
        {value: "1010", text: "hopp till uADR om C=1, annars uPC+1"},
        {value: "1011", text: "hopp till uADR om O=1, annars uPC+1"},
        {value: "1100", text: "hopp till uADR om L=1, annars uPC+1"},
        {value: "1101", text: "hopp till uADR om C=0, annars uPC+1"},
        {value: "1110", text: "hopp till uADR om O=0, annars uPC+1"},
        {value: "1111", text: "nollställ uPC och avbryt exekveringen (HALT)"},
    ],
    tb: [
        {value: "000", text: "inget"},
        {value: "001", text: "IR"},
        {value: "010", text: "PM"},
        {value: "011", text: "PC"},
        {value: "100", text: "AR"},
        {value: "101", text: "HR"},
        {value: "110", text: "GRx"},
        {value: "111", text: "styrordets b9-b24"},
    ],
    fb: [
        {value: "000", text: "inget"},
        {value: "001", text: "IR"},
        {value: "010", text: "PM"},
        {value: "011", text: "PC"},
        {value: "100", text: "odefinierad"},
        {value: "101", text: "HR"},
        {value: "110", text: "GRx"},
        {value: "111", text: "ASR"},
    ],
    s: [
        {value: "0", text: "IR GRx-fält 4/1 mux"},
        {value: "1", text: "IR M-fält 4/1 mux"},
    ],
    p: [
        {value: "0", text: "PC ändras ej"},
        {value: "1", text: "PC räknas upp med ett"},
    ],
    m: [
        {value: "00", text: "LC påverkas ej"},
        {value: "01", text: "LC räknas ned med ett"},
        {value: "10", text: "LC laddas från bussens 8 minst signifikanta bitar"},
        {value: "11", text: "LCs 7 minst signifikanta bitar laddas från uADR fältet, msb=0"},
    ],
    lc: [ 
        {value: "00", text: "LC påverkas ej"},
        {value: "01", text: "LC räknas ned med ett"},
        {value: "10", text: "LC laddas från bussens 8 minst signifikanta bitar"},
        {value: "11", text: "LCs 7 minst signifikanta bitar laddas från uADR fältet, msb=0"},
    ]
}

function getChoices(name: string): ChoiceValue[] {
    for (const [key, value] of Object.entries(choices)) {
        if (key === name) {
            return value;
        }
    }
    return [{value: "", text: ""}];
}

export {getChoices, choices};