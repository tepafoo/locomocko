/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

describe('jQuery.getJSON()', function () {

  var NO_REQUEST_DATA = 'NO_REQUEST_DATA',
    assertJQueryGetJSONCalled = function (expectedUrl, requestData, expectedResponseData, done) {
      var assertResponseIsSuccess = function (actualResponseData, textStatus, jqXHR) {
        textStatus.should.equal('success');
        _.isObject(jqXHR).should.be.true;
        jqXHR.readyState.should.equal(4);
        jqXHR.status.should.equal(200);

        jqXHR.responseText.should.equal(JSON.stringify(expectedResponseData));

        JSON.stringify(actualResponseData).should.equal(JSON.stringify(expectedResponseData));

        if (_.isFunction(done)) {
          done();
        }
      };

      if (requestData === NO_REQUEST_DATA) {
        $.getJSON(expectedUrl, assertResponseIsSuccess);
      } else {
        $.getJSON(expectedUrl, requestData, assertResponseIsSuccess);
      }
    };

  beforeEach(function () {
    locomocko.shouldMockJQuery();
  });

  afterEach(function () {
    locomocko.reset();
  });


  describe('happy paths', function () {
    describe('single calls', function () {
      it('mocks jQuery.getJSON() as expected', function (done) {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl',
          expectedResponseData = {
            "someResponseDataKey": "someResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
      });

      it('does not mock when setup withHeaders()', function () {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl';
        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders({'blah': 'bloh'}).withAnyData().thenRespond().withData({});

        // when and then
        try {
          $.getJSON(expectedUrl, function (data, textStatus, jqXHR) {
            //fail if execution comes to this point
            false.should.be.true;
          });

          //fail if execution comes to this point
          false.should.be.true;
        } catch (e) {
          //then
          e.message.indexOf('Please mock endpoint').should.not.equal(-1);
        }
      });

      describe('withoutHeaders() with{{Any/out}}Data()', function () {
        it('mocks withoutHeaders() withAnyData() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, {"anayDataKey": "anyDataValue"}, expectedResponseData, done);
        });

        it('mocks withoutHeaders() withoutData() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
        });

        it('mocks withoutHeaders() withData() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {"dataKey": "dataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, requestData, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() with{{Any/out}}Data()', function () {
        it('mocks withAnyHeaders() withAnyData() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withAnyData().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, {"anayDataKey": "anyDataValue"}, expectedResponseData, done);
        });

        it('mocks withAnyHeaders() withoutData() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
        });

        it('mocks withAnyHeaders() withData() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {"dataKey": "dataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, requestData, expectedResponseData, done);
        });
      });

      describe('with{{Any/out}}Data() withoutHeaders()', function () {
        it('mocks withAnyData() withoutHeaders() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withoutHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, {"anayDataKey": "anyDataValue"}, expectedResponseData, done);
        });

        it('mocks withoutData() withoutHeaders() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withoutHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
        });

        it('mocks withData() withoutHeaders() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {"dataKey": "dataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withoutHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, requestData, expectedResponseData, done);
        });
      });

      describe('with{{Any/out}}Data() withAnyHeaders()', function () {
        it('mocks withAnyData() withAnyHeaders() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withAnyHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, {"anayDataKey": "anyDataValue"}, expectedResponseData, done);
        });

        it('mocks withoutData() withAnyHeaders() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withAnyHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
        });

        it('mocks withData() withAnyHeaders() as expected', function (done) {
          // given
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {"dataKey": "dataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withAnyHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, requestData, expectedResponseData, done);
        });
      });

      describe('thenRespond().withHeaders().withData() and thenRespond().withData().withHeaders()', function () {
        it('mocks jQuery.get() thenRespond().withHeaders().withData() as expected', function (done) {

          // given
          var expectedUrl = 'someUrl',
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod('GET').withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData);

          // when and then
          $.getJSON(expectedUrl, function (data, textStatus, jqXHR) {

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

            // assert data
            JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

            done();
          }, 'json');

        });

        it('mocks jQuery.get() thenRespond().withData().withHeaders() as expected', function (done) {

          // given
          var expectedUrl = 'someUrl',
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod('GET').withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders);

          // when and then
          $.getJSON(expectedUrl, function (data, textStatus, jqXHR) {

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

            // assert data
            JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

            done();
          }, 'json');

        });

      });

      describe('arrangements of thenRespond() withStatusCode(), withHeader() and withData()', function () {
        it('mocks jQuery.getJSON() thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

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
          $.getJSON(expectedUrl,
            function (data, textStatus, jqXHR) {

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
            },
            'json'
          );

        });

        it('mocks jQuery.getJSON() thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

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
          $.getJSON(expectedUrl,
            function (data, textStatus, jqXHR) {

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
            },
            'json'
          );

        });

        it('mocks jQuery.getJSON() thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

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
          $.getJSON(expectedUrl,
            function (data, textStatus, jqXHR) {

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
            },
            'json'
          );

        });

        it('mocks jQuery.getJSON() thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

          // when and then
          $.getJSON(expectedUrl,
            function (data, textStatus, jqXHR) {

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
            },
            'json'
          );

        });

        it('mocks jQuery.getJSON() thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

          // when and then
          $.getJSON(expectedUrl,
            function (data, textStatus, jqXHR) {

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
            },
            'json'
          );

        });

        it('mocks jQuery.getJSON() thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

          // when and then
          $.getJSON(expectedUrl,
            function (data, textStatus, jqXHR) {

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
            },
            'json'
          );

        });
      });
    });

    describe('combinations', function () {
      it('uses the last mock setup when called multiple times for the same URL without data', function (done) {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl',
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond().withData(expectedResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);

      });

      it('uses the last mock setup when called multiple times for the same URL with data', function (done) {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl',
          requestData = {"requestKey": "requestValue"},
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).thenRespond().withData(expectedResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, requestData, expectedResponseData, done);
      });

      it('mocks for the same URL but with different request payloads', function (done) {
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
        assertJQueryGetJSONCalled(expectedUrl, firstRequestData, expectedFirstResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, secondRequestData, expectedSecondResponseData, done);
      });

      it('mocks for multiple URLs', function (done) {
        // given
        var method = 'GET',
          expectedFirstUrl = 'firstUrl',
          expectedFirstUrlGetResponseData = {
            "firstUrlGetResponseDataKey": "firstUrlGetResponseDataValue"
          },
          expectedSecondUrl = 'secondUrl',
          expectedSecondUrlGetResponseData = {
            "secondUrlGetResponseDataKey": "secondUrlGetResponseDataValue"
          },
          expectedThirdUrl = 'thirdUrl',
          expectedThirdUrlGetResponseData = {
            "thirdUrlGetResponseDataKey": "thirdUrlGetResponseDataValue"
          };

        locomocko.whenUrl(expectedFirstUrl).withMethod(method).withAnyData().thenRespond().withData(expectedFirstUrlGetResponseData);
        locomocko.whenUrl(expectedSecondUrl).withMethod(method).withAnyData().thenRespond().withData(expectedSecondUrlGetResponseData);
        locomocko.whenUrl(expectedThirdUrl).withMethod(method).withAnyData().thenRespond().withData(expectedThirdUrlGetResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedFirstUrl, NO_REQUEST_DATA, expectedFirstUrlGetResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedSecondUrl, NO_REQUEST_DATA, expectedSecondUrlGetResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedThirdUrl, NO_REQUEST_DATA, expectedThirdUrlGetResponseData, done);
      });

      it('mocks for a mixture of with{{Any/out}}Data() on the same URL', function (done) {
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
        assertJQueryGetJSONCalled(expectedUrl, firstRequestData, expectedFirstResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, {"anyKey": "anyValue"}, expectedSecondResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedThirdResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, fourthRequestData, expectedFourthResponseData, done);

      });

      it('mocks with same withoutData() but with different with{{Any/out}}Headers()', function (done) {
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

        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withoutData().thenRespond().withData(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond().withData(expectedSecondResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData({"shouldNotBeReturned": "reallyNot"});

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedSecondResponseData, done);
      });

      describe('mixture of whenUrl().withData().withHeaders() combined with mixture of thenRespond().withData().withHeaders()', function () {
        it('mocks jQuery.ajax()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedFirstResponseHeaders = {
              "firstResponseHeadersKey": "firstResponseHeadersValue"
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

          locomocko
            .
            whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withHeaders(expectedFirstResponseHeaders).withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withHeaders(expectedThirdResponseHeaders).withData(expectedThirdResponseData);

          // when and then
          $.get(expectedUrl,
            assertOnSuccess('firstResponseHeadersKey: firstResponseHeadersValue\n', expectedFirstResponseHeaders, expectedFirstResponseData),
            'json'
          );

          $.get(expectedUrl,
            requestData,
            assertOnSuccess('thirdResponseHeadersKey: thirdResponseHeadersValue\n', expectedThirdResponseHeaders, expectedThirdResponseData, done),
            'json'
          );

        });
      });

      describe('mixture of whenUrl().withHeaders().withData() combined with mixture of thenRespond().withHeaders().withData()', function () {
        it('mocks jQuery.ajax()', function (done) {
          var method = 'GET',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedFirstResponseHeaders = {
              "firstResponseHeadersKey": "firstResponseHeadersValue"
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
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedThirdResponseData).withHeaders(expectedThirdResponseHeaders);

          // when and then
          $.getJSON(expectedUrl,
            assertOnSuccess('firstResponseHeadersKey: firstResponseHeadersValue\n', expectedFirstResponseHeaders, expectedFirstResponseData)
          );

          $.getJSON(expectedUrl,
            requestData,
            assertOnSuccess('thirdResponseHeadersKey: thirdResponseHeadersValue\n', expectedThirdResponseHeaders, expectedThirdResponseData, done)
          );

        });
      });
    });
  });

});