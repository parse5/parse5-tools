import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as main from '../main.js';
import {html} from 'parse5';
import type {Node, TextNode, DocumentFragment} from '../nodeTypes.js';

test('traverse', async (t) => {
  await t.test('calls node callback when encountered', () => {
    const child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child0, child1]
    };
    let callCount = 0;

    main.traverse(node, {
      node: () => {
        ++callCount;
      }
    });

    assert.strictEqual(callCount, 3);
  });

  const testCases: Array<{
    handler: keyof main.Visitor;
    validNode: Node;
    invalidNode: Node;
  }> = [
    {
      handler: 'documentFragment',
      validNode: {
        nodeName: '#document-fragment',
        childNodes: []
      },
      invalidNode: {
        nodeName: '#text',
        parentNode: null,
        value: 'text node'
      }
    },
    {
      handler: 'document',
      validNode: {
        nodeName: '#document',
        mode: html.DOCUMENT_MODE.NO_QUIRKS,
        childNodes: []
      },
      invalidNode: {
        nodeName: '#text',
        parentNode: null,
        value: 'text node'
      }
    },
    {
      handler: 'element',
      validNode: {
        nodeName: 'div',
        parentNode: null,
        tagName: 'div',
        attrs: [],
        namespaceURI: html.NS.HTML,
        childNodes: []
      },
      invalidNode: {
        nodeName: '#text',
        parentNode: null,
        value: 'text node'
      }
    },
    {
      handler: 'template',
      validNode: {
        nodeName: 'template',
        parentNode: null,
        tagName: 'template',
        attrs: [],
        namespaceURI: html.NS.HTML,
        childNodes: [],
        content: {
          nodeName: '#document-fragment',
          childNodes: []
        }
      },
      invalidNode: {
        nodeName: '#text',
        parentNode: null,
        value: 'text node'
      }
    },
    {
      handler: 'comment',
      validNode: {
        nodeName: '#comment',
        parentNode: null,
        data: 'some text'
      },
      invalidNode: {
        nodeName: '#text',
        parentNode: null,
        value: 'text node'
      }
    },
    {
      handler: 'text',
      validNode: {
        nodeName: '#text',
        parentNode: null,
        value: 'text node'
      },
      invalidNode: {
        nodeName: '#comment',
        parentNode: null,
        data: 'some text'
      }
    },
    {
      handler: 'documentType',
      validNode: {
        nodeName: '#documentType',
        parentNode: null,
        name: 'some-name',
        publicId: 'some-name',
        systemId: 'some-name'
      },
      invalidNode: {
        nodeName: '#comment',
        parentNode: null,
        data: 'some text'
      }
    }
  ];

  for (const testCase of testCases) {
    await t.test(`${testCase.handler} called for valid nodes`, () => {
      let called = false;

      main.traverse(testCase.validNode, {
        [testCase.handler]: () => {
          called = true;
        }
      });

      assert.strictEqual(called, true);
    });

    await t.test(`${testCase.handler} not called for invalid nodes`, () => {
      let called = false;

      main.traverse(testCase.invalidNode, {
        [testCase.handler]: () => {
          called = true;
        }
      });

      assert.strictEqual(called, false);
    });
  }

  await t.test('does not visit children if pre:node is false', () => {
    const child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child0, child1]
    };
    let callCount = 0;

    main.traverse(node, {
      'pre:node': () => false,
      node: () => {
        ++callCount;
      }
    });

    assert.strictEqual(callCount, 1);
  });

  await t.test('visits children if pre:node is true', () => {
    const child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child0]
    };
    let callCount = 0;

    main.traverse(node, {
      'pre:node': () => true,
      node: () => {
        ++callCount;
      }
    });

    assert.strictEqual(callCount, 2);
  });

  await t.test('visits children if pre:node is void', () => {
    const child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child0]
    };
    let callCount = 0;

    main.traverse(node, {
      'pre:node': () => {
        return;
      },
      node: () => {
        ++callCount;
      }
    });

    assert.strictEqual(callCount, 2);
  });
});
