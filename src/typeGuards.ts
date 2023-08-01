import {defaultTreeAdapter} from 'parse5';
import type {DefaultTreeAdapterMap, TreeAdapter} from 'parse5';
import type {
  ParentNode,
  ChildNode,
  Template,
  DocumentFragment,
  Document,
  Node
} from './nodeTypes.js';

type DefaultTreeAdapterLike = TreeAdapter<DefaultTreeAdapterMap>;

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

export const isElementNode: DefaultTreeAdapterLike['isElementNode'] =
  defaultTreeAdapter.isElementNode;

export const isCommentNode: DefaultTreeAdapterLike['isCommentNode'] =
  defaultTreeAdapter.isCommentNode;

export const isDocumentTypeNode: DefaultTreeAdapterLike['isDocumentTypeNode'] =
  defaultTreeAdapter.isDocumentTypeNode;

export const isTextNode: DefaultTreeAdapterLike['isTextNode'] =
  defaultTreeAdapter.isTextNode;

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
