// For marking as helpful
function toggleHelpful(element, reviewId) {
    var $miniReview = $(element).closest('.mini-review');
    var $helpfulTag = $miniReview.find('.helpful-tag');
    var $helpfulCountText = $miniReview.find('.like-counter');
    var $helpfulButton = $miniReview.find('.helpful-btn');

    if ($helpfulTag.length) {
        // Remove the helpful tag
        $helpfulTag.remove();
        $helpfulButton.removeClass('yellowed');

        // Send AJAX POST request to /unlike
        $.ajax({
            url: '/unlike',
            type: 'PATCH',
            data: {
                reviewId: reviewId,
                isUnlike: true,
                isLike: false
            },
            success: function(response) {
                console.log('Review unmarked as helpful:', response);

                // Decrement the helpful count
                var currentCount = parseInt($helpfulCountText.text()) || 0;
                if (currentCount > 0) {
                    $helpfulCountText.text(currentCount - 1);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error unmarking review as helpful:', error);
            }
        });

    } else {
        // Make the helpful tag
        var newParagraph = $(`<p id="helpful-${reviewId}" class='helpful-tag'><img src='/assets/symbols/lightbulb.png'> You marked this review as helpful.</p>`);
        $helpfulButton.addClass('yellowed');
        // Send AJAX POST request to /like
        $.ajax({
            url: '/like',
            type: 'PATCH',
            data: {
                reviewId: reviewId,
                isLike: true,
                isUnlike: false
            },
            success: function(response) {
                console.log('Review marked as helpful:', response);
                 // Increment the helpful count
                 var currentCount = parseInt($helpfulCountText.text());
                 
                 if(currentCount || currentCount === 0){
                    $helpfulCountText.text(currentCount + 1);
                    $miniReview.find('.text-area').append(newParagraph);
                 }
                 else{
                    var newHelpfulCountText = $(`<p class="helpful-count-text"><img src="/assets/symbols/lightbulb.png"><span class="like-counter">1</span>&nbsp;people found this helpful.</p>`);

                    // Add the helpful tags
                    $miniReview.find('.text-area').append(newHelpfulCountText);
                    $miniReview.find('.text-area').append(newParagraph);
                 }

            },
            error: function(xhr, status, error) {
                console.error('Error marking review as helpful:', error);
            }
        });
    }
}

// For photo inputs
function openPhotoInput(){
    
    const input = document.createElement('input');
    
    input.type = 'file';
    input.accept = 'image/*';
    input.name = 'newReviewImage';
    input.style.display = 'none'; // keep the input box hidden

    // Add an event listener to handle file selection
    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageDisplay = document.getElementById('current-image-input');
                imageDisplay.src = e.target.result;
                imageDisplay.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }

        // to ensure it gets submitted
        document.getElementById('newReview').appendChild(input);
    });

    input.click();
}



// edit review modal
function editReviewDetails(){

    // Enable overlay
    document.getElementById('overlay').style.display = 'block';

    // popup
    document.getElementById('editReviewModal').style.display = 'block';
}


function closeEditReviewPopup(){
    
    // Hide edit popup
    document.getElementById('editReviewModal').style.display= 'none';

    // Disable overlay
    document.getElementById('overlay').style.display= 'none';
}

function openReply(id){

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('replyModal').style.display = 'block';

    var form = document.getElementById('replyForm');
    console.log(form);
    var hiddenInput = document.createElement('input');

    hiddenInput.type = 'hidden';
    hiddenInput.name = 'reviewId';
    hiddenInput.value = id; 

    form.appendChild(hiddenInput);
}


function closeReply(event){
    event.preventDefault();
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('replyModal').style.display = 'none';
}


function magnifyPhoto(id){
    document.getElementById('overlay').style.display = 'block';
    document.getElementById(`photo-${id}`).style.display = "block"
}


function unmagnifyPhoto(id) {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById(`photo-${id}`).style.display = "none";
}