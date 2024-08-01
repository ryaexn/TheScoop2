$(document).ready(function() {
    let finalRating = 0;

    function updateCones(index) {
        $('.slider-cone').each(function(i) {
            if (i < index) {
                $(this).addClass('checked');
            } else {
                $(this).removeClass('checked');
            }
        });
        

        // Injects value on hidden input tag
        $('#newreview-rating').val(Number(finalRating));
        console.log($('#newreview-rating').val());
    }

    $('.slider-cone').on('mouseenter', function() {
        var index = $(this).index() ; 
        updateCones(index);
    });

    $('.slider-cone').on('click', function() {
        var index = $(this).index() ; 
        finalRating = index;
        updateCones(finalRating);
    });

    $('#rating-slider').on('mouseleave', function() {
        updateCones(finalRating);
    });
});


$(document).ready(function() {
    let finalRating = 0;
    const cones = ['#edit-cone1', '#edit-cone2', '#edit-cone3', '#edit-cone4', '#edit-cone5'];

    function updateCones(index) {
        cones.forEach((cone, i) => {
            if (i < index) {
                $(cone).addClass('checked');
            } else {
                $(cone).removeClass('checked');
            }
        });
    }

    cones.forEach((cone, index) => {
        $(cone).on('mouseenter', function() {
            updateCones(index);
        });

        $(cone).on('click', function() {
            finalRating = index + 1;
            updateCones(finalRating);
        });
    });

    $('#rating-slider').on('mouseleave', function() {
        updateCones(finalRating);
    });
});