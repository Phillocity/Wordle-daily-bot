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

$('.retro:eq(1)').on('click', function (e) {
    $('#results').attr('src', 'static/loading.gif');
    $(".retro").prop("disabled",true)
    e.preventDefault();
    $('#status').text('ATTEMPTING TO SOLVE.');
    const dotTimer = setInterval(dot, 600)
    const anyMinute = setTimeout(() => {
        $('#status').text('ANY SECOND NOW.');
    }, 16000);

    $.ajax({
        url: '/',
        type: 'POST',
        contentType: 'application/json',
        success: function () {
            const success = async () => {
                await delay(2000);
                $('#status').text('<SOLUTION GENERATED>');
                $(".retro").prop("disabled",false)
                clearInterval(dotTimer)
                clearTimeout(anyMinute)
                $('#results').attr('src', 'static/results.png');
            }
            success();
        },
        error: function () {
            $('#results').attr('src', 'static/error.svg');
            $('#status').text('<TOUGH COOKIE, PLEASE TRY AGAIN>');
            $(".retro").prop("disabled",false)
            clearInterval(dotTimer)
            clearTimeout(anyMinute)
        }
        });
   
});