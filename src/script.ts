window.onload = function exampleFunction() {
    $('.retro').trigger('click');
}

$('.retro').on('click', function (e) {
    $('#results').attr('src', 'static/loading.gif');
    $('#status').text('ATTEMPTING TO SOLVE...');
    e.preventDefault();
    $.ajax({
        url: '/',
        type: 'POST',
        contentType: 'application/json',
        success: function (data) {
            $('#results').attr('src', 'static/results.png');
            $('#status').text('<SOLUTION GENERATED>');
        },
        error: function (error) {
            $('#results').attr('src', 'static/error.svg');
            $('#status').text('FAILED TO GENERATE SOLUTION, PLEASE TRY AGAIN');
        }
    });
   
});