'use strict';

module.exports = function (Container) {
    var app = require('../../server/server');
    const fs = require('fs');
    const dnaFilesContainer = 'dnafiles';
    var wait = require('wait-for-stuff');
    //---------------------------------------------

    var streamToString = function (stream, callback) {
        var str = '';
        stream.on('data', function (chunk) {
            str += chunk;
            //          console.log('one chunk:', chunk);
        });
        stream.on('end', function () {
            callback(str);
        })
    }

    var streamToStringForGetFiles = function (stream, callback) {
        var str = '';
        stream.on('data', function (chunk) {
            str += chunk;
            //          console.log('one chunk:', chunk);
        });
        stream.on('end', function () {
            callback(str);
        })
    }


    Container.getFileName = function (file, req, res) {
        console.log('getting file name');
        return 'nameworkingTEST';
    }
    Container.afterRemote('upload', function (ctx, modelInstance, cb) {
        // if (ctx) {
        //     console.log('ctx:', ctx)
        // }
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
                    dateCreated: modelInstance.result.fields.dateUploaded[0]
                });

                var myStream = Container.downloadStream(file.container, file.name);
                streamToString(myStream, function (mystr) {
                    //   Container.getFileName();
                    console.log('Container.getFileName();');
                    //   console.log('file part contents:', mystr);     // output the stream
                });
                console.log('out of streamToString');
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

    class cubCalculations {        //class cubCalculations
        constructor() {

            this.acidsResult = [];
            this.acidsResult.push(new aminoAcid('Ala', ['GCG', 'GCA', 'GCT', 'GCC']));
            this.acidsResult.push(new aminoAcid('Cys', ['TGT', 'TGC']));
            this.acidsResult.push(new aminoAcid('Asp', ['GAT', 'GAC']));
            this.acidsResult.push(new aminoAcid('Glu', ['GAG', 'GAA']));
            this.acidsResult.push(new aminoAcid('Phe', ['TTT', 'TTC']));
            this.acidsResult.push(new aminoAcid('Gly', ['GGG', 'GGA', 'GGT', 'GGC']));
            this.acidsResult.push(new aminoAcid('His', ['CAT', 'CAC']));
            this.acidsResult.push(new aminoAcid('Ile', ['ATA', 'ATT']));
            this.acidsResult.push(new aminoAcid('Lys', ['AAG', 'AAA']));
            this.acidsResult.push(new aminoAcid('Leu', ['TTG', 'TTA', 'CTG', 'CTA', 'CTT', 'CTC']));
            this.acidsResult.push(new aminoAcid('Met', ['ATG']));
            this.acidsResult.push(new aminoAcid('Asn', ['AAT', 'AAC']));
            this.acidsResult.push(new aminoAcid('Pro', ['CCG', 'CCA', 'CCT', 'CCC']));
            this.acidsResult.push(new aminoAcid('Gln', ['CAG', 'CAA']));
            this.acidsResult.push(new aminoAcid('Arg', ['AGG', 'AGA', 'CGG', 'CGA', 'CGT', 'CGC']));
            this.acidsResult.push(new aminoAcid('Ser', ['AGT', 'AGC', 'TCG', 'TCA', 'TCT', 'TCC']));
            this.acidsResult.push(new aminoAcid('Thr', ['ACG', 'ACA', 'ACT', 'ACC']));
            this.acidsResult.push(new aminoAcid('Val', ['GTG', 'GTA', 'GTT', 'GTC']));
            this.acidsResult.push(new aminoAcid('Trp', ['TGG']));
            this.acidsResult.push(new aminoAcid('Tyr', ['TAT', 'TAC']));
            this.acidsResult.push(new aminoAcid('End', ['TGA', 'TAG', 'TAA']));

        }

        searchCodon(searchSTR) {
            var found = false;
            var search_end = false;
            var search_count = 0;
            while (!search_end) {
                if (search_count == this.acidsResult.length) {
                    search_end = true;
                }
                else {
                    var foundCodon = false;
                    var searchCodon_end = false;
                    var searchCodonCount = 0;
                    while (!searchCodon_end) {
                        if (searchCodonCount == this.acidsResult[search_count].acidCodons.length) {
                            searchCodon_end = true;
                            search_end = true;
                        }

                        else if (searchSTR == this.acidsResult[search_count].acidCodons[searchCodonCount]) {
                            this.acidsResult[search_count].codonCount[searchCodonCount] += 1;
                        }
                        searchCodonCount++;
                    }
                    // if (searchSTR == this.acidsResult[search_count].acidName) {

                    // }
                    search_count++;
                }
            }
        }
        displayMsgTest() {
            console.log('THIS IS THE MESSAGE');
        }
    }



    function aminoAcid(name, codons) {
        this.totalFound = 0;
        this.acidName = name;
        this.outOf1000 = 0;
        this.fraction1 = 0.00;
        this.acidCodons = [];
        this.codonCount = [];
        for (var oneCodon in codons) {
            this.acidCodons.push(oneCodon);
            this.codonCount.push(0);
        }
    }

    Container.getCbuResults = function (fileName, totalParts, callback) {

        var finishedStreamingObj = {};
        console.log('filename is: ', fileName);
        console.log('totalParts is: ', totalParts);
        var currentCalculationObj = new cubCalculations(fileName);
        var filenameList = [];
        for (var count = 0; count < totalParts; count++) {
            filenameList.push(fileName.concat('_').concat(count).concat('.txt'));
        }
        //----CHARs
        var char0 = '';
        var char1 = '';
        var char2 = '';
        //---
        for (var FileCounter = 0; FileCounter < (filenameList.length - 1); FileCounter++) {
            var myStream = Container.downloadStream(dnaFilesContainer, filenameList[FileCounter]);
            streamToStringForGetFiles(myStream, function (mystr) {
                // console.log('FILE part CONTENTS:', mystr);    


                if (!(FileCounter < (filenameList.length - 1))) {
                    //set calculations here
                    finishedStreamingObj.finishedStreaming = true;
                } else {

                }
                var charCounter = 0;
                var CodonTrioToSearch = '';
                console.log('mystrLength:', mystr.length);
                var someStr = mystr;
                while (charCounter < someStr.length) {
                    if (char0 == '') {
                        char0 = someStr.substr(charCounter, 1);
                    }
                    if ((char1 == '') && (charCounter + 1 < someStr.length)) {
                        char1 = someStr.substr((charCounter + 1), 1);
                    }
                    if ((char2 == '') && (charCounter + 2 < someStr.length)) {
                        char2 = someStr.substr((charCounter + 2), 1);
                    }
                    CodonTrioToSearch = CodonTrioToSearch.concat(char0).concat(char1).concat(char2);
                    console.log('CodonTrioToSearch', CodonTrioToSearch);
                    CodonTrioToSearch = '';

                    char0 = '';
                    char1 = '';
                    char2 = '';
                    charCounter += 3;
                }

            });
        }





        console.log('filenameList:', filenameList);
        var sometest = false;

        console.log('out of wait until');
        var streamFinished = false;
        wait.for.value(finishedStreamingObj, 'finishedStreaming', true);
        // currentCalculationObj.displayMsgTest();
        callback(null, currentCalculationObj)

    };
    function checkIfStreamFinished(streamFinishedVal) {
        if (!streamFinishedVal) {
            setTimeout(checkIfStreamFinished, 500);
        }
        else {
            console.log('stream is finished: val:', streamFinishedVal);
        }
        // console.log(`arg was => ${streamFinishedVal}`);
    }


    // function getMyFiles_and_calculate(CUB_Object, FNameList, FileCounter) {
    //     var myStream = Container.downloadStream(dnaFilesContainer, FNameList[FileCounter]);
    //     streamToStringForGetFiles(myStream, function (mystr) {
    //         var someStrTest = mystr;
    //         // console.log('FILE part CONTENTS:', mystr);    
    //         if (FileCounter < (FNameList.length - 1)) {
    //             FileCounter++;
    //             getMyFiles_and_calculate(CUB_Object, FNameList, FileCounter);
    //             CUB_Object.Thymine = 'thymine test';
    //         }
    //         else {
    //             finishedStreamingObj.finishedStreaming = true;
    //             return CUB_Object;
    //         }
    //     });
    //     console.log('out of streamToString,counter='.FileCounter);

    // }


    Container.remoteMethod('getCbuResults', {
        accepts: [
            { arg: 'fileName', type: 'string' },
            { arg: 'totalParts', type: 'number' }
        ],
        returns: { arg: 'cbuResults', type: 'object' }
    })
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
