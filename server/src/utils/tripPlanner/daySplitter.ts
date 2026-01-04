

export function splitIntoDays<T>(
  route: T[],
  totalDays: number
): T[][] {
  console.log(totalDays)
  const perDay = Math.ceil(route.length / totalDays);
  const result: T[][] = [];
  
  console.log('suck',perDay)
  for (let i = 0; i < route.length; i += perDay) {
    result.push(route.slice(i, i + perDay));
  } 

  return result;
}
