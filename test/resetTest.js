/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

describe('locomocko', function () {
  it('stops mocking on reset()', function () {
    //given
    var url = 'someUrl',
      method = 'GET',
      callCount = 0;

    $.ajax = function () {
      callCount++;
    };

    locomocko.shouldMock('jQuery');

    locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withData({});

    $.ajax({
      url: url,
      type: method,
      success: function () {
      }
    });

    locomocko.reset();

    //when
    $.ajax();

    //then
    callCount.should.equal(1);

  });

  it('removes all mocked endpoints on reset()', function () {
    //given
    var url = 'someUrl',
      method = 'GET',
      requestData = {},
      errorMessage = 'endpoint test has failed!';

    $.ajax = function () {
      // fail if this function is ever called
      false.should.be.true;
    };

    locomocko.shouldMock('jQuery');

    locomocko.whenUrl(url).withMethod(method).withData(requestData).thenRespond().withData({});

    locomocko.reset();

    locomocko.shouldMock('jQuery');

    try {
      //when
      $.ajax({
        url: url,
        type: method,
        data: requestData,
        success: function () {
          // fail if execution comes to this point
          throw new Error(errorMessage);
        }
      });
    } catch (e) {
      e.message.should.not.equal(errorMessage);
    }

  });
});