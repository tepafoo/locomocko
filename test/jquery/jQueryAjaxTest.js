/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

describe('jQuery.ajax()', function () {

  var NO_REQUEST_HEADERS = {},
    NO_REQUEST_DATA = 'NO_REQUEST_DATA',
    assertJQueryAjaxMocked = function (method, done) {
      // given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertJQueryAjaxCalled(expectedUrl, method, null, expectedResponseData, done);
    },
    assertJQueryAjaxCalled = function (expectedUrl, method, requestData, expectedResponseData, done) {
      var options = {
        url: expectedUrl,
        type: method,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
          // assert response is success
          textStatus.should.equal('success');
          _.isObject(jqXHR).should.be.true;
          jqXHR.readyState.should.equal(4);
          jqXHR.status.should.equal(200);

          // assert response data
          jqXHR.responseText.should.equal(JSON.stringify(expectedResponseData));

          JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

          if (_.isFunction(done)) done();
        }
      };

      if (requestData !== NO_REQUEST_DATA) {
        options.data = requestData;
      }

      $.ajax(options);
    },
    assertJQueryAjaxMockedWithRequestHeadersWithAnyData = function (method, done) {
// given
      var expectedUrl = 'someUrl',
        requestHeaders = {
          'headerKey1': 'headerValue1',
          'headerKey2': 'headerValue2'
        },
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertJQueryAjaxMockedWithAnyDataWithRequestHeaders = function (method, done) {
// given
      var expectedUrl = 'someUrl',
        requestHeaders = {
          'headerKey1': 'headerValue1',
          'headerKey2': 'headerValue2'
        },
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withHeaders(requestHeaders).thenRespond().withData(expectedResponseData);

      // when and then
      assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertJQueryAjaxCalledWithRequestHeaders = function (expectedUrl, method, requestHeaders, requestData, expectedResponseData, done) {
      var stringified = JSON.stringify(expectedResponseData),
        options = {
          url: expectedUrl,
          type: method,
          headers: requestHeaders,
          dataType: 'json',
          success: function (data, textStatus, jqXHR) {
            // assert response is success
            textStatus.should.equal('success');
            _.isObject(jqXHR).should.be.true;
            jqXHR.readyState.should.equal(4);
            jqXHR.status.should.equal(200);

            // assert response data
            jqXHR.responseText.should.equal(stringified);

            JSON.stringify(data).should.equal(stringified);
            if (_.isFunction(done))  done();
          }
        };

      if (requestData !== NO_REQUEST_DATA) {
        options.data = requestData;
      }

      $.ajax(options);
    },
    assertJQueryAjaxMockedWithoutHeadersWithAnyData = function (method, done) {
// given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertJQueryAjaxCalled(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertJQueryAjaxMockedWithAnyDataWithoutHeaders = function (method, done) {
// given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withoutHeaders().thenRespond().withData(expectedResponseData);

      // when and then
      assertJQueryAjaxCalled(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
    },
    mockJQueryAjaxResponseHeaders = function (method, done) {
      var expectedUrl = 'someUrl';

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders({
        "someResponseHeaderKey1": "someResponseHeaderValue1",
        "someResponseHeaderKey2": "someResponseHeaderValue2"
      });

      // when and then
      $.ajax({
        url: expectedUrl,
        type: method,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
          // assert response is success
          textStatus.should.equal('success');
          _.isObject(jqXHR).should.be.true;
          jqXHR.readyState.should.equal(4);
          jqXHR.status.should.equal(200);

          // assert response headers
          jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
          jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
          jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
          _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

          done();
        }
      });
    };

  beforeEach(function () {
    locomocko.shouldMockJQuery();
  });

  afterEach(function () {
    locomocko.reset();
  });


  describe('happy paths', function () {
    describe('single calls', function () {

      describe('simple cases', function () {
        it('mocks jQuery.ajax() GET as expected', function (done) {
          assertJQueryAjaxMocked('GET', done);
        });

        it('mocks jQuery.ajax() POST as expected', function (done) {
          assertJQueryAjaxMocked('POST', done);
        });

        it('mocks jQuery.ajax() PUT as expected', function (done) {
          assertJQueryAjaxMocked('PUT', done);
        });

        it('mocks jQuery.ajax() DELETE as expected', function (done) {
          assertJQueryAjaxMocked('DELETE', done);
        });

        it('mocks jQuery.ajax() GET as expected thenRespond().withHeaders()', function (done) {
          // given
          mockJQueryAjaxResponseHeaders('GET', done);
        });

        it('mocks jQuery.ajax() POST as expected thenRespond().withHeaders()', function (done) {
          mockJQueryAjaxResponseHeaders('POST', done);
        });

        it('mocks jQuery.ajax() PUT as expected thenRespond().withHeaders()', function (done) {
          mockJQueryAjaxResponseHeaders('PUT', done);
        });

        it('mocks jQuery.ajax() DELETE as expected thenRespond().withHeaders()', function (done) {
          mockJQueryAjaxResponseHeaders('DELETE', done);
        });

        it('should return no data', function (done) {
          var expectedUrl = 'someUrl',
            method = 'GET';

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withAnyData().thenRespond().withoutData();

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
              data.should.equal('');
              done();
            }
          });
        });
      });

      describe('withHeaders() withAnyData()', function () {
        it('mocks jQuery.ajax() GET withHeaders() withAnyData() as expected', function (done) {
          assertJQueryAjaxMockedWithRequestHeadersWithAnyData('GET', done);
        });

        it('mocks jQuery.ajax() POST withHeaders() withAnyData() as expected', function (done) {
          assertJQueryAjaxMockedWithRequestHeadersWithAnyData('POST', done);
        });

        it('mocks jQuery.ajax() PUT withHeaders() withAnyData() as expected', function (done) {
          assertJQueryAjaxMockedWithRequestHeadersWithAnyData('PUT', done);
        });

        it('mocks jQuery.ajax() DELETE withHeaders() withAnyData() as expected', function (done) {
          assertJQueryAjaxMockedWithRequestHeadersWithAnyData('DELETE', done);
        });
      });

      describe('withHeaders() withData()', function () {
        it('mocks jQuery.ajax() GET withHeaders() withData() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withHeaders() withoutData()', function () {
        it('mocks jQuery.ajax() GET withHeaders() withoutData() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withoutHeaders() withAnyData()', function () {
        it('mocks jQuery.ajax() GET withoutHeaders() withAnyData() as expected', function (done) {
          assertJQueryAjaxMockedWithoutHeadersWithAnyData('GET', done);
        });

        it('mocks jQuery.ajax() POST withoutHeaders() withAnyData() as expected', function (done) {
          assertJQueryAjaxMockedWithoutHeadersWithAnyData('POST', done);
        });

        it('mocks jQuery.ajax() PUT withoutHeaders() withAnyData() as expected', function (done) {
          assertJQueryAjaxMockedWithoutHeadersWithAnyData('PUT', done);
        });

        it('mocks jQuery.ajax() DELETE withoutHeaders() withAnyData() as expected', function (done) {
          assertJQueryAjaxMockedWithoutHeadersWithAnyData('DELETE', done);
        });

      });

      describe('withoutHeaders() withData()', function () {
        it('mocks jQuery.ajax() GET withoutHeaders() withData() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalled(expectedUrl, method, requestData, expectedResponseData, done);
        });
      });

      describe('withoutHeaders() withoutData()', function () {
        it('mocks jQuery.ajax() GET withoutHeaders() withoutData() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalled(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() withAnyData()', function () {
        it('mocks jQuery.ajax() GET withAnyHeaders() withAnyData() as expected', function (done) {
          var method = 'GET';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withAnyData().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() withData()', function () {
        it('mocks jQuery.ajax() GET withAnyHeaders() withData() as expected', function (done) {
          var method = 'GET';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() withoutData()', function () {
        it('mocks jQuery.ajax() GET withAnyHeaders() withoutData() as expected', function (done) {
          var method = 'GET';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyData() withHeaders()', function () {
        it('mocks jQuery.ajax() GET withAnyData() withHeaders() as expected', function (done) {
          assertJQueryAjaxMockedWithAnyDataWithRequestHeaders('GET', done);
        });

        it('mocks jQuery.ajax() POST withAnyData() withHeaders() as expected', function (done) {
          assertJQueryAjaxMockedWithAnyDataWithRequestHeaders('POST', done);
        });

        it('mocks jQuery.ajax() PUT withAnyData() withHeaders() as expected', function (done) {
          assertJQueryAjaxMockedWithAnyDataWithRequestHeaders('PUT', done);
        });

        it('mocks jQuery.ajax() DELETE withAnyData() withHeaders() as expected', function (done) {
          assertJQueryAjaxMockedWithAnyDataWithRequestHeaders('DELETE', done);
        });
      });

      describe('withData() withHeaders()', function () {
        it('mocks jQuery.ajax() GET withData() withHeaders() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withHeaders(requestHeaders).thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withoutData() withHeaders()', function () {
        it('mocks jQuery.ajax() GET withoutData() withHeaders() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withHeaders(requestHeaders).thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyData() withoutHeaders()', function () {
        it('mocks jQuery.ajax() GET withAnyData() withoutHeaders() as expected', function (done) {
          assertJQueryAjaxMockedWithAnyDataWithoutHeaders('GET', done);
        });

        it('mocks jQuery.ajax() POST withAnyData() withoutHeaders() as expected', function (done) {
          assertJQueryAjaxMockedWithAnyDataWithoutHeaders('POST', done);
        });

        it('mocks jQuery.ajax() PUT withAnyData() withoutHeaders() as expected', function (done) {
          assertJQueryAjaxMockedWithAnyDataWithoutHeaders('PUT', done);
        });

        it('mocks jQuery.ajax() DELETE withAnyData() withoutHeaders() as expected', function (done) {
          assertJQueryAjaxMockedWithAnyDataWithoutHeaders('DELETE', done);
        });

      });

      describe('withData() withoutHeaders()', function () {
        it('mocks jQuery.ajax() GET withData() withoutHeaders() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withoutHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalled(expectedUrl, method, requestData, expectedResponseData, done);
        });
      });

      describe('withoutData() withoutHeaders()', function () {
        it('mocks jQuery.ajax() GET withoutData() withoutHeaders() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withoutHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalled(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyData() withAnyHeaders()', function () {
        it('mocks jQuery.ajax() GET withAnyData() withAnyHeaders() as expected', function (done) {
          var method = 'GET';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withAnyHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withData() withAnyHeaders()', function () {
        it('mocks jQuery.ajax() GET withData() withAnyHeaders() as expected', function (done) {
          var method = 'GET';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withAnyHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withoutData() withAnyHeaders()', function () {
        it('mocks jQuery.ajax() GET withoutData() withAnyHeaders() as expected', function (done) {
          var method = 'GET';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withAnyHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('thenRespond().withHeaders().withData().withStatusCode()', function () {
        it('mocks jQuery.ajax() GET thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedStatusCode = 301,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() POST thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

          // given
          var method = 'POST',
            expectedUrl = 'someUrl',
            expectedStatusCode = 500,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() PUT thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedStatusCode = 404,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() DELETE thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

          // given
          var method = 'DELETE',
            expectedUrl = 'someUrl',
            expectedStatusCode = 200,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

      });

      describe('thenRespond().withData().withHeaders().withStatusCode()', function () {
        it('mocks jQuery.ajax() GET thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedStatusCode = 200,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() POST thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

          // given
          var method = 'POST',
            expectedUrl = 'someUrl',
            expectedStatusCode = 404,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() PUT thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedStatusCode = 503,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() DELETE thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

          // given
          var method = 'DELETE',
            expectedUrl = 'someUrl',
            expectedStatusCode = 201,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

      });

      describe('thenRespond().withHeaders().withStatusCode().withData()', function () {
        it('mocks jQuery.ajax() GET thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedStatusCode = 301,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() POST thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

          // given
          var method = 'POST',
            expectedUrl = 'someUrl',
            expectedStatusCode = 500,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() PUT thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedStatusCode = 404,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() DELETE thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

          // given
          var method = 'DELETE',
            expectedUrl = 'someUrl',
            expectedStatusCode = 200,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

      });

      describe('thenRespond().withData().withStatusCode().withHeaders()', function () {
        it('mocks jQuery.ajax() GET thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedStatusCode = 200,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() POST thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

          // given
          var method = 'POST',
            expectedUrl = 'someUrl',
            expectedStatusCode = 404,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() PUT thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedStatusCode = 503,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() DELETE thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

          // given
          var method = 'DELETE',
            expectedUrl = 'someUrl',
            expectedStatusCode = 201,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

      });

      describe('thenRespond().withStatusCode().withHeaders().withData()', function () {
        it('mocks jQuery.ajax() GET thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedStatusCode = 301,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() POST thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

          // given
          var method = 'POST',
            expectedUrl = 'someUrl',
            expectedStatusCode = 500,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() PUT thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedStatusCode = 404,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() DELETE thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

          // given
          var method = 'DELETE',
            expectedUrl = 'someUrl',
            expectedStatusCode = 200,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

      });

      describe('thenRespond().withStatusCode().withData().withHeaders()', function () {
        it('mocks jQuery.ajax() GET thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedStatusCode = 200,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() POST thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

          // given
          var method = 'POST',
            expectedUrl = 'someUrl',
            expectedStatusCode = 404,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() PUT thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedStatusCode = 503,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

        it('mocks jQuery.ajax() DELETE thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

          // given
          var method = 'DELETE',
            expectedUrl = 'someUrl',
            expectedStatusCode = 201,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

              // assert response is success
              textStatus.should.equal('success');
              _.isObject(jqXHR).should.be.true;
              jqXHR.readyState.should.equal(4);
              jqXHR.status.should.equal(expectedStatusCode);

              // assert response headers
              jqXHR.getAllResponseHeaders().should.equal('someResponseHeaderKey1: someResponseHeaderValue1\nsomeResponseHeaderKey2: someResponseHeaderValue2\n');
              jqXHR.getResponseHeader('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              jqXHR.getResponseHeader('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
              _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

              // assert data
              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              done();
            }
          });

        });

      });
    });

    describe('combinations', function () {

      it('uses the last mock setup when called multiple times for the same GET URL without data', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod('GET').withoutData().thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('GET').withoutData().thenRespond().withData(expectedResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'GET', NO_REQUEST_DATA, expectedResponseData, done);
      });

      it('uses the last mock setup when called multiple times for the same GET URL with data', function (done) {
        // given
        var expectedUrl = 'someUrl',
          requestData = {"requestKey": "requestValue"},
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod('GET').withData(requestData).thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('GET').withData(requestData).thenRespond().withData(expectedResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'GET', requestData, expectedResponseData, done);
      });

      it('mocks jQuery.ajax() for the same GET URL but with different request payloads as expected', function (done) {
        var method = 'GET',
          expectedUrl = 'someUrl',
          firstRequestData = {
            "firstRequestDataKey": "firstRequestDataValue"
          },
          expectedFirstResponseData = {
            "firstResponseDataKey": "firstResponseDataValue"
          },
          secondRequestData = {
            "secondRequestDataKey": "secondRequestDataValue"
          },
          expectedSecondResponseData = {
            "secondResponseDataKey": "secondResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(secondRequestData).thenRespond().withData(expectedSecondResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, firstRequestData, expectedFirstResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, secondRequestData, expectedSecondResponseData, done);
      });

      it('separately mocks jQuery.ajax() GET, POST, PUT and DELETE on the same URL as expected', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedGetResponseData = {
            "someGetResponseDataKey": "someGetResponseDataValue"
          },
          expectedPostResponseData = {
            "somePostResponseDataKey": "somePostResponseDataValue"
          },
          expectedPutResponseData = {
            "somePutResponseDataKey": "somePutResponseDataValue"
          },
          expectedDeleteResponseData = {
            "someDeleteResponseDataKey": "someDeleteResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod('GET').withAnyData().thenRespond().withData(expectedGetResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('POST').withAnyData().thenRespond().withData(expectedPostResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('PUT').withAnyData().thenRespond().withData(expectedPutResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('DELETE').withAnyData().thenRespond().withData(expectedDeleteResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'GET', null, expectedGetResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'POST', null, expectedPostResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'PUT', null, expectedPutResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'DELETE', null, expectedDeleteResponseData, done);
      });

      it('mocks jQuery.ajax() for a mixture of methods and URL as expected', function (done) {
        // given
        var expectedFirstUrl = 'firstUrl',
          expectedFirstUrlGetResponseData = {
            "firstUrlGetResponseDataKey": "firstUrlGetResponseDataValue"
          },
          expectedFirstUrlDeleteResponseData = {
            "firstUrlDeleteResponseDataKey": "firstUrlDeleteResponseDataValue"
          },
          expectedSecondUrl = 'secondUrl',
          expectedSecondUrlPostResponseData = {
            "secondUrlPostResponseDataKey": "secondUrlPostResponseDataValue"
          },
          expectedThirdUrl = 'thirdUrl',
          expectedThirdUrlPutResponseData = {
            "thirdUrlPutResponseDataKey": "thirdUrlPutResponseDataValue"
          };

        locomocko.whenUrl(expectedFirstUrl).withMethod('GET').withAnyData().thenRespond().withData(expectedFirstUrlGetResponseData);
        locomocko.whenUrl(expectedFirstUrl).withMethod('DELETE').withAnyData().thenRespond().withData(expectedFirstUrlDeleteResponseData);
        locomocko.whenUrl(expectedSecondUrl).withMethod('POST').withAnyData().thenRespond().withData(expectedSecondUrlPostResponseData);
        locomocko.whenUrl(expectedThirdUrl).withMethod('PUT').withAnyData().thenRespond().withData(expectedThirdUrlPutResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'GET', null, expectedFirstUrlGetResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'DELETE', null, expectedFirstUrlDeleteResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedSecondUrl, 'POST', null, expectedSecondUrlPostResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedThirdUrl, 'PUT', null, expectedThirdUrlPutResponseData, done);
      });

      it('mocks jQuery.ajax() for a mixture of withData(), withAnyData() and  withoutData() on the same URL as expected', function (done) {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl',
          firstRequestData = {
            "someFirstRequestDataKey": "someFirstRequestDataValue"
          },
          expectedFirstResponseData = {
            "someFirstResponseDataKey": "someFirstResponseDataValue"
          },
          expectedSecondResponseData = {
            "someSecondResponseDataKey": "someSecondResponseDataValue"
          },
          expectedThirdResponseData = {
            "someThirdResponseDataKey": "someThirdResponseDataValue"
          },
          fourthRequestData = {
            "someFourthRequestDataKey": "someFourthRequestDataValue"
          },
          expectedFourthResponseData = {
            "someFourthResponseDataKey": "someFourthResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedSecondResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond().withData(expectedThirdResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(fourthRequestData).thenRespond().withData(expectedFourthResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, firstRequestData, expectedFirstResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, {"anyKey": "anyValue"}, expectedSecondResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, NO_REQUEST_DATA, expectedThirdResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, fourthRequestData, expectedFourthResponseData, done);
      });

      describe('different withHeaders(), same with{{Any/out}}Data()', function () {
        it('mocks jQuery.ajax() for different withHeaders() but same withData()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            firstRequestHeaders = {
              "firstRequestHeaderKey": "firstRequestHeaderValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestHeaders = {
              "secondRequestHeaderKey": "secondRequestHeaderValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withData(requestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(secondRequestHeaders).withData(requestData).thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, firstRequestHeaders, requestData, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, secondRequestHeaders, requestData, expectedSecondResponseData, done);
        });

        it('mocks jQuery.ajax() for different withHeaders() but same withAnyData()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            firstRequestHeaders = {
              "firstRequestHeaderKey": "firstRequestHeaderValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestHeaders = {
              "secondRequestHeaderKey": "secondRequestHeaderValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withAnyData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(secondRequestHeaders).withAnyData().thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, firstRequestHeaders, ["anyData1"], expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, secondRequestHeaders, {"randomNumber": Math.random()}, expectedSecondResponseData, done);
        });

        it('mocks jQuery.ajax() for different withHeaders() but same withoutData()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            firstRequestHeaders = {
              "firstRequestHeaderKey": "firstRequestHeaderValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestHeaders = {
              "secondRequestHeaderKey": "secondRequestHeaderValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(secondRequestHeaders).withoutData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, firstRequestHeaders, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, secondRequestHeaders, NO_REQUEST_DATA, expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedThirdResponseData, done);
        });
      });

      describe('same with{{Any/out}}Headers(), different withData()', function () {
        it('mocks jQuery.ajax() for same withHeaders() but different withData()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestHeaders = {
              "firstRequestHeaderKey": "firstRequestHeaderValue"
            },
            firstRequestData = {
              "firstRequestDataKey": "firstRequestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestData = {
              "secondRequestDataKey": "secondRequestDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withData(secondRequestData).thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, firstRequestData, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, secondRequestData, expectedSecondResponseData, done);
        });

        it('mocks jQuery.ajax() for same withAnyHeaders() but different withData()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            firstRequestData = {
              "firstRequestDataKey": "firstRequestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestData = {
              "secondRequestDataKey": "secondRequestDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(secondRequestData).thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, {"blah": "bloh"}, firstRequestData, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, {"notBlah": "notBloh"}, secondRequestData, expectedSecondResponseData, done);
        });

        it('mocks jQuery.ajax() for same withoutHeaders() but different withData()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            firstRequestData = {
              "firstRequestDataKey": "firstRequestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestData = {
              "secondRequestDataKey": "secondRequestDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(secondRequestData).thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, firstRequestData, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, secondRequestData, expectedSecondResponseData, done);
        });
      });

      describe('mixture of with{{Any/out}}Headers(), same with{{Any/out}}Data()', function () {
        it('mocks jQuery.ajax() for mixture of with{{Any/out}}Headers() but same withData()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            thirdRequestHeaders = {
              "thirdRequestHeaderKey": "thirdRequestHeaderValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(requestData).thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(thirdRequestHeaders).withData(requestData).thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, requestData, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, {"anyKey": "anyValue"}, requestData, expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, thirdRequestHeaders, requestData, expectedThirdResponseData, done);
        });

        it('mocks jQuery.ajax() for mixture of with{{Any/out}}Headers() but same withAnyData()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            thirdRequestHeaders = {
              "thirdRequestHeaderKey": "thirdRequestHeaderValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withAnyData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(thirdRequestHeaders).withAnyData().thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, {"anyData1": "anyData1"}, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, {"anyKey": "anyValue"}, {"anyData2": "anyData2"}, expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, thirdRequestHeaders, {"anyData3": "anyData3"}, expectedThirdResponseData, done);
        });

        it('mocks jQuery.ajax() for mixture of with{{Any/out}}Headers() but same withoutData()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            thirdRequestHeaders = {
              "thirdRequestHeaderKey": "thirdRequestHeaderValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(thirdRequestHeaders).withoutData().thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, {"anyKey": "anyValue"}, NO_REQUEST_DATA, expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, thirdRequestHeaders, NO_REQUEST_DATA, expectedThirdResponseData, done);
        });
      });

      describe('same with{{Any/out}}Headers(), mixture of with{{Any/out}}Data()', function () {
        it('mocks jQuery.ajax() for same withHeaders() but mixture of with{{Any/out}}Data()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestHeaders = {
              "requestHeaderKey": "requestHeaderValue"
            },
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withData(requestData).thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, {"anyKey": "anyValue"}, expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedThirdResponseData, done);
        });

        it('mocks jQuery.ajax() for same withAnyHeaders() but mixture of with{{Any/out}}Data()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withAnyData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(requestData).thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, {"anyHeader1": "anyHeader1"}, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, {"anyHeader2": "anyHeader2"}, {"anyData2": "anyData2"}, expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, {"anyHeader3": "anyHeader3"}, requestData, expectedThirdResponseData, done);
        });

        it('mocks jQuery.ajax() for same withoutHeaders() but mixture of with{{Any/out}}Data()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, {"anyData2": "anyData2"}, expectedSecondResponseData);

          // when and then
          assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, requestData, expectedThirdResponseData, done);
        });
      });

      describe('mixture of whenUrl().withData().withHeaders() combined with mixture of thenRespond().withData().withHeaders()', function () {
        it('mocks jQuery.ajax()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestHeaders = {
              "requestHeaderKey": "requestHeaderValue"
            },
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedFirstResponseHeaders = {
              "firstResponseHeadersKey": "firstResponseHeadersValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedSecondResponseHeaders = {
              "secondResponseHeadersKey": "secondResponseHeadersValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            },
            expectedThirdResponseHeaders = {
              "thirdResponseHeadersKey": "thirdResponseHeadersValue"
            },
            assertOnSuccess = function (expectedResponseHeadersAsString, expectedResponseHeaders, expectedResponseData, done) {
              return function (data, textStatus, jqXHR) {
                var key;

                // assert response is success
                textStatus.should.equal('success');
                _.isObject(jqXHR).should.be.true;
                jqXHR.readyState.should.equal(4);
                jqXHR.status.should.equal(200);

                // assert response headers
                jqXHR.getAllResponseHeaders().should.equal(expectedResponseHeadersAsString);

                for (key in expectedResponseHeaders) {
                  if (expectedResponseHeaders.hasOwnProperty(key)) {
                    jqXHR.getResponseHeader(key).should.equal(expectedResponseHeaders[key]);
                  }
                }

                _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

                // assert data
                JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

                if (_.isFunction(done)) done();
              }
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withHeaders(expectedFirstResponseHeaders).withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withHeaders(expectedSecondResponseHeaders).withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withHeaders(expectedThirdResponseHeaders).withData(expectedThirdResponseData);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            headers: {'any': 'headers'},
            success: assertOnSuccess('firstResponseHeadersKey: firstResponseHeadersValue\n', expectedFirstResponseHeaders, expectedFirstResponseData)
          });

          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            headers: requestHeaders,
            data: {'any': 'data'},
            success: assertOnSuccess('secondResponseHeadersKey: secondResponseHeadersValue\n', expectedSecondResponseHeaders, expectedSecondResponseData)
          });

          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            data: requestData,
            success: assertOnSuccess('thirdResponseHeadersKey: thirdResponseHeadersValue\n', expectedThirdResponseHeaders, expectedThirdResponseData, done)
          });

        });
      });

      describe('mixture of whenUrl().withHeaders().withData() combined with mixture of thenRespond().withHeaders().withData()', function () {
        it('mocks jQuery.ajax()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestHeaders = {
              "requestHeaderKey": "requestHeaderValue"
            },
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedFirstResponseHeaders = {
              "firstResponseHeadersKey": "firstResponseHeadersValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedSecondResponseHeaders = {
              "secondResponseHeadersKey": "secondResponseHeadersValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            },
            expectedThirdResponseHeaders = {
              "thirdResponseHeadersKey": "thirdResponseHeadersValue"
            },
            assertOnSuccess = function (expectedResponseHeadersAsString, expectedResponseHeaders, expectedResponseData, done) {
              return function (data, textStatus, jqXHR) {
                var key;

                // assert response is success
                textStatus.should.equal('success');
                _.isObject(jqXHR).should.be.true;
                jqXHR.readyState.should.equal(4);
                jqXHR.status.should.equal(200);

                // assert response headers
                jqXHR.getAllResponseHeaders().should.equal(expectedResponseHeadersAsString);

                for (key in expectedResponseHeaders) {
                  if (expectedResponseHeaders.hasOwnProperty(key)) {
                    jqXHR.getResponseHeader(key).should.equal(expectedResponseHeaders[key]);
                  }
                }

                _.isUndefined(jqXHR.getResponseHeader('thisKeyDoesNotExist')).should.be.true;

                // assert data
                JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

                if (_.isFunction(done)) done();
              }
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedFirstResponseData).withHeaders(expectedFirstResponseHeaders);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData(expectedSecondResponseData).withHeaders(expectedSecondResponseHeaders);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedThirdResponseData).withHeaders(expectedThirdResponseHeaders);

          // when and then
          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            headers: {'any': 'headers'},
            success: assertOnSuccess('firstResponseHeadersKey: firstResponseHeadersValue\n', expectedFirstResponseHeaders, expectedFirstResponseData)
          });

          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            headers: requestHeaders,
            data: {'any': 'data'},
            success: assertOnSuccess('secondResponseHeadersKey: secondResponseHeadersValue\n', expectedSecondResponseHeaders, expectedSecondResponseData)
          });

          $.ajax({
            url: expectedUrl,
            type: method,
            dataType: 'json',
            data: requestData,
            success: assertOnSuccess('thirdResponseHeadersKey: thirdResponseHeadersValue\n', expectedThirdResponseHeaders, expectedThirdResponseData, done)
          });

        });
      });

    });
  });

});