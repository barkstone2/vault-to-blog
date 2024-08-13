export function addNewTag(nodes, open, close, childCallback) {
  nodes.push({
    type: 'html',
    value: open
  })
  childCallback()
  nodes.push({
    type: 'html',
    value: close
  })
}