$(function () {
  $.get('phones/phones.json', function (data, textStatus, jqXHR) {
  $('#updateMe').text(JSON.stringify(data));
  }, 'json');
});
