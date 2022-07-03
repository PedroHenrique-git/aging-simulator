const { createReadStream } = require('fs');
const { join } = require('path');
const readline = require('readline');

const fileName = process.argv[2];
const fileStream = createReadStream(join(__dirname, fileName)); 
const fileReaderInterface = readline.createInterface({ input: fileStream });
const fileData = [];

function pushFileDataToArray(data) {
    fileData.push(data);
}

function simulateAging() {
    const config = fileData.shift();
    const [agingRecorder, numberOfPages] = config.split(' ');
    const agingResponse = new Array(Number(numberOfPages)).fill(0);

    const addBitOne = (pageCount, index) => {
        pageCount[index] >>= 1;
        pageCount[index] ^= 1 << Number(agingRecorder) - 1;      
    }

    const moveBitOne = (pageCount, index) => {
        pageCount[index] >>= 1;
    }

    for(let i = 0; i < fileData.length; i += 1) {
        const referenceBitsEachPage =  fileData[i];
        
        for(let j = 0; j < referenceBitsEachPage.length; j++) {
            const bit = referenceBitsEachPage[j];
            const bitStrToNumber = Number(bit);
            bitStrToNumber === 1 ? addBitOne(agingResponse, j) : moveBitOne(agingResponse, j);
        }
    }

    let smallerValue = agingResponse[0];
    let indexSmallerValue = 0;

    agingResponse.forEach((agingValue, index) => {
        if(agingValue < smallerValue) {
            smallerValue = agingValue;
            indexSmallerValue = index;    
        }

        const formateAgingValue = agingValue.toString('2').padStart(Number(agingRecorder), '0');
        console.log(formateAgingValue);
    });

    console.log(`\npagina a ser removida --> ${indexSmallerValue}`);
}

fileReaderInterface
    .on('line', pushFileDataToArray)
    .on('close', simulateAging);