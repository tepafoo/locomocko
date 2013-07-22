locomocko
========

locomocko is a JavaScript library that mocks responses from your back-end server. It works with jQuery and Angular JS.

Why use it?
------------------

Use this library if you need to simulate interaction with your back-end server.

How to use it?
---------------------
<b>Overview</b>

    // if you are using jQuery
    locomocko.shouldMockJQuery();

    // if you are using Angular
    locomocko.shouldMockAngular('myAngularModule');

    // mocked response with some JSON data
    locomocko.whenUrl('users/names.json').withMethod('GET').thenRespond().withData(
      [
        {
          "id": 1,
          "name": "Peter"
        },
        {
          "id": 2,
          "name": "Carlos"
        }
      ]
    );

    // mocked error response

    locomocko.whenUrl('invalidUrl').withMethod('GET').thenRespond().withStatusCode(404).withData('Not found!');

<b><u>In a jQuery project</u></b>

Add lococmocko to your HTML:

    <script src="lib/jquery.js"></script>

    <!-- Add locomocko after jQuery :) -->
    <script src="lib/locomocko.js"></script>

    <!-- The following file contains you mock definitions -->
    <script src="lib/yourLocomockoDefinitions.js"></script>

    <script src="lib/yourJQueryApplication.js"></script>

<b><u>In an Angular JS project</u></b>

Add lococmocko to your HTML:

    <script src="lib/angular.js"></script>

    <!-- Put below the JS file that contains your Angular module declaration, i.e. "angular.module('yourModule', []);"  -->
    <script src="lib/yourModule.js"></script>

    <!-- Add locomocko after Angular AND the file that declares your module :) -->
    <script src="lib/locomocko.js"></script>

    <!-- The following file contains you mock definitions -->
    <script src="lib/yourLocomockoDefinitions.js"></script>

    <script src="lib/yourAngularApplication.js"></script>

API
------

    // Setup

    locomocko.shouldMockJQuery();               // Enables mocking of jQuery.ajax() and derivatives (get(), post(), etc)
    locomocko.shouldMockAngular('yourModule');  // Enables mocking of Angular JS $http() and derivatives (get(), post(), etc).
                                                // Note: both can be called!

    // Mock definitions

    locomocko
      .whenUrl('someUrl')                 // Mandatory. Defines an endpoint to mock.
      .withMethod('GET')                  // Mandatory. Possible values: GET, HEAD, POST, PUT, DELETE
      .withHeaders({                      // Optional. Can be an object of any JavaScript type.
        'someKey': 'someValue'
      })
      .withData('Wonderful request.')     // Optional. Can be an object of any JavaScript type.
    
      .thenRespond()                      // Mandatory. Because... well we have to respond! :)

      .withStatusCode(418)                // Optional. Default is 200 - OK.
      .withHeaders({                      // Optional. Can be an object of any JavaScript type.
        'someKey': 'someValue'
      })
      .withData({"lovely": "response"})   // Optional. Can be an object of any JavaScript type. Default is empty string.
      // OR
      .withoutData();                     // Optional. Will set the response to empty String.
    
    // Resetting

    locomocko.reset();                    // Restores all mocked libraries.

    // Other

    locomocko.version                     // Version as string. e.g. '0.0.1'

Usage examples
-----------------------------------

    // When URL called, respond 200 - OK with no data
    locomocko.whenUrl('someUrl').withMethod('GET').thenRespond();
    // OR, if you prefer to be more explicit
    locomocko.whenUrl('someUrl').withMethod('GET').thenRespond().withoutData();

    // When URL called, respond 200 - OK with some data
    locomocko.whenUrl('someUrl').withMethod('GET').thenRespond().withData('All good!');

    // When URL called with specific data, respond 200 - OK with some data
    locomocko.whenUrl('someUrl').withMethod('GET').withData({"how": "are you?"}).thenRespond().withData({"fine": "thank you."});

    // When URL called with specific data and headers, respond 200 - OK with some data
    locomocko.whenUrl('someUrl').withMethod('GET').withData({"how": "are you?"}).withHeaders({"great": "header"}).thenRespond().withData({"fine": "thank you."});

    // When URL called with specific data and headers, respond 200 - OK with some data and headers
    locomocko.whenUrl('someUrl').withMethod('GET').withData({"how": "are you?"}).withHeaders({"great": "header"}).thenRespond().withData({"fine": "thank you."}).withHeaders({"my": "header"});

    //
    // Same as above, with a different response status code:
    //

    // When URL called, respond 500 - OK with no data
    locomocko.whenUrl('someUrl').withMethod('GET').thenRespond().withStatusCode(500);

    // When URL called, respond 200 - OK with some data
    locomocko.whenUrl('someUrl').withMethod('GET').thenRespond().withData('Not good!').withStatusCode(500);

    // etc.

Licence
-----------

Apache License, Version 2.0