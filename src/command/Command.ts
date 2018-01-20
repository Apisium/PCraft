export default (name: string): any => (target: any) => {
  target.commandMame = name
}
