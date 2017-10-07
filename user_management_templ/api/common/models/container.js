'use strict';

module.exports = function (Container) {
    var app = require('../../server/server');
    const fs = require('fs');
    Container.afterRemote('upload', function (ctx, modelInstance, cb) {
        if (modelInstance) {

            var medias = [];
            for (var k in modelInstance.result.files) {
                // TODO: Check if media already exists
                var file = modelInstance.result.files[k][0];
                console.log('UPLOADED a new FILE, name-->', file.name);
                medias.push({
                    type: 0,
                    name: file.name,
                    size: file.size,
                });
                var streamToString = function (stream, callback) {
                    var str = '';
                    stream.on('data', function (chunk) {
                        str += chunk;
                        console.log('one chunk:', chunk);
                    });
                    stream.on('end', function () {
                        callback(str);
                    })
                }
                var myStream = Container.downloadStream(file.container, file.name);
                streamToString(myStream,function(mystr){
                    console.log('FINALLY..:',mystr);
                });

                //   stream.pipe(process.stdout);
                //  const writable = fs.createWriteStream('./file.txt');
                //  stream.pipe(writable);



            }
            if (medias.length)
                app.models.Media.create(medias, cb);
            else cb();
        } else {
            cb();
        }
    });


    // practical example
    // Container.afterRemote('upload', function (ctx, unused, next) {
    //     console.log('vvv: good');
    //     var files = ctx.result.result.files.file;
    //     console.log('vvv: FILE(S) UPLOADED: %j', files);
    //     // TODO - process all items in `files` array
    //     var item = files[0];
    //     var stream = Container.downloadStream(item.container, item.name);
    //     stream.pipe(process.stdout);
    //     stream.on('end', function () { next(); });
    //     stream.on('error', next);
    // }); // works
};
