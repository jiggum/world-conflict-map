import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing'

export function link(node: any, _: any, context: any) {
  const exit = context.enter('link')
  const subexit = context.enter('label')
  const value = containerPhrasing(node, context, {before: '[', after: ']'})
  subexit()
  exit()
  return value
}
