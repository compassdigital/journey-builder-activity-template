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
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        var promocode = '';
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
        
        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                console.log('key: ' + key, 'val: ' + val);
                if (key === 'PromoCode'){
                    promocode = val;
                }             
            });
        });

        if (hasInArguments){
            $('#promocode').val(promocode);
            $('#promocode_current').html(promocode);
        }

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
        var promocode = $('#promocode').val();

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "PromoCode": promocode,
            "EmailAddress": "{{Contact.Attribute.JulioTest.EmailAddress}}",
            "FirstName": "{{Contact.Attribute.JulioTest.FirstName}}",
            "LastName": "{{Contact.Attribute.JulioTest.LastName}}"
        }];
        
        payload.metaData.isConfigured = true;
        
        connection.trigger('updateActivity', payload);
    }


});