# parse5-tools

A set of tools for interacting with and manipulating a parse5 AST.

# WIP

This is a work in progress until we achieve the same functionality dom5 and modernweb have.

## Suggested interface

* Node creation
  * createTextNode
  * createCommentNode
  * createElement
  * createDocumentFragment
  * createDocument
* Mutation
  * replaceNode
  * removeNode
  * insertBefore
  * insertAfter
  * appendNode
* Attributes
  * setAttribute
  * getAttribute
  * hasAttribute
  * removeAttribute
  * getAttributeIndex
  * getAttributes
* Node mutation
  * getTextContent
  * setTextContent

## dom5

* Mutation
  * [x] replaceNode
  * [x] removeNode
  * [x] insertBefore
  * [x] insertAfter
  * [] removeNodeSaveChildren
  * [] removeFakeRootElements
  * [x] appendNode
  * [x] newTextNode
  * [x] newCommentNode
  * [x] newElement
  * [x] newDocumentFragment
* Iteration
  * [] treeMap
  * [] depthFirst
  * [] depthFirstReversed
  * [] depthFirstIncludingTemplates
  * [] ancestors
  * [] previousSiblings
  * [] prior
  * [] query
  * [] queryAll
* Utilities
  * [x] getTextContent
  * [x] getAttribute
  * [x] getAttributeIndex
  * [x] hasAttribute
  * [x] setAttribute
  * [x] removeAttribute
  * [] normalize
  * [x] setTextContent

Many of the iteration functions use a predicate concept to allow filtering.

## modernweb

* Mutation
  * [x] createDocument
  * [x] createDocumentFragment
  * [x] createElement
  * [] createScript - use `createElement` instead
  * [x] createCommentNode
  * [x] appendChild
  * [x] insertBefore
  * [] setTemplateContent 🔌
  * [] getTemplateContent 🔌
  * [] setDocumentType 🔌
  * [] setDocumentMode 🔌
  * [] getDocumentMode 🔌
  * [] detachNode 🔌
  * [] insertText 🔌
  * [] insertTextBefore 🔌
  * [] adoptAttributes 🔌
  * [] setNodeSourceCodeLocation 🔌
  * [] updateNodeSourceCodeLocation 🔌
  * [x] setAttribute
  * [] setAttributes
  * [x] remove
  * [x] removeAttribute
  * [] prependToDocument
  * [] appendToDocument
* Utilities
  * [] getFirstChild
  * [] getChildNodes
  * [] getParentNode
  * [] getAttrList
  * [] getTagName
  * [] getNamespaceURI
  * [] getTextNodeContent
  * [] getCommentNodeContent
  * [] getDocumentTypeNodeName
  * [] getDocumentTypeNodePublicId
  * [] getDocumentTypeNodeSystemId
  * [] isTextNode
  * [] isCommentNode
  * [] isDocumentTypeNode
  * [] isElementNode
  * [] getNodeSourceCodeLocation
  * [] isHtmlFragment
  * [x] hasAttribute
  * [x] getAttribute
  * [x] getAttributes
* Iteration
  * [] findNode
  * [] findNodes
  * [] findElement
  * [] findElements

Key:

* 🔌 - functionality already provided by parse5 adapter
