export default interface Y18n {
  __ (str: string, ...args: any[])
  __n (str: string, ...args: any[])
  setLocale (locale: string): void
  getLocale (): string
  updateLocale (obj: object): void
}
