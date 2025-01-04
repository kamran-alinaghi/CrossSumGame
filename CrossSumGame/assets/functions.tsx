export function FillRandom(rows: number, cols: number) {
    let result = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.floor(Math.random() * 8.5) + 1)
    );
    return result;
}

export function GetRevealedArray(rows: number, cols: number): boolean[][] {
    let result = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => false)
    );
    return result;
}


export function GetRowSums(answers:boolean[][],data:number[][]){
    const result:number[]=[];
    for(let i=0;i<data.length;i++){result.push(0);}
    answers.forEach((rowValue,rowIndex)=>{
        rowValue.forEach((boolValue,colIndex)=>{
            if(boolValue){
                result[rowIndex]+=data[rowIndex][colIndex];
            }
        });
    });
    return result;
}

export function GetColSums(answers:boolean[][],data:number[][]){
    const result:number[]=[];
    for(let i=0;i<data[0].length;i++){result.push(0);}
    answers.forEach((rowValue,rowIndex)=>{
        rowValue.forEach((boolValue,colIndex)=>{
            if(boolValue){
                result[colIndex]+=data[rowIndex][colIndex];
            }
        });
    });
    return result;
}

export function GetCorrectAnswersMatrix_V2(rows: number, cols: number): boolean[][]{
    const result: boolean[][] = [];
    for (let i = 0; i < rows; i++) {
        const tempArray: boolean[] = new Array(cols).fill(false);
        const numberOfCorrectAnswers: number = Math.floor(Math.random() * (cols - 2)) + 1;
        let addedCount = 0;
        while (addedCount < numberOfCorrectAnswers) {
            const randomIndex = Math.floor(Math.random() * (cols - 1));
            if (!tempArray[randomIndex]) {
                tempArray[randomIndex] = true;
                addedCount++;
            }
        }
        result.push(tempArray);
    }
    for (let i = 0; i < cols; i++) {
        let tempBool = false;
        for (let j = 0; j < rows; j++) { if (result[j][i]) { tempBool = true; } }
        if (!tempBool) {
            const numberOfCorrectAnswers: number = Math.floor(Math.random() * (rows - 2)) + 1;
            let addedCount = 0;
            while (addedCount < numberOfCorrectAnswers) {
                const randomRowIndex = Math.floor(Math.random() * (rows - 1));
                if (!result[randomRowIndex][i]) {
                    result[randomRowIndex][i] = true;
                    addedCount++;
                }
            }
        }
    }
    return result;
}