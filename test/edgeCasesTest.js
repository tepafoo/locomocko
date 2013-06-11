/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

beforeEach(function(){
  locomocko.shouldMock('jQuery');
});

afterEach(function(){
  locomocko.reset();
});

describe('locomocko', function () {
  it('throws an error if URL not mocked', function () {
    //given
    var expectedUrl = 'notMockedUrl';

    //when
    try {
      $.ajax({
        url: expectedUrl,
        type: 'GET',
        data: null,
        success: function () {
        }
      });

      //fail if execution comes to this point
      false.should.be.true;
    } catch (e) {
      //then
      e.message.should.eql('Please mock endpoint: ' + expectedUrl);
    }

  });
});