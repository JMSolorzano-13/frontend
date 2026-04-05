export default function delayedDownload(links: string[]) {
  if (links.length === 0) return
  const cLink = links[0]
  const link = document.createElement('a')
  link.href = cLink
  link.click()
  setTimeout(() => {
    delayedDownload(links.slice(1))
  }, 2000)
}
