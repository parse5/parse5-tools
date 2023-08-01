import type {
  Element,
  ParentNode,
  CommentNode,
  TextNode,
  Template,
  DocumentFragment,
  Document,
  DocumentType,
  Node
} from './nodeTypes.js';
import {
  isParentNode,
  isDocument,
  isElementNode,
  isTemplateNode,
  isCommentNode,
  isTextNode,
  isDocumentFragment,
  isDocumentTypeNode
} from './typeGuards.js';

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
