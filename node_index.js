let PORT = 3000;
let http = require('http');
let url = require('url');
let fs = require('fs');
// let mine = require('./mine').types;
let path = require('path');
let mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

let server = http.createServer((request, response) => {
    // console.log(111, request.url)
    // console.log(222, url.parse(request.url))
    let pathname = url.parse(request.url).pathname;
    pathname = pathname == "/" ? "/index.html" : pathname;
    let realPath = path.join(__dirname, "dist" + pathname);  //这里设置自己的文件名称;
    // console.log(333, realPath);

    let ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, (exists) => {
        // console.log(444, exists);
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", (err, file) => {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    let contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);
console.log("Server address: http://localhost:" + PORT + "/index.html");

// let server = http.createServer((request, response) => {
//     // console.log(111, request.url)
//     // console.log(222, url.parse(request.url))
//     let pathname = url.parse(request.url).pathname;
//     let realPath = path.join("./dist", pathname);  //这里设置自己的文件名称;
//     console.log(333, realPath)

//     let ext = path.extname(realPath);
//     ext = ext ? ext.slice(1) : 'unknown';
//     fs.exists(realPath, (exists) => {
//         console.log(444, exists)
//         if (!exists) {
//             response.writeHead(404, {
//                 'Content-Type': 'text/plain'
//             });
//             response.write("This request URL " + pathname + " was not found on this server.");
//             response.end();
//         } else {
//             fs.readFile(realPath, "binary", (err, file) => {
//                 if (err) {
//                     response.writeHead(500, {
//                         'Content-Type': 'text/plain'
//                     });
//                     response.end(err);
//                 } else {
//                     let contentType = mine[ext] || "text/plain";
//                     response.writeHead(200, {
//                         'Content-Type': contentType
//                     });
//                     response.write(file, "binary");
//                     response.end();
//                 }
//             });
//         }
//     });
// });
// server.listen(PORT);
// console.log("Server address: http://localhost:" + PORT + "/index.html");