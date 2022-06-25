# parse5-tools

A set of tools for interacting with and manipulating a parse5 AST.

# WIP

This is a work in progress until we achieve the same functionality dom5 and modernweb have.

## Suggested interface

* Tree interaction
  * replaceWith
* Attributes
  * setAttribute
  * getAttribute
  * hasAttribute
  * removeAttribute
  * getAttributeIndex
  * getAttributes
* Node interaction
  * getTextContent
  * setTextContent
  * normalizeNode
* Traversal
  * query
  * queryAll
  * treeMap
  * ancestors
  * previousSiblings
  * nextSiblings
  * prior
  * walk

## dom5

* Mutation
  * [x] replaceNode
  * [x] removeNodeSaveChildren - use `replaceWith`
  * [ ] removeFakeRootElements
* Iteration
  * [x] treeMap
  * [x] depthFirst
  * [x] depthFirstReversed
  * [x] depthFirstIncludingTemplates
  * [x] ancestors
  * [x] previousSiblings
  * [x] prior
  * [x] query
  * [x] queryAll
* Utilities
  * [x] getTextContent
  * [x] getAttribute
  * [x] getAttributeIndex
  * [x] hasAttribute
  * [x] setAttribute
  * [x] removeAttribute
  * [x] normalize
  * [x] setTextContent

Many of the iteration functions use a predicate concept to allow filtering.

## modernweb

* Mutation
  * [ ] createScript - use `createElement` instead
  * [x] setAttribute
  * [ ] setAttributes - use `setAttribute` instead
  * [x] removeAttribute
  * [ ] prependToDocument
  * [ ] appendToDocument
* Utilities
  * [ ] isHtmlFragment
  * [x] hasAttribute
  * [x] getAttribute
  * [x] getAttributes
* Iteration
  * [x] findNode
  * [x] findNodes
  * [ ] findElement - use `findNode` with a type guard
  * [ ] findElements - use `findNodes` with a type guard
