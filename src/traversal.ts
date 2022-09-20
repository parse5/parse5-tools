import type {Node} from 'parse5/dist/tree-adapters/default.js';
import {isParentNode, isChildNode} from './typeGuards.js';

/**
 * Queries the AST for a node which satifies the given condition
 * @param {Node} root Root node to traverse from
 * @param {Function} condition Function to determine if the node matches or not
 * @return {Node|null}
 */
export function query<T extends Node = Node>(
  root: Node,
  condition: (node: Node) => boolean
): T | null {
  for (const child of queryAll<T>(root, condition)) {
    return child;
  }

  return null;
}

/**
 * Walks the tree of a node depth-first and yields each discovered node
 * @param {Node} node Node to traverse from
 */
export function* walkChildren(node: Node): IterableIterator<Node> {
  if (isParentNode(node)) {
    for (const child of node.childNodes) {
      yield child;
      yield* walkChildren(child);
    }
  }
}

/**
 * Queries the AST for nodes which satifies the given condition
 * @param {Node} root Root node to traverse from
 * @param {Function} condition Function to determine if a node matches or not
 */
export function* queryAll<T extends Node = Node>(
  root: Node,
  condition?: (node: Node) => boolean
): IterableIterator<T> {
  for (const child of walkChildren(root)) {
    if (!condition || condition(child)) {
      // This cast is here to make `querySelector<Element>` and such possible.
      // If there's no condition, the node really should be `Node` but
      // sometimes humans might know what they're doing.
      yield child as T;
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
