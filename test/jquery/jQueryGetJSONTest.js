/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

var NO_REQUEST_DATA = 'NO_REQUEST_DATA',
  assertJQueryGetJSONCalled = function (expectedUrl, requestData, expectedResponseData, done) {
    var assertResponseIsSuccess = function (actualResponseData, textStatus, jqXHR) {
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
      $.getJSON(expectedUrl, assertResponseIsSuccess);
    } else {
      $.getJSON(expectedUrl, requestData, assertResponseIsSuccess);
    }
  };

beforeEach(function () {
  locomocko.shouldMock('jQuery');
});

afterEach(function () {
  locomocko.reset();
});

describe('locomocko', function () {
  describe('jQuery.getJSON() happy paths', function () {
    describe('single calls', function () {
      it('mocks jQuery.getJSON() as expected', function (done) {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl',
          expectedResponseData = {
            "someResponseDataKey": "someResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond(expectedResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
      });

      it('does not mock when setup withHeaders()', function () {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl';
        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders({'blah': 'bloh'}).withAnyData().thenRespond({});

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond(expectedResponseData);

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond(expectedResponseData);

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond(expectedResponseData);

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withAnyData().thenRespond(expectedResponseData);

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond(expectedResponseData);

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(requestData).thenRespond(expectedResponseData);

          // when and then
          assertJQueryGetJSONCalled(expectedUrl, requestData, expectedResponseData, done);
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

        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond(expectedResponseData);

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

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).thenRespond(expectedResponseData);

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

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(firstRequestData).thenRespond(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(secondRequestData).thenRespond(expectedSecondResponseData);

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

        locomocko.whenUrl(expectedFirstUrl).withMethod(method).withAnyData().thenRespond(expectedFirstUrlGetResponseData);
        locomocko.whenUrl(expectedSecondUrl).withMethod(method).withAnyData().thenRespond(expectedSecondUrlGetResponseData);
        locomocko.whenUrl(expectedThirdUrl).withMethod(method).withAnyData().thenRespond(expectedThirdUrlGetResponseData);

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

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(firstRequestData).thenRespond(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond(expectedSecondResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond(expectedThirdResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(fourthRequestData).thenRespond(expectedFourthResponseData);

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

        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withoutData().thenRespond(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond(expectedSecondResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond({"shouldNotBeReturned": "reallyNot"});

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, NO_REQUEST_DATA, expectedSecondResponseData, done);
      });
    });
  });
});