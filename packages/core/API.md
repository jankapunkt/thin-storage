## Classes

<dl>
<dt><a href="#Document">Document</a></dt>
<dd><p>Holds a reference to a document in the storage.
The reference can be swapped using the {Document.set} method,
which in turn allows updating documents in the set without removing them.</p>
</dd>
<dt><a href="#ThinStorage">ThinStorage</a></dt>
<dd><p>Minimal storage interface using a middleware stack.
Documentation: <a href="https://github.com/jankapunkt/thin-storage">https://github.com/jankapunkt/thin-storage</a></p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#createDocument">createDocument</a> ⇒ <code><a href="#Document">Document</a></code></dt>
<dd><p>Creates a new Document instance by given document object</p>
</dd>
</dl>

<a name="Document"></a>

## Document
Holds a reference to a document in the storage.
The reference can be swapped using the {Document.set} method,
which in turn allows updating documents in the set without removing them.

**Kind**: global class  
**Internal**:   

* [Document](#Document)
    * [new Document(target)](#new_Document_new)
    * [.get()](#Document+get) ⇒ <code>object</code>
    * [.set(target)](#Document+set)

<a name="new_Document_new"></a>

### new Document(target)
Creates a new instance. Requires a target document object.


| Param | Type | Description |
| --- | --- | --- |
| target | <code>object</code> | the document object to point to. |

<a name="Document+get"></a>

### document.get() ⇒ <code>object</code>
Returns the referenced document.

**Kind**: instance method of [<code>Document</code>](#Document)  
<a name="Document+set"></a>

### document.set(target)
Establishes a reference (= points) to the target document object.

**Kind**: instance method of [<code>Document</code>](#Document)  
**Throws**:

- <code>TypeError</code> if the document is not of type 'object'


| Param | Type | Description |
| --- | --- | --- |
| target | <code>object</code> | the document object to point to |

<a name="createDocument"></a>

## createDocument ⇒ [<code>Document</code>](#Document)
Creates a new Document instance by given document object

**Kind**: global constant  
**Returns**: [<code>Document</code>](#Document) - a Document instance  

| Param | Type | Description |
| --- | --- | --- |
| doc | <code>object</code> | the document object to reference |

