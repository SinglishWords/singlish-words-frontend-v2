/** Same rule for dictionary entries and participant responses. */
export const normalizeForMatch = (word: string): string =>
    word
        .replace(/[’‘]/g, "'")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLocaleLowerCase();

let dictionaryPromise: Promise<ReadonlySet<string>> | null = null;

/** Loads the dictionary as a separate chunk, only when the results page needs it. */
export const loadSinglishDictionary = (): Promise<ReadonlySet<string>> => {
    if (!dictionaryPromise) {
        dictionaryPromise = import("src/utils/lists/singlishDictionary.json")
            .then(
                module =>
                    new Set(
                        (module.default as string[])
                            .map(normalizeForMatch)
                            .filter(Boolean)
                    )
            )
            .catch(error => {
                dictionaryPromise = null;   // allow a retry
                throw error;
            });
    }

    return dictionaryPromise;
};