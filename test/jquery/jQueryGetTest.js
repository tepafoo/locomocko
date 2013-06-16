/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

var NO_REQUEST_DATA = 'NO_REQUEST_DATA',
  assertJQueryGetCalled = function (expectedUrl, requestData, expectedResponseData, done) {
    var assertResponse = function (actualResponseData, textStatus, jqXHR) {
      textStatus.should.equal('success');
      _.isObject(jqXHR).should.be.true;
      jqXHR.readyState.should.equal(4);
      jqXHR.status.should.equal(200);
      jqXHR.statusText.should.equal('OK');

      jqXHR.responseText.should.equal(JSON.stringify(expectedResponseData));

      JSON.stringify(actualResponseData).should.equal(JSON.stringify(expectedResponseData));

      if (_.isFunction(done)) {
        done();
      }
    };

    if (requestData === NO_REQUEST_DATA) {
      $.get(expectedUrl, assertResponse, 'json');
    } else {
      $.get(expectedUrl, requestData, assertResponse, 'json');
    }
  };

beforeEach(function () {
  locomocko.shouldMock('jQuery');
});

afterEach(function () {
  locomocko.reset();
});

describe('locomocko', function () {
  describe('jQuery.get() happy paths', function () {
    describe('single calls', function () {
      it('mocks jQuery.get() as expected', function (done) {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl',
          expectedResponseData = {
            "someResponseDataKey": "someResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData);

        // when and then
        assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
      });

      it('does not mock when withHeaders()', function () {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl';
        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders({'blah': 'bloh'}).withAnyData().thenRespond().withData({});

        // when and then
        try {
          $.get(expectedUrl, function (data, textStatus, jqXHR) {
            //fail if execution comes to this point
            false.should.be.true;
          }, 'json');

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
          assertJQueryGetCalled(expectedUrl, {"anayDataKey": "anyDataValue"}, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, requestData, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, {"anayDataKey": "anyDataValue"}, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, requestData, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, {"anayDataKey": "anyDataValue"}, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, requestData, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, {"anayDataKey": "anyDataValue"}, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
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
          assertJQueryGetCalled(expectedUrl, requestData, expectedResponseData, done);
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
        assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
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
        assertJQueryGetCalled(expectedUrl, requestData, expectedResponseData, done);
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
        assertJQueryGetCalled(expectedUrl, firstRequestData, expectedFirstResponseData);

        // when and then
        assertJQueryGetCalled(expectedUrl, secondRequestData, expectedSecondResponseData, done);
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
        assertJQueryGetCalled(expectedFirstUrl, NO_REQUEST_DATA, expectedFirstUrlGetResponseData);

        // when and then
        assertJQueryGetCalled(expectedSecondUrl, NO_REQUEST_DATA, expectedSecondUrlGetResponseData);

        // when and then
        assertJQueryGetCalled(expectedThirdUrl, NO_REQUEST_DATA, expectedThirdUrlGetResponseData, done);
      });

      it('mocks for a mixture of wit{{Any/out}}hData() on the same URL', function (done) {
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
        assertJQueryGetCalled(expectedUrl, firstRequestData, expectedFirstResponseData);

        // when and then
        assertJQueryGetCalled(expectedUrl, {"anyKey": "anyValue"}, expectedSecondResponseData);

        // when and then
        assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedThirdResponseData);

        // when and then
        assertJQueryGetCalled(expectedUrl, fourthRequestData, expectedFourthResponseData, done);
      });

      it('mocks with same withoutData() but different with{{Any/out}}Headers()', function (done) {
        var method = 'GET',
          expectedUrl = 'someUrl',
          firstRequestHeaders = {
            "firstRequestHeaderKey": "firstRequestHeaderValue"
          },
          expectedFirstResponseData = {
            "firstResponseDataKey": "firstResponseDataValue"
          },
          expectedSecondResponseData = {
            "secondResponseDataKey": "secondResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withoutData().thenRespond().withData(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedSecondResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData({"shouldNotBeReturned": "reallyNot"});

        // when and then
        assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedSecondResponseData, done);
      });
    });
  });
});