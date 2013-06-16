/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

beforeEach(function () {
  locomocko.shouldMock('jQuery');
});

afterEach(function () {
  locomocko.reset();
});

describe('locomocko', function () {
  it('throws an error if URL not mocked', function () {
    //given
    var expectedUrl = 'notMockedUrl',
      expectedMethod = 'GET',
      expectedHeaders = 'someHeaders',
      expectedData = 'someData';

    //when
    try {
      $.ajax({
        url: expectedUrl,
        type: 'GET',
        headers: expectedHeaders,
        data: expectedData,
        success: function () {
          //fail if execution comes to this point
          false.should.be.true;
        }
      });

      //fail if execution comes to this point
      false.should.be.true;
    } catch (e) {
      //then
      e.message.should.equal(
        'Please mock endpoint: ' + expectedUrl +
          ' with method: ' + expectedMethod +
          ' with headers: "' + expectedHeaders +
          '" and data: "' + expectedData + '"'
      );
    }

  });

  it('throws an error if method not mocked', function () {
    //given
    var expectedUrl = 'notMockedUrl',
      expectedMethod = 'GET',
      expectedHeaders = 'someHeaders',
      expectedData = 'someData';

    locomocko.whenUrl(expectedUrl).withMethod('PUT').withAnyHeaders().withAnyData().thenRespond().withData('Some Response');

    //when
    try {
      $.ajax({
        url: expectedUrl,
        type: expectedMethod,
        headers: expectedHeaders,
        data: expectedData,
        success: function () {
          //fail if execution comes to this point
          false.should.be.true;
        }
      });

      //fail if execution comes to this point
      false.should.be.true;
    } catch (e) {
      //then
      e.message.should.equal(
        'Please mock endpoint: ' + expectedUrl +
          ' with method: ' + expectedMethod +
          ' with headers: "' + expectedHeaders +
          '" and data: "' + expectedData + '"'
      );
    }

  });

  it('throws an error when thenRespond() is passed an argument', function () {
    var toTry = [null, 'string', 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl('someUrl').withMethod('GET').thenRespond(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });
});