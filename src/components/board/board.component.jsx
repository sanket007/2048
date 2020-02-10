import React, { useState, Fragment, useEffect } from 'react';
import SingleBlock from '../single-block/single-block.component';
import Vertical from '../swipe-actions/vertical/vertical.component';
import Horizontal from '../swipe-actions/horizontal/horizontal.component';

const Board = () => {

    const initialData = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    const generalBlockData = [2, 4, 8];

    const [boardData, setBoardData] = useState(initialData);
    const [injectData, setInjectData] = useState([]);
    const [totalScore, setTotalScore] = useState(0);
    useEffect(() => {
        startGame();
    }, [])

    useEffect(() => {
        const total = boardData.reduce((acc, item) =>
            acc + item.reduce((accInner, value) =>
                accInner + value
                , 0)
            , 0)

        setTotalScore(total);
    }, [boardData])

    const startGame = () => {
        let blockValue = 0;
        let firstBlockData = {};
        let secondBlockData = {};
        const tempInitialData = [...initialData];
        // get first random block
        firstBlockData = getInitialRowAndBlockIndex();
        blockValue = generalBlockData[getRandomByLength()];
        tempInitialData[firstBlockData['ri']][firstBlockData['bi']] = blockValue;

        // get second random block
        secondBlockData = getInitialRowAndBlockIndex();
        do {
            secondBlockData = getInitialRowAndBlockIndex();
        } while (firstBlockData['bi'] === secondBlockData['bi'])
        blockValue = generalBlockData[getRandomByLength()];
        tempInitialData[secondBlockData['ri']][secondBlockData['bi']] = blockValue;
        setInjectData([]);
        setBoardData(tempInitialData);
    }

    const getInitialRowAndBlockIndex = () => {
        let rowIndex = 0;
        let blockIndex = 0;
        rowIndex = getRandomByLength(3);
        blockIndex = getRandomByLength(3);
        return { 'ri': rowIndex, 'bi': blockIndex };
    }

    const getRandomByLength = (length = 1) => {
        return Math.round(Math.random() * length);
    }

    const onLeftRight = (action) => {
        const newArray = reArrangeArray(action);
        setBoardData(injectValueAtRandom(newArray));
    }

    const onUpOrDown = (action) => {
        const tempBoardData = [...boardData];
        let columnsArray = [];
        for (let i = 0; i < tempBoardData.length; i++) {
            columnsArray.push([tempBoardData[0][i], tempBoardData[1][i], tempBoardData[2][i], tempBoardData[3][i]]);
        }
        const newArray = reArrangeArray((action === 'up' ? 'left' : 'right'), columnsArray);
        columnsArray = [];
        for (let i = 0; i < newArray.length; i++) {
            columnsArray.push([newArray[0][i], newArray[1][i], newArray[2][i], newArray[3][i]]);
        }
        setBoardData(injectValueAtRandom(columnsArray));
    }

    const reArrangeArray = (action, data = []) => {
        let tempBoardData = [];
        let originalData = [];
        if (data.length > 0) {
            tempBoardData = [...data];
            originalData = data;
        } else {
            tempBoardData = [...boardData];
            originalData = boardData;
        }
        originalData.forEach((row, index) => {
            const rowContainsData = row.some(value => value !== 0);
            if (rowContainsData) {
                const tempRow = action === 'right' ? [...row].reverse() : [...row];
                let indexToCompare = 0;
                do {
                    tempRow.forEach((block, blockIndex) => {
                        if (tempRow[blockIndex - 1] === 0 && block !== 0) {
                            tempRow[blockIndex - 1] = block;
                            tempRow[blockIndex] = 0;
                        }
                    })
                    if (tempRow[indexToCompare] !== 0) {
                        const temp = [...tempRow];
                        const stripedArr = temp.slice(indexToCompare + 1, tempRow.length);

                        if (stripedArr.some(item => item !== 0)) {
                            indexToCompare += 1;
                        }
                    }
                } while (tempRow[indexToCompare] === 0)
                tempRow.forEach((blockItem, index) => {
                    if (index !== tempRow.length - 1) {
                        if (tempRow[index] === tempRow[index + 1]) {
                            tempRow[index] *= 2;
                            tempRow[index + 1] = 0;
                            if (tempRow[index + 2] !== undefined) {
                                tempRow[index + 1] = tempRow[index + 2]
                                tempRow[index + 2] = 0;
                            }
                            if (tempRow[index + 3] !== undefined) {
                                tempRow[index + 2] = tempRow[index + 3]
                                tempRow[index + 3] = 0;
                            }
                        }
                    }
                });
                tempBoardData[index] = action === 'right' ? tempRow.reverse() : tempRow;
            }
        })
        return (tempBoardData);
    }

    const injectValueAtRandom = (data) => {
        let validIndexes = [];
        let rowIndex = null;
        const indexes = [0, 1, 2, 3];

        do {
            validIndexes = [];
            rowIndex = getRandomByLength(indexes.length - 1);
            const row = data[rowIndex];

            validIndexes = row
                .map((item, index) => item === 0 ? index : false)
                .filter((item, index) => item !== false);
            if (validIndexes.length === 0) {
                indexes.splice(rowIndex, 1);
            }
            // check if every row is full of values
            const isBoardFull = data.every(singleRow => singleRow.every(item => item !== 0));
            if (isBoardFull) break;
        } while (validIndexes.length === 0)

        const randomIndex = validIndexes[getRandomByLength(validIndexes.length - 1)];
        const randomValue = generalBlockData[getRandomByLength()];
        data[rowIndex][randomIndex] = randomValue;
        setInjectData([rowIndex, randomIndex]);
        return data;
    }

    return (
        <Fragment>
            <button onClick={startGame}>Restart</button>
            <p>Total Score is : {totalScore}</p>
            <div className='board'>
                {boardData.map((row, index) =>
                    <div className="wrapper" key={index}>
                        {row.map((singleBlock, blockIndex) =>
                            <div key={blockIndex} className={injectData[0] === index && injectData[1] === blockIndex ? 'new-entry' : ''}>
                                <SingleBlock value={singleBlock} />
                            </div>
                        )}
                    </div>
                )}
                <Vertical onUp={() => onUpOrDown('up')} onDown={() => onUpOrDown('down')} />
            </div>
            <Horizontal onLeft={() => onLeftRight('left')} onRight={() => onLeftRight('right')} />
        </Fragment>
    )
}

export default Board;