module.exports = function(request, response) {

    var error = false;
    var error_fields = "";

    var request_params = JSON.stringify(request.body);
    var objectValue = JSON.parse(request_params);

    console.log(objectValue);

    required_fields.forEach(function(element) {

        if (!objectValue[element]) {

            error = true;
            error_fields += element + ', ';
        }
    });

    console.log(error);
    if (error) {

        // Required field(s) are missing or empty
        response.json({

            "error" : true,
            "message" : 'Required field(s) ' + error_fields + ' is missing or empty'
        });
    } else {

        response.json({

            "error" : true,
            "message" : 'Required field(s) ' + error_fields + ' is missing or empty'
        });
    }
};