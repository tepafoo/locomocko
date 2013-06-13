/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

(function (window) {

  // constants
  var NO_HEADERS = {},
    NO_DATA = 'NO_DATA',
    ANY_DATA = 'ANY_DATA',

  // util methods
    isNullOrUndefined = function (object) {
      return typeof object === 'undefined' || object === null;
    },

    isObject = function (object) {
      return Object.prototype.toString.call(object) === '[object Object]';
    },

  // other
    mockedEndpoints = {},
    libraryOriginals = {
      jQueryAjax: null
    },
    libraryMocks = {
      jQueryAjax: function (options) {
        if (mockedEndpoints.hasOwnProperty(options.url)) {
          var mockedMethod = mockedEndpoints[options.url].getMethod(options.type),
            requestData = options.hasOwnProperty('data') && !isNullOrUndefined(options.data) ? options.data : NO_DATA,
            requestHeaders = isObject(options.headers) ? options.headers: NO_HEADERS,
            response = mockedMethod.getResponse(requestHeaders, requestData),
            responseData;

          if (isNullOrUndefined(response)) {
            response = mockedMethod.getResponse(requestHeaders, ANY_DATA);
          }

          responseData = response.getData();

          options.success(responseData, 'success', {
            readyState: 4,
            status: 200,
            statusText: 'OK',
            responseText: JSON.stringify(responseData)
          });
        } else {
          throw new Error('Please mock endpoint: ' + options.url);
        }
      }
    };

  function MockedResponse() {
  }

  MockedResponse.prototype = {
    thenRespond: function (data) {
      this._data = data;
      return this;
    },

    getData: function () {
      return this._data;
    }
  };

  function MockedMethod() {
    this._responses = {};
    this._currentHeaders = NO_HEADERS;
  }

  MockedMethod.prototype = {
    withHeaders: function (headers) {
      this._currentHeaders = headers;
      return this;
    },

    withData: function (data) {
      var response,
        normalized = MockedMethod._normalize(this._currentHeaders, data);
      if (this._responses.hasOwnProperty(normalized)) {
        response = this._responses[normalized];
      } else {
        response = new MockedResponse();
        this._responses[normalized] = response;
      }
      return response;
    },

    withoutData: function () {
      return this.withData(NO_DATA);
    },

    withAnyData: function () {
      return this.withData(ANY_DATA);
    },

    getResponse: function (requestHeaders, requestData) {
      return this._responses[MockedMethod._normalize(requestHeaders, requestData)];
    }
  };

  MockedMethod._normalize = function (headers, data) {
    return JSON.stringify(headers) + JSON.stringify(data);
  };

  function MockedEndpoint() {
    this._methods = {};
  }

  MockedEndpoint.prototype = {
    withMethod: function (method) {
      var normalized = this._normalize(method);
      if (this._methods.hasOwnProperty(normalized)) {
        return this._methods[normalized];
      } else {
        this._methods[normalized] = new MockedMethod();
        return this._methods[normalized];
      }
    },

    getMethod: function (method) {
      var normalized = this._normalize(method);
      return this._methods[normalized];
    },

    _normalize: function (method) {
      return method.toUpperCase();
    }
  };


  function LocoMocko() {
  }

  LocoMocko.version = '0.0.1';

  LocoMocko.shouldMock = function (library) {
    if (library === 'jQuery') {
      libraryOriginals.jQueryAjax = $.ajax;
      $.ajax = libraryMocks.jQueryAjax;
    }
  };

  LocoMocko.reset = function () {
    $.ajax = libraryOriginals.jQueryAjax;
    mockedEndpoints = {};
  };

  LocoMocko.whenUrl = function (url) {

    var mockedEndpoint;

    if (!mockedEndpoints.hasOwnProperty(url)) {
      mockedEndpoint = new MockedEndpoint();
      mockedEndpoints[url] = mockedEndpoint;
    } else {
      mockedEndpoint = mockedEndpoints[url];
    }

    return mockedEndpoint;
  };


  window.locomocko = LocoMocko;
})
  (window);