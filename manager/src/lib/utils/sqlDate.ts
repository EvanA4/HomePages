export function toSQLDate(src: string): Date {
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

    return new Date(parseInt(strSplit[2]), monthToInt[strSplit[0]] - 1, parseInt(strSplit[1].slice(0, strSplit[1].length - 1)));
}


export function fromSQLDate(src: string): string {
    let newTime = src.replaceAll('T', ' ').split('.')[0];
    let t: any = newTime.split(/[- :]/);
    let dateObj = new Date(parseInt(t[0]), parseInt(t[1]) - 1, parseInt(t[2]));
    let options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString("en-US", options);
}