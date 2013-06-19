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

  it('throws an error when whenUrl() not passed a String', function () {
    var toTry = [null, 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when reset() called with arguments', function () {
    var toTry = [null, 'string', 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.reset(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when shouldMock() not passed a String', function () {
    var toTry = [null, 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.shouldMock(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when shouldMock() called with unsupported library name', function () {
    try {
      locomocko.shouldMock('thisIsNotSupported');

      //fail if execution comes to this point
      false.should.be.true;

    } catch (e) {
      e.message.should.equal('Unsupported library');
    }
  });

  it('throws an error when withMethod() not passed a String', function () {
    var toTry = [null, 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl('someUrl').withMethod(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when withMethod() passed a String that is not GET, POST, PUT or DELETE', function () {
    var strings = ['', 'randomNonEmptyString'];

    _.each(strings, function (string) {

      try {
        locomocko.whenUrl('someUrl').withMethod(string);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('does not throw an error when withMethod() called with non upper-case GET, POST, PUT or DELETE', function () {
    var strings = ['get', 'pOsT', 'PuT', 'DEleTE'];

    _.each(strings, function (string) {

      try {
        locomocko.whenUrl('someUrl').withMethod(string);
      } catch (e) {
        //fail if execution comes to this point
        false.should.be.true;
      }
    });
  });

  it('throws an error when getMethod() not passed a String', function () {
    var toTry = [null, 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl('someUrl').getMethod(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when getMethod() passed a String that is not GET, POST, PUT or DELETE', function () {
    var strings = ['', 'randomNonEmptyString'];

    _.each(strings, function (string) {

      try {
        locomocko.whenUrl('someUrl').getMethod(string);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('does not throw an error when getMethod() called with non upper-case GET, POST, PUT or DELETE', function () {
    var strings = ['get', 'pOsT', 'PuT', 'DEleTE'];

    _.each(strings, function (string) {

      try {
        locomocko.whenUrl('someUrl').getMethod(string);
      } catch (e) {
        //fail if execution comes to this point
        false.should.be.true;
      }
    });
  });

  it('throws an error when hasMethod() not passed a String', function () {
    var toTry = [null, 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl('someUrl').hasMethod(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when hasMethod() passed a String that is not GET, POST, PUT or DELETE', function () {
    var strings = ['', 'randomNonEmptyString'];

    _.each(strings, function (string) {

      try {
        locomocko.whenUrl('someUrl').hasMethod(string);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('does not throw an error when hasMethod() called with non upper-case GET, POST, PUT or DELETE', function () {
    var strings = ['get', 'pOsT', 'PuT', 'DEleTE'];

    _.each(strings, function (string) {

      try {
        locomocko.whenUrl('someUrl').hasMethod(string);
      } catch (e) {
        //fail if execution comes to this point
        false.should.be.true;
      }
    });
  });

  it('throws an error when withAnyData() is passed an argument', function () {
    var toTry = [null, 'string', 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl('someUrl').withMethod('GET').withAnyData(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when withoutData() is passed an argument', function () {
    var toTry = [null, 'string', 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl('someUrl').withMethod('GET').withoutData(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when withAnyHeaders() is passed an argument', function () {
    var toTry = [null, 'string', 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl('someUrl').withMethod('GET').withAnyHeaders(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when withoutHeaders() is passed an argument', function () {
    var toTry = [null, 'string', 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl('someUrl').withMethod('GET').withoutHeaders(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });

  it('throws an error when getData() is passed an argument', function () {
    var toTry = [null, 'string', 4, true, {}, [], new Date(), new RegExp()];

    _.each(toTry, function (type) {

      try {
        locomocko.whenUrl('someUrl').withMethod('PUT').withAnyHeaders().withAnyData().thenRespond().getData(type);

        //fail if execution comes to this point
        false.should.be.true;

      } catch (e) {
        e.message.should.equal('IllegalArgumentError');
      }
    });
  });
});