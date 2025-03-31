# About

A server that is super vulnerable to attacks. Because why not throw `eval` into it.

# Examples

**Basic**

```js
curl -X POST https://eval.nfshost.com/ \
  -H "Content-Type: application/json" \
  -d '{"code": "1 + 1"}'
```

**Add a new route**

```js
curl -X POST https://eval.nfshost.com/ \
  -H "Content-Type: application/json" \
  -d '{"code": "app.get(\"/foobar\", (req, res) => res.send(\"woohoo\"))"}'
  ```
