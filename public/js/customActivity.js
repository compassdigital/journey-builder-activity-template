define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
    connection.on('requestedInteractionDefaults', function(settings) { 
        if( settings.error ) {
             console.error( settings.error );
        } else {
             defaults = settings;
        }
        console.log('defaults', defaults);
        var eventKey = retrieveKey(defaults.email[0]);
        console.log('EventKey', eventKey);
    });

    // Assume that the string of the format  
    // '{{Event.ContactEvent-72af1529-1d7d-821e-2a08-34fb5068561d."EmailAddress"}}' 
    // It will return 'ContactEvent-72af1529-1d7d-821e-2a08-34fb5068561d' 
    function retrieveKey (string) {
        var pos1 = string.indexOf(".");
        var pos2 = string.indexOf(".", (pos1 + 1) );
        var result = string.substring( (pos1 + 1) , pos2);
        return result;
    }


    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

        
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        // var postcardURLValue = $('#postcard-url').val();
        // var postcardTextValue = $('#postcard-text').val();

        console.log('save()');
        // payload['arguments'].execute.inArguments = [{
        //     "tokens": authTokens,
        //     "emailAddress": "{{InteractionDefaults.Email}}",
        //     "email": "{{Contact}}",
        //     "e": "{{Contact.Attribute.JKTest.EmailAddress}}",
        //     "e2": "{{Contact.Attribute.JKTestList.EmailAddress}}",
        //     "e3": "{{Contact.Attribute.JKTestList.Email Address}}"
        // }];
        
        payload['metaData'].isConfigured = true;

        console.log(payload);
        connection.trigger('updateActivity', payload);
    }


});