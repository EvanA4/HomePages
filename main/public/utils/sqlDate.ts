export function fromSQLDate(src: string): string {
    let newTime = src.replaceAll('T', ' ').split('.')[0];
    let t: any = newTime.split(/[- :]/);
    let dateObj = new Date(parseInt(t[0]), parseInt(t[1]) - 1, parseInt(t[2]));
    let options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString("en-US", options);
}