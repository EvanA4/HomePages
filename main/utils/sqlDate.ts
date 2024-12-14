export function toSQLDate(src: string): string {
    let monthToInt: {[month: string]: number} = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    }

    let strSplit = src.split(" ")

    return `${strSplit[2]}-${monthToInt[strSplit[0]]}-${strSplit[1].slice(0, strSplit[1].length - 1)}`
}