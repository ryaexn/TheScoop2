$(document).ready(function() {
    $('#toggle-gallery').click(function() {
        $('#establishment-information').toggleClass('slide-down');
        if ($('#establishment-information').hasClass('slide-down')) {
            $(this).text('Hide Gallery');
        } else {
            $(this).text('Show Gallery');
        }
    });
});