import geographyCountryNameMap from './data/geographyCountryNameMap'

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

export const getCountriesFormName = (name: string) => {
  const spareCoutries = geographyCountryNameMap[name] ?? []
  return [name, ...spareCoutries]
}
