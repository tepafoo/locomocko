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
    };

    if (requestData === NO_REQUEST_DATA) {
      $.get(expectedUrl, function (data, textStatus, jqXHR) {
        assertResponse(data, textStatus, jqXHR);
        done();
      }, 'json');
    } else {
      $.get(expectedUrl, requestData, function (data, textStatus, jqXHR) {
        assertResponse(data, textStatus, jqXHR);
        done();
      }, 'json');
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

        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond(expectedResponseData);

        // when and then
        assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
      });
    });

    describe('combinations', function () {
      it('uses the last mock setup when called multiple times for the same GET URL without data', function (done) {
        // given
        var method = 'GET',
          expectedUrl = 'someUrl',
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond(expectedResponseData);

        // when and then
        assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
      });

      it('uses the last mock setup when called multiple times for the same GET URL with data', function (done) {
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
        assertJQueryGetCalled(expectedUrl, requestData, expectedResponseData, done);
      });

      it('mocks jQuery.get() for the same GET URL but with different request payloads as expected', function (done) {
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
        assertJQueryGetCalled(expectedUrl, firstRequestData, expectedFirstResponseData, done);

        // when and then
        assertJQueryGetCalled(expectedUrl, secondRequestData, expectedSecondResponseData, done);
      });

      it('mocks jQuery.get() for multiple URLs as expected', function (done) {
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
        assertJQueryGetCalled(expectedFirstUrl, NO_REQUEST_DATA, expectedFirstUrlGetResponseData, done);

        // when and then
        assertJQueryGetCalled(expectedSecondUrl, NO_REQUEST_DATA, expectedSecondUrlGetResponseData, done);

        // when and then
        assertJQueryGetCalled(expectedThirdUrl, NO_REQUEST_DATA, expectedThirdUrlGetResponseData, done);
      });

      it('mocks jQuery.get() for a mixture of withData(), withAnyData() and  withoutData() on the same URL as expected', function (done) {
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
        assertJQueryGetCalled(expectedUrl, firstRequestData, expectedFirstResponseData, done);

        // when and then
        assertJQueryGetCalled(expectedUrl, {"anyKey": "anyValue"}, expectedSecondResponseData, done);

        // when and then
        assertJQueryGetCalled(expectedUrl, NO_REQUEST_DATA, expectedSecondResponseData, done);

        // when and then
        assertJQueryGetCalled(expectedUrl, fourthRequestData, expectedFourthResponseData, done);
      });
    });
  });

});