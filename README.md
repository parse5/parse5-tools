# parse5-tools

A set of tools for interacting with and manipulating a parse5 AST.

# WIP

This is a work in progress until we achieve the same functionality dom5 and modernweb have.

## dom5

* Mutation
  * replaceNode
  * removeNode
  * insertBefore
  * insertAfter
  * removeNodeSaveChildren
  * removeFakeRootElements
  * appendNode
  * newTextNode
  * newCommentNode
  * newElement
  * newDocumentFragment
* Iteration
  * treeMap
  * depthFirst
  * depthFirstReversed
  * depthFirstIncludingTemplates
  * ancestors
  * previousSiblings
  * prior
  * query
  * queryAll
* Utilities
  * getTextContent
  * getAttribute
  * getAttributeIndex
  * hasAttribute
  * setAttribute
  * removeAttribute
  * normalize
  * setTextContent

Many of the iteration functions use a predicate concept to allow filtering.

## modernweb

* Mutation
  * createDocument
  * createDocumentFragment
  * createElement
  * createScript
  * createCommentNode
  * appendChild
  * insertBefore
  * setTemplateContent
  * getTemplateContent
  * setDocumentType
  * setDocumentMode
  * getDocumentMode
  * detachNode
  * insertText
  * insertTextBefore
  * adoptAttributes
  * setNodeSourceCodeLocation
  * updateNodeSourceCodeLocation
  * setAttribute
  * setAttributes
  * remove
  * removeAttribute
  * prependToDocument
  * appendToDocument
* Utilities
  * getFirstChild
  * getChildNodes
  * getParentNode
  * getAttrList
  * getTagName
  * getNamespaceURI
  * getTextNodeContent
  * getCommentNodeContent
  * getDocumentTypeNodeName
  * getDocumentTypeNodePublicId
  * getDocumentTypeNodeSystemId
  * isTextNode
  * isCommentNode
  * isDocumentTypeNode
  * isElementNode
  * getNodeSourceCodeLocation
  * isHtmlFragment
  * hasAttribute
  * getAttribute
  * getAttributes
* Iteration
  * findNode
  * findNodes
  * findElement
  * findElements
