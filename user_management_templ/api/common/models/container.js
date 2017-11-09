'use strict';

module.exports = function (Container) {
    var app = require('../../server/server');
    const fs = require('fs');
    const dnaFilesContainer = 'dnafiles';
    var wait = require('wait-for-stuff');

    var streamToString = function (stream, callback) {
        var str = '';
        stream.on('data', function (chunk) {
            str += chunk;
        });
        stream.on('end', function () {
            callback(str);
        })
    }

    var streamToStringForGetFiles = function (stream, callback) {
        var str = '';
        stream.on('data', function (chunk) {
            str += chunk;
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

                // var myStream = Container.downloadStream(file.container, file.name);
                // streamToString(myStream, function (mystr) {
                //   //can get mystr here
                // });
                // console.log('out of streamToString');
                // //   stream.pipe(process.stdout);
                // //  const writable = fs.createWriteStream('./file.txt');
                // //  stream.pipe(writable);
            }
            if (medias.length)
                app.models.Media.create(medias, cb);
            else cb();
        } else {
            cb();
        }
    });

    class cubCalculations {
        constructor() {
            this.codonsCounter = 0;
            this.acidsResult = [];
            this.acidsResult.push(new aminoAcid('Ala', ['GCG', 'GCA', 'GCT', 'GCC']));
            this.acidsResult.push(new aminoAcid('Cys', ['TGT', 'TGC']));
            this.acidsResult.push(new aminoAcid('Asp', ['GAT', 'GAC']));
            this.acidsResult.push(new aminoAcid('Glu', ['GAG', 'GAA']));
            this.acidsResult.push(new aminoAcid('Phe', ['TTT', 'TTC']));
            this.acidsResult.push(new aminoAcid('Gly', ['GGG', 'GGA', 'GGT', 'GGC']));
            this.acidsResult.push(new aminoAcid('His', ['CAT', 'CAC']));
            this.acidsResult.push(new aminoAcid('Ile', ['ATA', 'ATT','ATC']));
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
                        if (searchCodonCount == this.acidsResult[search_count].currentCodons.length) {
                            searchCodon_end = true;
                        }

                        else if (searchSTR == this.acidsResult[search_count].currentCodons[searchCodonCount].codonName) {
                            this.acidsResult[search_count].currentCodons[searchCodonCount].codonFoundCounter++;
                            this.acidsResult[search_count].totalFound++;
                            this.codonsCounter++;
                        }
                        searchCodonCount++;
                    }
                    search_count++;
                }
            }
        }
        calculateFractionANDgraphData() {
            var currentfraction;
            for (var acidIndex in this.acidsResult) {
                for (var codonIndex in this.acidsResult[acidIndex].currentCodons) {
                    currentfraction = 0;
                    if ((this.codonsCounter > 0) && (this.acidsResult[acidIndex].currentCodons[codonIndex].codonFoundCounter > 0)) {
                        currentfraction = this.acidsResult[acidIndex].currentCodons[codonIndex].codonFoundCounter / this.codonsCounter
                        this.acidsResult[acidIndex].currentCodons[codonIndex].fraction1 = currentfraction;
                    }
                    this.acidsResult[acidIndex].currentCodons[codonIndex].outOf1000 = currentfraction * 1000;

                }
            }
        }
    }



    class aminoAcid {
        constructor(name, codonNames) {     //codons = array of Codon NAMES
            this.totalFound = 0;
            this.acidName = name;
            this.currentCodons = [];
            for (var oneCodonName of codonNames) {
                this.currentCodons.push(new codon(oneCodonName));
                //  this.codonFoundCounter.push(0);
            }
        }
    }
    class codon {        // triplet
        constructor(codonname) {
            this.codonName = codonname;
            this.codonFoundCounter = 0;
            this.outOf1000 = 0;
            this.fraction1 = 0.00;
        }
    }

    Container.getCubResults = function (fileName, totalParts, callback) {

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
        //---to refactor
        for (var FileCounter = 0; FileCounter < filenameList.length; FileCounter++) {
            var myStream = Container.downloadStream(dnaFilesContainer, filenameList[FileCounter]);
            streamToStringForGetFiles(myStream, function (mystr) {
                console.log('new file now, chart remainings---');
                
                console.log('CHART0---', char0);
                console.log('CHART1---', char1);
                console.log('CHART2---', char2);
                if (!(FileCounter < (filenameList.length - 1))) {
                    //set calculations here
                    finishedStreamingObj.finishedStreaming = true;  // listened by a wait.for before callback
                } else {

                }
                var charCounter = 0;
                var CodonTrioToSearch = '';
                var someStr = mystr;
                // searching for each 3 characters and matching with codons in [predifined] acid objects
                while (charCounter < someStr.length) {
                    switch ('') {
                        case (char0):
                            char0 = someStr.substr(charCounter, 1);
                            break;
                        case (char1):
                            char1 = someStr.substr(charCounter, 1);
                            break;
                        case (char2):
                            char2 = someStr.substr(charCounter, 1);
                            break;
                    }
                    if ((char0 != '') && (char1 != '') && (char2 != '')) {  //if all 3 chars are not empty
                        CodonTrioToSearch = CodonTrioToSearch.concat(char0).concat(char1).concat(char2);
                        currentCalculationObj.searchCodon(CodonTrioToSearch.toUpperCase());
                        CodonTrioToSearch = '';
                        char0 = '';
                        char1 = '';
                        char2 = '';
                    }
                    charCounter++;
                }
                finishedStreamingObj.finishedStreamingOne = true;   // set after each file streaming
            });

            wait.for.value(finishedStreamingObj, 'finishedStreamingOne', true);
            finishedStreamingObj.finishedStreamingOne = false;
            console.log('all streams end');
        }
        //search finished




        console.log('INFO: filenameList:', filenameList);
        var sometest = false;

        var streamFinished = false;
        wait.for.value(finishedStreamingObj, 'finishedStreaming', true);
        currentCalculationObj.calculateFractionANDgraphData();
        callback(null, currentCalculationObj)   // <---- sending search results to the client

    };
    function checkIfStreamFinished(streamFinishedVal) {
        if (!streamFinishedVal) {
            setTimeout(checkIfStreamFinished, 500);
        }
        else {
            console.log('stream is finished: val:', streamFinishedVal);
        }
    }

    Container.remoteMethod('getCubResults', {
        accepts: [
            { arg: 'fileName', type: 'string' },
            { arg: 'totalParts', type: 'number' }
        ],
        returns: { arg: 'cbuResults', type: 'object' }
    })

};
