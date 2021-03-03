/* eslint-disable more/no-c-like-loops */
module.exports = {
  getXPath,
  getCSSPath,
}

function getXPath(element) {
  const elTag = (el) => el.tagName.toLowerCase()
  if (element === document.body) return elTag(element)
  let ix = 0
  let siblings = element.parentNode.childNodes

  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i]
    if (sibling === element) {
      let parent = getXPath(element.parentNode)
      if (parent === 'body') parent = './'

      const tag = elTag(element)

      let id = ''
      let classes = ''

      const index = `[${ix + 1}]`

      return `${parent}/${tag}${id}${classes}${index}`
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++
    }
  }
}

// https://github.com/ChromeDevTools/devtools-frontend/blob/90faf09ce976a9ef6a887869fd422c4b52fb19bc/front_end/elements/DOMPath.js#L27

function getCSSPath(node, optimized) {
  const ELEMENT_NODE = 1
  const DOCUMENT_NODE = 9

  if (node.nodeType !== ELEMENT_NODE) return ''

  const steps = []
  let contextNode = node

  while (contextNode) {
    const step = _cssPathStep(contextNode, !!optimized, contextNode === node)
    if (!step) break

    steps.push(step)
    if (step.optimized) break

    contextNode = contextNode.parentNode
  }

  return steps.reverse().join(' > ')

  function _cssPathStep(node, optimized, isTargetNode) {
    class Step {
      constructor(value, optimized) {
        this.value = value
        this.optimized = optimized || false
      }

      toString() {
        return this.value
      }
    }
    if (node.nodeType !== ELEMENT_NODE) {
      return null
    }

    const id = node.getAttribute('id')
    const nodeName = node.nodeName.toLowerCase()

    if (optimized) {
      if (id) {
        return new Step(idSelector(id), true)
      }
      if (['body', 'head', 'html'].includes(nodeName)) {
        return new Step(nodeName, true)
      }
    }
    /*
    if (id) {
      return new Step(nodeName + idSelector(id), true)
    }
    */
    const parent = node.parentNode
    if (!parent || parent.nodeType === DOCUMENT_NODE) {
      return new Step(nodeName, true)
    }

    function prefixedElementClassNames(node) {
      const classAttribute = node.getAttribute('class')
      if (!classAttribute) {
        return []
      }

      return classAttribute
        .split(/\s+/g)
        .filter(Boolean)
        .map((name) => '$' + name)
    }

    function idSelector(id) {
      return '#' + cssEscape(id)
    }

    function cssEscape(value) {
      if (arguments.length == 0) return ''
      let string = String(value)
      let length = string.length
      let index = -1
      let codeUnit
      let result = ''
      let firstCodeUnit = string.charCodeAt(0)
      while (++index < length) {
        codeUnit = string.charCodeAt(index)
        if (codeUnit == 0x0000) {
          result += '\uFFFD'
          continue
        }

        if (
          (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
          codeUnit == 0x007f ||
          (index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
          (index == 1 &&
            codeUnit >= 0x0030 &&
            codeUnit <= 0x0039 &&
            firstCodeUnit == 0x002d)
        ) {
          result += '\\' + codeUnit.toString(16) + ' '
          continue
        }

        if (index == 0 && length == 1 && codeUnit == 0x002d) {
          result += '\\' + string.charAt(index)
          continue
        }

        if (
          codeUnit >= 0x0080 ||
          codeUnit == 0x002d ||
          codeUnit == 0x005f ||
          (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
          (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
          (codeUnit >= 0x0061 && codeUnit <= 0x007a)
        ) {
          result += string.charAt(index)
          continue
        }

        result += '\\' + string.charAt(index)
      }
      return result
    }

    const prefixedOwnClassNamesArray = prefixedElementClassNames(node)
    let needsClassNames = false
    let needsNthChild = false
    let ownIndex = -1
    let elementIndex = -1
    const siblings = parent.children

    for (
      let i = 0;
      (ownIndex === -1 || !needsNthChild) && i < siblings.length;
      ++i
    ) {
      const sibling = siblings[i]
      if (sibling.nodeType !== ELEMENT_NODE) {
        continue
      }
      elementIndex += 1
      if (sibling === node) {
        ownIndex = elementIndex
        continue
      }
      if (needsNthChild) {
        continue
      }
      if (sibling.nodeName.toLowerCase() !== nodeName) {
        continue
      }

      needsClassNames = true
      const ownClassNames = new Set(prefixedOwnClassNamesArray)
      if (!ownClassNames.size) {
        needsNthChild = true
        continue
      }
      const siblingClassNamesArray = prefixedElementClassNames(sibling)
      for (let j = 0; j < siblingClassNamesArray.length; ++j) {
        const siblingClass = siblingClassNamesArray[j]
        if (!ownClassNames.has(siblingClass)) {
          continue
        }
        ownClassNames.delete(siblingClass)
        if (!ownClassNames.size) {
          needsNthChild = true
          break
        }
      }
    }

    let result = nodeName
    if (
      isTargetNode &&
      nodeName.toLowerCase() === 'input' &&
      node.getAttribute('type') &&
      //!node.getAttribute('id') &&
      !node.getAttribute('class')
    ) {
      result += '[type=' + cssEscape(node.getAttribute('type') || '') + ']'
    }
    if (needsNthChild) {
      result += ':nth-child(' + (ownIndex + 1) + ')'
    } else if (needsClassNames) {
      for (const prefixedName of prefixedOwnClassNamesArray) {
        result += '.' + cssEscape(prefixedName.slice(1))
      }
    }

    return new Step(result, false)
  }
}
