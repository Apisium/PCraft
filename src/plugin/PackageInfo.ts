export default interface PackageInfo {
  name: string
  version: string
  pcraft: number
  displayName?: string
  description?: string
  repository?: string | { type: string, url: string }
  keywords?: string[]
  author?: AuthorType
  contributors?: AuthorType[]
  license?: string
  extends?: string[]
  optionalExtends?: string[]
  [name: string]: any
}
export interface Author {
  name?: string
  email?: string
  url?: string
}
export type AuthorType = string | Author
