# nodebook
A tool to make shareable test suites.

# Usage
main.js:
```js
// Some working code.
9 + 10;
// Some code which will give a syntax error.
@({)}
```
From CLI:
```
nodebook create main.js 1-2 3-4
nodebook run nodebook-tests/main.ndbk
```
Returns:
```
------
Test number: 0
Snippet: "// Some working code.
9 + 10;",
Result: "19"
Succeeded: true
------


------
Test number: 1
Snippet: "// Some code which will give a syntax error.
@({)}",
Result: "undefined"
Succeeded: false
Message: SyntaxError: Invalid or unexpected token
------
```
