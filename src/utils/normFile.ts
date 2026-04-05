export default function normFile(e: any) {
  if (Array.isArray(e)) {
    return e
  }
  return e && e.fileList
}
