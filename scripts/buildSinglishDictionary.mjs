import { readFileSync, writeFileSync } from "node:fs";

const [, , input] = process.argv;
if (!input) throw new Error("Usage: node buildSinglishDictionary.mjs <csv>");

// Minimal CSV reader: first cell of each row, quotes and BOM handled.
const firstCells = (text) => {
    const cells = [];
    let cell = "", inQuotes = false, firstDone = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (inQuotes) {
            if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
            else if (ch === '"') inQuotes = false;
            else cell += ch;
        } else if (ch === '"') inQuotes = true;
        else if (ch === "," && !firstDone) { cells.push(cell); firstDone = true; cell = ""; }
        else if (ch === "\n" || ch === "\r") {
            if (!firstDone && (cell !== "" || text[i - 1] === ",")) cells.push(cell);
            if (ch === "\n" || text[i + 1] !== "\n") { firstDone = false; cell = ""; }
        } else if (!firstDone) cell += ch;
    }
    if (!firstDone && cell) cells.push(cell);
    return cells;
};

const words = firstCells(readFileSync(input, "utf8").replace(/^\uFEFF/, ""))
    .slice(1)                                    // header row
    .map((w) => w.trim().toLowerCase().replace(/\s+/g, " "))
    .filter((w) => w && !w.startsWith("-"));     // drop affix fragments (-ly, -ster)

const unique = Array.from(new Set(words)).sort();
writeFileSync("src/utils/lists/singlishDictionary.json", JSON.stringify(unique));
console.log(`${unique.length} entries written`);