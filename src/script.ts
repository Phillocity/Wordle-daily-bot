window.onload = function exampleFunction() {
    $('.retro').trigger('click');
}

const dot = () => {
    const dots = $('#status').text().match(/\./g) || [];
    if (dots!.length < 3 ) {
        $("#status").text( $("#status").text() + ".")
    }else{
        $("#status").text($("#status").text().replace(/\./g, ''))
    }
}

const delay = async (time: number) => {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  };

$('.retro').on('click', function (e) {
    e.preventDefault();
    $(".retro").prop("disabled",true)
    $('#status').text('ATTEMPTING TO SOLVE.');
    $('#results').attr('src', 'static/loading.gif');
    const dotTimer = setInterval(dot, 600)
    const anyMinute = setTimeout(() => {
        $('#status').text('ANY SECOND NOW.');
    }, 16000);

    $.ajax({
        url: '/',
        type: 'POST',
        contentType: 'application/json',
        success: function () {
            clearInterval(dotTimer)
            clearTimeout(anyMinute)
            $('#results').attr('src', 'static/results.png');
            $('#status').text('<SOLUTION GENERATED>');
            $(".retro").prop("disabled",false)
        },
        error: function () {
            clearInterval(dotTimer)
            clearTimeout(anyMinute)
            $('#results').attr('src', 'static/error.svg');
            $('#status').text('<FAILED TO GENERATE SOLUTION, PLEASE TRY AGAIN>');
            $(".retro").prop("disabled",false)
        }
    });
   
});