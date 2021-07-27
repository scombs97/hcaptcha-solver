//Cords for each of the cells used in the hcaptcha challenge
const cells = {
    "A": {
        "topLeft": {
            x: 914,
            y: 227
        },
        "topRight": {
            x: 1039,
            y: 227
        },
        "bottomLeft": {
            x: 914,
            y: 352
        },
        "bottomRight": {
            x: 1039,
            y: 352
        }
    },
    "B": {
        "topLeft": {
            x: 1041,
            y: 227
        },
        "topRight": {
            x: 1166,
            y: 227
        },
        "bottomLeft": {
            x: 1041,
            y: 352
        },
        "bottomRight": {
            x: 1166,
            y: 352
        }
    },
    "C": {
        "topLeft": {
            x: 1167,
            y: 227
        },
        "topRight": {
            x: 1292,
            y: 227
        },
        "bottomLeft": {
            x: 1167,
            y: 352
        },
        "bottomRight": {
            x: 1292,
            y: 352
        }
    },
    "D": {
        "topLeft": {
            x: 914,
            y: 356
        },
        "topRight": {
            x: 1039,
            y: 356
        },
        "bottomLeft": {
            x: 914,
            y: 481
        },
        "bottomRight": {
            x: 1039,
            y: 481
        }
    },
    "E": {
        "topLeft": {
            x: 1041,
            y: 356
        },
        "topRight": {
            x: 1166,
            y: 356
        },
        "bottomLeft": {
            x: 1041,
            y: 481
        },
        "bottomRight": {
            x: 1166,
            y: 481
        }
    },
    "F": {
        "topLeft": {
            x: 1167,
            y: 356
        },
        "topRight": {
            x: 1292,
            y: 356
        },
        "bottomLeft": {
            x: 1167,
            y: 481
        },
        "bottomRight": {
            x: 1292,
            y: 481
        }
    },
    "G": {
        "topLeft": {
            x: 914,
            y: 484
        },
        "topRight": {
            x: 1039,
            y: 484
        },
        "bottomLeft": {
            x: 914,
            y: 609
        },
        "bottomRight": {
            x: 1039,
            y: 609
        }
    },
    "H": {
        "topLeft": {
            x: 1041,
            y: 484
        },
        "topRight": {
            x: 1166,
            y: 484
        },
        "bottomLeft": {
            x: 1041,
            y: 609
        },
        "bottomRight": {
            x: 1166,
            y: 609
        }
    },
    "I": {
        "topLeft": {
            x: 1167,
            y: 484
        },
        "topRight": {
            x: 1292,
            y: 484
        },
        "bottomLeft": {
            x: 1167,
            y: 609
        },
        "bottomRight": {
            x: 1292,
            y: 609
        }
    }
}

const submit = {
    topLeft: {
        x: 993,
        y: 653
    },
    topRight: {
        x: 1073,
        y: 653
    },
    bottomLeft: {
        x: 993,
        y: 688
    },
    bottomRight: {
        x: 1073,
        y: 688
    }
}

//Get random point in a cell
const getRandomPointInCell = (cell) => {
    x1 = cells[cell].topLeft.x
    x2 = cells[cell].topRight.x
    y1 = cells[cell].topLeft.y
    y2 = cells[cell].bottomLeft.y

    const randX = Math.floor(Math.random() * (x2 - x1) + x1)
    const randY = Math.floor(Math.random() * (y2 - y1) + y1)

    return { x: randX, y: randY}
}

//Get random point in the submit button
const getRandomPointInSubmit = () => {
    x1 = submit.topLeft.x
    x2 = submit.topRight.x
    y1 = submit.topLeft.y
    y2 = submit.bottomLeft.y

    const randX = Math.floor(Math.random() * (x2 - x1) + x1)
    const randY = Math.floor(Math.random() * (y2 - y1) + y1)

    return { x: randX, y: randY}
}

module.exports = {
    getRandomPointInCell: getRandomPointInCell,
    getRandomPointInSubmit: getRandomPointInSubmit
}