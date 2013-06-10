/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

(function (window) {

  var mockedEndpoints = {},
    mockedLibraries = {
      jQueryAjax: function (options) {
        var mockedEndpoint = mockedEndpoints[options.url],
          mockedMethod = mockedEndpoint.getMethod(options.type),
          responseData = mockedMethod.getResponse(options.data).getData();

        options.success(responseData, 'success', {
          readyState: 4,
          status: 200,
          statusText: 'OK',
          responseText: JSON.stringify(responseData)
        })
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
  }

  MockedMethod.prototype = {
    withData: function (data) {
      var response;
      var normalized = this._normalize(data);
      if (this._responses.hasOwnProperty(normalized)) {
        response = this._responses[normalized];
      } else {
        response = new MockedResponse();
        this._responses[normalized] = response;
      }
      return response;
    },

    // TODO -- replace this with a "withoutData()" method
    thenRespond: function (responseData) {
      return this.withData(null).thenRespond(responseData);
    },

    getResponse: function (requestData) {
      return this._responses[this._normalize(requestData)];
    },

    _normalize: function (data) {
      return JSON.stringify(data);
    }
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
      $.ajax = mockedLibraries.jQueryAjax;
    }
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