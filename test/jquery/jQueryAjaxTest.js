/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

var NO_REQUEST_DATA = 'NO_REQUEST_DATA',
  assertJQueryAjaxMocked = function (method, done) {
    // given
    var expectedUrl = 'someUrl',
      expectedResponseData = {
        "someResponseDataKey": "someResponseDataValue"
      };

    locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond(expectedResponseData);

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
        jqXHR.statusText.should.equal('OK');

        // assert response data
        jqXHR.responseText.should.equal(JSON.stringify(expectedResponseData));

        JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));
        done();
      }
    };

    if (requestData !== NO_REQUEST_DATA) {
      options.data = requestData;
    }

    $.ajax(options);
  },
  assertJQueryAjaxMockedWithRequestHeaders = function (method, done) {
// given
    var expectedUrl = 'someUrl',
      requestHeaders = {
        'headerKey1': 'headerValue1',
        'headerKey2': 'headerValue2'
      },
      expectedResponseData = {
        "someResponseDataKey": "someResponseDataValue"
      };

    locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond(expectedResponseData);

    // when and then
    assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
  },
  assertJQueryAjaxCalledWithRequestHeaders = function (expectedUrl, method, requestHeaders, requestData, expectedResponseData, done) {
    var options = {
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
        jqXHR.statusText.should.equal('OK');

        // assert response data
        jqXHR.responseText.should.equal(JSON.stringify(expectedResponseData));

        JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));
        done();
      }
    };

    if (requestData !== NO_REQUEST_DATA) {
      options.data = requestData;
    }

    $.ajax(options);
  };

beforeEach(function () {
  locomocko.shouldMock('jQuery');
});

afterEach(function () {
  locomocko.reset();
});

describe('locomocko', function () {

  describe('jQuery.ajax() happy paths', function () {
    describe('single calls', function () {
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

      it('mocks jQuery.ajax() GET with predefined request headers as expected', function (done) {
        assertJQueryAjaxMockedWithRequestHeaders('GET', done);
      });

      it('mocks jQuery.ajax() POT with predefined request headers as expected', function (done) {
        assertJQueryAjaxMockedWithRequestHeaders('POST', done);
      });

      it('mocks jQuery.ajax() PUT with predefined request headers as expected', function (done) {
        assertJQueryAjaxMockedWithRequestHeaders('PUT', done);
      });

      it('mocks jQuery.ajax() DELETE with predefined request headers as expected', function (done) {
        assertJQueryAjaxMockedWithRequestHeaders('DELETE', done);
      });
    });

    describe('combinations', function () {

      it('uses the last mock setup when called multiple times for the same GET URL without data', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod('GET').withoutData().thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('GET').withoutData().thenRespond(expectedResponseData);

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

        locomocko.whenUrl(expectedUrl).withMethod('GET').withData(requestData).thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('GET').withData(requestData).thenRespond(expectedResponseData);

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

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(firstRequestData).thenRespond(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(secondRequestData).thenRespond(expectedSecondResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, firstRequestData, expectedFirstResponseData, done);

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

        locomocko.whenUrl(expectedUrl).withMethod('GET').withAnyData().thenRespond(expectedGetResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('POST').withAnyData().thenRespond(expectedPostResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('PUT').withAnyData().thenRespond(expectedPutResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('DELETE').withAnyData().thenRespond(expectedDeleteResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'GET', null, expectedGetResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'POST', null, expectedPostResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'PUT', null, expectedPutResponseData, done);

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

        locomocko.whenUrl(expectedFirstUrl).withMethod('GET').withAnyData().thenRespond(expectedFirstUrlGetResponseData);
        locomocko.whenUrl(expectedFirstUrl).withMethod('DELETE').withAnyData().thenRespond(expectedFirstUrlDeleteResponseData);
        locomocko.whenUrl(expectedSecondUrl).withMethod('POST').withAnyData().thenRespond(expectedSecondUrlPostResponseData);
        locomocko.whenUrl(expectedThirdUrl).withMethod('PUT').withAnyData().thenRespond(expectedThirdUrlPutResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'GET', null, expectedFirstUrlGetResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'DELETE', null, expectedFirstUrlDeleteResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedSecondUrl, 'POST', null, expectedSecondUrlPostResponseData, done);

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

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(firstRequestData).thenRespond(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond(expectedSecondResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond(expectedThirdResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(fourthRequestData).thenRespond(expectedFourthResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, firstRequestData, expectedFirstResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, {"anyKey": "anyValue"}, expectedSecondResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, NO_REQUEST_DATA, expectedSecondResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, method, fourthRequestData, expectedFourthResponseData, done);
      });

      it('mocks jQuery.ajax() for the same GET URL with same withData() but with different request headers as expected', function (done) {
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

        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withData(requestData).thenRespond(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(secondRequestHeaders).withData(requestData).thenRespond(expectedSecondResponseData);

        // when and then
        assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, firstRequestHeaders, requestData, expectedFirstResponseData, done);

        // when and then
        assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, secondRequestHeaders, requestData, expectedSecondResponseData, done);
      });

      it('mocks jQuery.ajax() for the same GET URL with same withAnyData() but with different request headers as expected', function (done) {
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

        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withAnyData().thenRespond(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(secondRequestHeaders).withAnyData().thenRespond(expectedSecondResponseData);

        // when and then
        assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, firstRequestHeaders, ["anyData1"], expectedFirstResponseData, done);

        // when and then
        assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, secondRequestHeaders, {"randomNumber": Math.random()}, expectedSecondResponseData, done);
      });

      it('mocks jQuery.ajax() for the same GET URL with same withoutData() but with different request headers as expected', function (done) {
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
        locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(secondRequestHeaders).withoutData().thenRespond(expectedSecondResponseData);

        // when and then
        assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, firstRequestHeaders, NO_REQUEST_DATA, expectedFirstResponseData, done);

        // when and then
        assertJQueryAjaxCalledWithRequestHeaders(expectedUrl, method, secondRequestHeaders, NO_REQUEST_DATA, expectedSecondResponseData, done);
      });
    });
  });
});