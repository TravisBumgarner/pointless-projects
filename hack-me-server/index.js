const express = require("express");
const prettier = require("prettier");
const app = express();
app.use(express.json());

const logs = [];

app.get("/logs", async (req, res) => {
  res.send(`
    <html>
      <body>
        ${logs
          .map(
            (log) => `
          <div class="log-entry">
            <time>${new Date(log.timestamp).toLocaleString()}</time>
            <pre><code>${log.code}</code></pre>
            <pre><code>${prettier.format(log.code, {
              parser: "babel",
              semi: true,
              singleQuote: false,
            })}</code></pre>
          </div>
        `
          )
          .join("")}
      </body>
      <style>
        .log-entry { margin-bottom: 2em; }
        time { color: #666; }
        pre { background: #f5f5f5; padding: 1em; }
      </style>
    </html>
  `);
});

app.get("/", (req, res) => {
  res.send(
    'Try posting to this endpoint with some code to eval, for example: <pre><code>curl -X POST https://eval.nfshost.com/ \
  -H "Content-Type: application/json" \
  -d \'{"code": "1 + 1"}\'</code></pre>'
  );
});

app.post("/", (req, res) => {
  const code = req.body.code;
  logs.push({ code, timestamp: Date.now() });
  try {
    const result = eval(code);
    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }
});

app.listen(3001, () => console.log("Evil eval server running on port 3001"));
