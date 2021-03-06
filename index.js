var fs = require('fs');
var test = (f) => {
    var r = undefined;
    var s = {
        success: true,
        message: null
    };
    try {
        r = eval(f);
        s.result = r;
    } catch (e) {
        s = {
            success: false,
            message: `${e}`
        }
    }
    return s;
}

let enceode = (str) => {
    var result = "";
    for (i=0; i<str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    result = result.match(/.{1,2}/g).map(x=>x.split('').reverse().join('')).join('')
     var str = '';
     for (var i = 0; i < result.length; i += 2) {
        var v = parseInt(result.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
}

let range = (a, b) => {
    let r = [];
    while (a !== b) {
        r.push(a);
        a += 1;
    }
    r.push(b);
    return r;
}

function linesi(s, a, b) {
    a-- && b--;
    s = s.split('\n');
    let lines = [];
    if (b) {
        let r = range(a, b);
        r.forEach((n) => {
            lines.push(s[n]);
        })
        return lines.join('\n');
    } else {
        return s[a];
    }
}

let testi = (file) => {
    var data = JSON.parse(enceode(fs.readFileSync(file).toString()));
    data.chunks.forEach(function(e, i) {
        var results = test(e);
        console.log(`\n------
Test number: ${i+1}
Snippet: "${e}",
Result: "${results.result}"
Succeeded: ${results.success}${results.success == false ?"\nMessage: "+results.message+"\n":"\n"}------\n`)
    });
}

let createSuite = () => {
    var file = process.argv[3];
    var args = process.argv.slice(4);
    if (args.length !== 0) {
        var chunks = [];
        args.forEach(function(a, i) {
            var lines = [fs.readFileSync(file).toString(), a];
            if (lines[1].includes('-')) {
                lines = [fs.readFileSync(file).toString(), lines[1].split('-')[0], lines[1].split('-')[1]]
            }
            var lines = linesi(...lines);
            chunks.push(lines);
        })
        return enceode(JSON.stringify({
            chunks
        }));
    } else {
        console.log('Nodebook error: no lines selected!\nExample: "nodebook create main.js 1-4"')
    }
}

if (process.argv[2] && process.argv[3]) {
    if (process.argv[2] == "run") {
        testi(process.argv[3]);
    } else if (process.argv[2] == "create") {
      if (!fs.existsSync('nodebook-tests')) {
        fs.mkdirSync("nodebook-tests");
      }
        fs.writeFileSync('nodebook-tests/'+process.argv[3].split('.').slice(0, -1).join('.') + '.ndbk', createSuite())
        console.log('Test created! Use "nodebook run nodebook-tests/' + process.argv[3].split('.').slice(0, -1).join('.') + '.ndbk to run this test!')
    } else {
        console.log('Nodebook error: function does not exist!')
    }
} else {
    console.log('Nodebook error: Arguments 1 and 2 missing!')
}
