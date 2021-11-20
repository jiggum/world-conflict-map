import geographyCountryNameMap from './data/geographyCountryNameMap'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

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

export const parseRemark = (() => {
  const remarkProcessor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify)
  return (description: string) =>
    remarkProcessor
      .processSync(description).value.toString()
      .replaceAll('<a href', '<a target="_blank" href')
})()
