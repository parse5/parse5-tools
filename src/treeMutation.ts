import {defaultTreeAdapter} from 'parse5';
import type {DefaultTreeAdapterMap, TreeAdapter} from 'parse5';
import {isChildNode, isParentNode} from './typeGuards.js';
import type {ChildNode, Node} from './nodeTypes.js';

type DefaultTreeAdapterLike = TreeAdapter<DefaultTreeAdapterMap>;

/**
 * Attempts to remove the given node from the AST
 * @param {Node} node Node to remove
 * @return {void}
 */
export function removeNode(node: Node): void {
  if (!isChildNode(node)) {
    // Must already be detached, or someone made an absurd AST
    return;
  }
  defaultTreeAdapter.detachNode(node);
}

export const appendChild: DefaultTreeAdapterLike['appendChild'] =
  defaultTreeAdapter.appendChild;

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
