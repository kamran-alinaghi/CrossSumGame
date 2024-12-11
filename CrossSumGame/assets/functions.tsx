export function FillRandom(rows: number, cols: number) {
    let result = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.floor(Math.random() * 8.5) + 1)
    );
    return result;
}

export function generateCorrectAnswers(gridNums: number[][]): [number, number][] {
    const correctAnswers: [number, number][] = [];
    const columnsCovered = new Set<number>(); // Track columns already covered

    gridNums.forEach((row, rowIndex) => {
        // Generate a random number of correct answers for this row
        const numCorrectAnswers = Math.floor(Math.random() * (row.length - 1)) + 1;

        // Shuffle the indices of the row to randomly pick correct answers
        const shuffledIndices = Array.from({ length: row.length }, (_, i) => i).sort(() => Math.random() - 0.5);

        let addedCorrectAnswers = 0;

        // First, ensure uncovered columns get an answer
        for (const colIndex of shuffledIndices) {
            if (!columnsCovered.has(colIndex)) {
                correctAnswers.push([rowIndex, colIndex]);
                columnsCovered.add(colIndex); // Mark this column as covered
                addedCorrectAnswers++;

                if (addedCorrectAnswers >= numCorrectAnswers) break;
            }
        }

        // Add remaining correct answers randomly if needed
        for (const colIndex of shuffledIndices) {
            if (addedCorrectAnswers >= numCorrectAnswers) break;

            correctAnswers.push([rowIndex, colIndex]);
            addedCorrectAnswers++;
        }
    });

    // Ensure all columns are covered (in case some were missed)
    for (let colIndex = 0; colIndex < gridNums[0].length; colIndex++) {
        if (!columnsCovered.has(colIndex)) {
            // Find a random row to place this missing column answer
            const randomRowIndex = Math.floor(Math.random() * gridNums.length);
            correctAnswers.push([randomRowIndex, colIndex]);
            columnsCovered.add(colIndex);
        }
    }

    return correctAnswers;
}

export function GetRevealedArray(rows: number, cols: number): boolean[][] {
    let result = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => false)
    );
    return result;
}