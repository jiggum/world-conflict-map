export const groupBy = <T>(lst: T[], key: (e: T) => string): { [key: string]: T[] } => {
  return lst.reduce(function (acc: any, e) {
    let group = key(e)

    if (!acc[group]) {
      acc[group] = []
    }

    acc[group].push(e)
    return acc
  }, {})
}
