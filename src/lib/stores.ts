import { writable, type Writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';
import { mia_text } from './mia_file';
import type { MIAData } from './types';
import { getActiveRows } from './tableMapping';

export const rows: Writable<MIAData[]> = localStorageStore('rows', []);
export const displayMode: Writable<string> = localStorageStore('displayMode', "1");
export const miaFile: Writable<string> = localStorageStore('miaFile', mia_text);
export const currentEdit: Writable<number> = writable(0);


// export const rowsHistory: Writable<MIAData[][]> = localStorageStore('rowsHistory', []);

function checkRowEqual(row1: MIAData, row2: MIAData): boolean {
    return row1.alu === row2.alu && row1.tb === row2.tb && row1.fb === row2.fb && row1.s === row2.s && row1.p === row2.p && row1.lc === row2.lc && row1.seq === row2.seq && row1.uadr === row2.uadr && row1.active === row2.active && row1.description === row2.description && row1.id === row2.id;
}

function checkRowsEqual(rows1: MIAData[], rows2: MIAData[]): boolean {
    if (rows1.length != rows2.length) return false;
    return rows1.every((row, index) => checkRowEqual(row, rows2[index]));
}

function getEmptyHistory(): { rows: MIAData[][], current: number } {
    return { rows: [], current: 0 };
}


function createRowsHistory() {
    const { subscribe, set, update } = localStorageStore("rowsHistory", getEmptyHistory());

    let clean = (obj: Object) => {
        let newObj = JSON.parse(JSON.stringify(obj));
        return newObj;
    }



    let getCurrentValue = () => {
        let current: MIAData[] = [];
        subscribe((n: { rows: MIAData[][], current: number }) => {
            current = n.rows[n.current];
        });
        return clean(current);
    }

    return {
        subscribe,
        push: (value: MIAData[]) => {
            update((n: { rows: MIAData[][], current: number }) => {
                let newActiveRows = clean(getActiveRows(value));
                if (n.rows.length !== 0 && checkRowsEqual(n.rows[n.current], newActiveRows)) {
                    return n;
                };
                n.rows = n.rows.slice(0, n.current + 1);
                n.rows.push(newActiveRows);
                n.current = n.rows.length - 1;
                return n;
            });
        },
        previous: () => {
            update((n: { rows: MIAData[][], current: number }) => {
                if (n.current > 0) {
                    n.current--;
                }
                return n;
            });
            return getCurrentValue();
        },
        next: () => {
            update((n: { rows: MIAData[][], current: number }) => {
                if (n.current < n.rows.length - 1) {
                    n.current++;
                }
                return n;
            });
            return getCurrentValue();
        },
        clear: () => {
            set(getEmptyHistory());
        },
        hasPrevious: () => {
            let current: number = 0;
            subscribe((n: { rows: MIAData[][], current: number }) => {
                current = n.current;
            })();
            return current > 0;
        },
        hasNext: () => {
            let current: number = 0;
            let rows: MIAData[][] = [];
            subscribe((n: { rows: MIAData[][], current: number }) => {
                current = n.current;
                rows = n.rows;
            })();
            return current < rows.length - 1;
        }
    };
}

export const rowsHistory = createRowsHistory();