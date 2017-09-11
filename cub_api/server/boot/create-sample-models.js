module.exports = function(app){
    app.dataSources.pgsqlDS.autoupdate('dna',function(err){
        if (err) throw err;
        app.models.dna.create(
            [
                {
                    name:'firstDNA',
                    sequence:'sequenceA'
                }
            ], function(err,dnas){
                if (err) throw err;
                console.log('dnas created');
            }
        );
    });
    app.dataSources.pgsqlDS.autoupdate('dnacategory',function(err){
        if (err) throw err;
        app.models.dnacategory.create(
            [
                {
                    name:'bacteria',
                }
            ], function(err,dnas){
                if (err) throw err;
                console.log('dna category created');
            }
        );
    });
}