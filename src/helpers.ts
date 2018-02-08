export const defineProps = (
  obj,
  props: { [key: string]: { get: string, set?: string } |
    { getFn: () => any, setFn?: (value: any) => void } | { value: any } }
) => {
  for (const key in props) {
    if (key in obj) return obj
    const p: any = props[key]
    if (p.value) {
      props[key] = { value: p.value } as any
    } else if (p.getFn) {
      props[key] = { get: p.getFn, set: p.setFn } as any
    } else {
      const get = p.get
      p.get = (...args) => obj[get](...args)
      if (p.set) {
        const set = p.set
        p.set = (...args) => obj[set](...args)
      }
    }
  }
  return Object.defineProperties(obj, props as any)
}
