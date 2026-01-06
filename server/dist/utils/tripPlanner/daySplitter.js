export function splitIntoDays(route, totalDays) {
    console.log(totalDays);
    const perDay = Math.ceil(route.length / totalDays);
    const result = [];
    console.log('suck', perDay);
    for (let i = 0; i < route.length; i += perDay) {
        result.push(route.slice(i, i + perDay));
    }
    return result;
}
