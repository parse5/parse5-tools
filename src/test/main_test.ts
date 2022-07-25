import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as main from '../main.js';
import {
  defaultTreeAdapter,
  Document,
  CommentNode,
  Element,
  TextNode,
  NodeType,
  Template,
  DocumentType,
  DocumentFragment
} from 'parse5/dist/tree-adapters/default.js';
import {DOCUMENT_MODE, NS} from 'parse5/dist/common/html.js';

test('isElementNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.isElementNode, defaultTreeAdapter.isElementNode);
  });
});

test('isCommentNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.isCommentNode, defaultTreeAdapter.isCommentNode);
  });
});

test('isDocumentTypeNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(
      main.isDocumentTypeNode,
      defaultTreeAdapter.isDocumentTypeNode
    );
  });
});

test('isTextNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.isTextNode, defaultTreeAdapter.isTextNode);
  });
});

test('isDocument', async (t) => {
  await t.test('true for document nodes', () => {
    const result = main.isDocument({
      nodeName: NodeType.Document,
      mode: DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    });

    assert.ok(result);
  });

  await t.test('false for non-document nodes', () => {
    const result = main.isDocument({
      nodeName: NodeType.Text,
      value: 'pewpew',
      parentNode: null
    });

    assert.strictEqual(result, false);
  });
});

test('isDocumentFragment', async (t) => {
  await t.test('true for document fragment nodes', () => {
    const result = main.isDocumentFragment({
      nodeName: NodeType.DocumentFragment,
      childNodes: []
    });

    assert.ok(result);
  });

  await t.test('false for non-document-fragment nodes', () => {
    const result = main.isDocument({
      nodeName: NodeType.Text,
      value: 'pewpew',
      parentNode: null
    });

    assert.strictEqual(result, false);
  });
});

test('isTemplateNode', async (t) => {
  await t.test('true for template nodes', () => {
    const result = main.isTemplateNode({
      nodeName: 'template',
      tagName: 'template',
      content: {
        nodeName: NodeType.DocumentFragment,
        childNodes: []
      },
      attrs: [],
      namespaceURI: NS.HTML,
      parentNode: null,
      childNodes: []
    });

    assert.ok(result);
  });

  await t.test('false for non-document-fragment nodes', () => {
    const result = main.isTemplateNode({
      nodeName: NodeType.Text,
      value: 'pewpew',
      parentNode: null
    });

    assert.strictEqual(result, false);
  });
});

test('appendChild', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.appendChild, defaultTreeAdapter.appendChild);
  });
});

test('isParentNode', async (t) => {
  await t.test('true for document nodes', () => {
    const node: Document = {
      nodeName: NodeType.Document,
      mode: DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('true for document fragment nodes', () => {
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('true for element nodes', () => {
    const node: Element = {
      nodeName: 'div',
      tagName: 'DIV',
      attrs: [],
      namespaceURI: NS.HTML,
      parentNode: null,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('true for template nodes', () => {
    const node: Template = {
      nodeName: 'template',
      tagName: 'template',
      content: {
        nodeName: NodeType.DocumentFragment,
        childNodes: []
      },
      attrs: [],
      namespaceURI: NS.HTML,
      parentNode: null,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('false for text nodes', () => {
    const node: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'well hello there'
    };
    assert.strictEqual(main.isParentNode(node), false);
  });
});

test('isChildNode', async (t) => {
  await t.test('true for element nodes', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: []
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for template nodes', () => {
    const node: Template = {
      nodeName: 'template',
      parentNode: null,
      tagName: 'template',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: [],
      content: {
        nodeName: NodeType.DocumentFragment,
        childNodes: []
      }
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for comment nodes', () => {
    const node: CommentNode = {
      nodeName: NodeType.Comment,
      parentNode: null,
      data: 'oogaboogah'
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for text nodes', () => {
    const node: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'well hello there'
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for document type nodes', () => {
    const node: DocumentType = {
      nodeName: NodeType.DocumentType,
      parentNode: null,
      name: 'cats',
      publicId: 'c-a-t-s',
      systemId: 'm-e-o-w'
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('false for document nodes', () => {
    const node: Document = {
      nodeName: NodeType.Document,
      mode: DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    };
    assert.strictEqual(main.isChildNode(node), false);
  });
});

test('spliceChildren', async (t) => {
  await t.test('deletes without new children', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: '001'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: '010'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1, child2]
    };

    const result = main.spliceChildren(node, 0, 1);

    assert.strictEqual(node.childNodes.length, 1);
    assert.strictEqual(node.childNodes[0], child2);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child1);
  });

  await t.test('deletes from specified index', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const child3: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'three'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1, child2, child3]
    };

    const result = main.spliceChildren(node, 1, 1);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child3);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child2);
  });

  await t.test('appends without deleting if deleteCount is 0', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1]
    };

    const result = main.spliceChildren(node, 0, 0, child2);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child2);
    assert.strictEqual(node.childNodes[1], child1);
    assert.strictEqual(result.length, 0);
  });

  await t.test('appends at specified index', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1]
    };

    const result = main.spliceChildren(node, 1, 0, child2);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child2);
    assert.strictEqual(result.length, 0);
  });

  await t.test('deletes then appends new children', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const child3: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'three'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1, child2]
    };

    const result = main.spliceChildren(node, 1, 1, child3);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child3);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child2);
  });

  await t.test('ignores nodes which are not parent nodes', () => {
    const node: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'three'
    };
    const result = main.spliceChildren(node, 0, 1);

    assert.strictEqual(result.length, 0);
  });
});
