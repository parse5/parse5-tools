import {defaultTreeAdapter} from 'parse5';
import type {
  Element,
  ParentNode,
  CommentNode,
  ChildNode,
  TextNode,
  Template,
  DocumentFragment,
  Document,
  DocumentType,
  Node
} from 'parse5/dist/tree-adapters/default.js';

/**
 * Determines if a given node is a document or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isDocument(node: Node): node is Document {
  return node.nodeName === '#document';
}

/**
 * Determines if a given node is a document fragment or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeName === '#document-fragment';
}

/**
 * Determines if a given node is a template node or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isTemplateNode(node: Node): node is Template {
  return node.nodeName === 'template';
}

export const isElementNode = defaultTreeAdapter.isElementNode;

export const isCommentNode = defaultTreeAdapter.isCommentNode;

export const isDocumentTypeNode = defaultTreeAdapter.isDocumentTypeNode;

export const isTextNode = defaultTreeAdapter.isTextNode;

export const appendChild = defaultTreeAdapter.appendChild;

/**
 * Determines if a given node is a parent or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isParentNode(node: Node): node is ParentNode {
  return (
    isDocument(node) ||
    isDocumentFragment(node) ||
    isElementNode(node) ||
    isTemplateNode(node)
  );
}

/**
 * Determines if a given node is a child or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isChildNode(node: Node): node is ChildNode {
  return (
    isElementNode(node) ||
    isTemplateNode(node) ||
    isCommentNode(node) ||
    isTextNode(node) ||
    isDocumentTypeNode(node)
  );
}

/**
 * Performs a splice on the children of the given node
 * @param {Node} node Node to splice children of
 * @param {number} start Index to begin removing nodes from
 * @param {number} deleteCount Number of nodes to delete
 * @param {...ChildNode} children Children to add
 * @return {void}
 */
export function spliceChildren(
  node: Node,
  start: number,
  deleteCount: number,
  ...children: ChildNode[]
): ChildNode[] {
  if (isParentNode(node)) {
    return node.childNodes.splice(start, deleteCount, ...children);
  }

  return [];
}

/**
 * Replaces the given node with a set of nodes
 * @param {ChildNode} node Node to be replaced
 * @param {...ChildNode} replacements Nodes to be used as replacements
 * @return {void}
 */
export function replaceWith(
  node: ChildNode,
  ...replacements: ChildNode[]
): void {
  if (node.parentNode) {
    const parentNode = node.parentNode;
    const index = parentNode.childNodes.indexOf(node);

    if (index > -1) {
      spliceChildren(
        parentNode,
        parentNode.childNodes.indexOf(node),
        1,
        ...replacements
      );

      for (const replacement of replacements) {
        replacement.parentNode = parentNode;
      }
    }

    node.parentNode = null;
  }
}

/**
 * Sets the given attribute on the specified node
 * @param {Element} node Node to set attribute on
 * @param {string} name Name of the attribute to set
 * @param {string} value Value of the attribute
 * @return {void}
 */
export function setAttribute(node: Element, name: string, value: string): void {
  node.attrs.push({
    name,
    value
  });
}

/**
 * Gets an attribute from a given node
 * @param {Element} node Node to retrieve attribute from
 * @param {string} name Name of the attribute to get
 * @return {string|null}
 */
export function getAttribute(node: Element, name: string): string | null {
  return node.attrs.find((attr) => attr.name === name)?.value ?? null;
}

/**
 * Determines if the node has the specified attribute
 * @param {Element} node Node to test
 * @param {string} name Attribute to look for
 * @return {boolean}
 */
export function hasAttribute(node: Element, name: string): boolean {
  return node.attrs.some((attr) => attr.name === name);
}

/**
 * Removes an attribute from a given node
 * @param {Element} node Node to retrieve attribute from
 * @param {string} name Name of the attribute to remove
 * @return {void}
 */
export function removeAttribute(node: Element, name: string): void {
  const index = getAttributeIndex(node, name);

  if (index > -1) {
    node.attrs.splice(index, 1);
  }
}

/**
 * Gets the index of an attribute from a given node
 * @param {Element} node Node to retrieve attribute from
 * @param {string} name Name of the attribute to retrieve index of
 * @return {number}
 */
export function getAttributeIndex(node: Element, name: string): number {
  return node.attrs.findIndex((attr) => attr.name === name);
}

/**
 * Computes the text content of a given node using a similar
 * algorithm to that of `textContent` in the browser
 * @param {Node} node Node to compute text of
 * @return {string}
 */
export function getTextContent(node: Node): string {
  if (isCommentNode(node)) {
    return node.data;
  }

  if (isTextNode(node)) {
    return node.value;
  }

  let content = '';

  const children = queryAll(
    node,
    (node) => isTextNode(node) || isCommentNode(node)
  );

  for (const child of children) {
    content += getTextContent(child);
  }

  return content;
}

/**
 * Creates a text node
 * @param {string} value Text contents of the new node
 * @return {TextNode}
 */
export function createTextNode(value: string): TextNode {
  return {
    nodeName: '#text',
    value,
    parentNode: null
  };
}

/**
 * Sets the text content of the given node
 * @param {Node} node Node to set contents of
 * @param {string} text Text to use as contents
 * @return {void}
 */
export function setTextContent(node: Node, text: string): void {
  if (isCommentNode(node)) {
    node.data = text;
  } else if (isTextNode(node)) {
    node.value = text;
  } else if (isParentNode(node)) {
    const textNode = createTextNode(text);
    appendChild(node, textNode);
  }
}

/**
 * Queries the AST for a node which satifies the given condition
 * @param {Node} root Root node to traverse from
 * @param {Function} condition Function to determine if the node matches or not
 * @return {Node|null}
 */
export function query(
  root: Node,
  condition: (node: Node) => boolean
): Node | null {
  for (const child of queryAll(root, condition)) {
    return child;
  }

  return null;
}

/**
 * Walks the tree of a node depth-first and yields each discovered node
 * @param {Node} node Node to traverse from
 */
export function* walkChildren(node: Node): IterableIterator<Node> {
  yield node;

  if (isParentNode(node)) {
    for (const child of node.childNodes) {
      yield* walkChildren(child);
    }
  }
}

/**
 * Queries the AST for nodes which satifies the given condition
 * @param {Node} root Root node to traverse from
 * @param {Function} condition Function to determine if a node matches or not
 */
export function* queryAll(
  root: Node,
  condition?: (node: Node) => boolean
): IterableIterator<Node> {
  for (const child of walkChildren(root)) {
    if (!condition || condition(child)) {
      yield child;
    }
  }
}

/**
 * Computes the ancestors of a given node
 * @param {Node} node Node to traverse from
 */
export function* ancestors(node: Node): IterableIterator<Node> {
  let current: Node | null = node;

  while (current !== null) {
    yield current;

    if (isChildNode(current)) {
      current = current.parentNode;
    } else {
      current = null;
    }
  }
}

/**
 * Computes the previous siblings of a given node
 * @param {Node} node Node to traverse from
 */
export function* previousSiblings(node: Node): IterableIterator<Node> {
  if (!isChildNode(node) || !node.parentNode) {
    return;
  }

  const children = node.parentNode.childNodes;
  const index = children.indexOf(node);

  for (let i = index - 1; i >= 0; i--) {
    yield children[i];
  }
}

/**
 * Computes the next siblings of a given node
 * @param {Node} node Node to traverse from
 */
export function* nextSiblings(node: Node): IterableIterator<Node> {
  if (!isChildNode(node) || !node.parentNode) {
    return;
  }

  const children = node.parentNode.childNodes;
  const index = children.indexOf(node);

  for (let i = index + 1; i < children.length; i++) {
    yield children[i];
  }
}

export interface Visitor {
  'pre:node'?: (node: Node, parent?: ParentNode) => boolean | void;
  node?: (node: Node, parent?: ParentNode) => void;
  document?: (node: Document) => void;
  documentFragment?: (node: DocumentFragment, parent?: ParentNode) => void;
  element?: (node: Element, parent?: ParentNode) => void;
  comment?: (node: CommentNode, parent?: ParentNode) => void;
  template?: (node: Template, parent?: ParentNode) => void;
  text?: (node: TextNode, parent?: ParentNode) => void;
  documentType?: (node: DocumentType, parent?: ParentNode) => void;
}

/**
 * Traverses the tree of a given node
 * @param {Node} node Node to traverse
 * @param {Visitor} visitor Visitor to apply
 * @param {ParentNode=} parent Parent node of the current node
 * @return {void}
 */
export function traverse(
  node: Node,
  visitor: Visitor,
  parent?: ParentNode
): void {
  const shouldVisitChildren =
    typeof visitor['pre:node'] !== 'function' ||
    visitor['pre:node'](node, parent) !== false;

  if (shouldVisitChildren && isParentNode(node)) {
    for (const child of node.childNodes) {
      traverse(child, visitor, node);
    }
  }

  if (typeof visitor.node === 'function') {
    visitor.node(node, parent);
  }

  if (typeof visitor.document === 'function' && isDocument(node)) {
    visitor.document(node);
  }

  if (
    typeof visitor.documentFragment === 'function' &&
    isDocumentFragment(node)
  ) {
    visitor.documentFragment(node, parent);
  }

  if (typeof visitor.element === 'function' && isElementNode(node)) {
    visitor.element(node, parent);
  }

  if (typeof visitor.template === 'function' && isTemplateNode(node)) {
    visitor.template(node, parent);
  }

  if (typeof visitor.comment === 'function' && isCommentNode(node)) {
    visitor.comment(node, parent);
  }

  if (typeof visitor.text === 'function' && isTextNode(node)) {
    visitor.text(node, parent);
  }

  if (typeof visitor.documentType === 'function' && isDocumentTypeNode(node)) {
    visitor.documentType(node, parent);
  }
}
