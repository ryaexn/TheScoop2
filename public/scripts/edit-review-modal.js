// edit review modal
function openEditReviewModal(reviewId){
    // Enable overlay
    document.getElementById('overlay').style.display= 'block';

    // popup
    document.getElementById('editReviewModal').style.display = 'block';

    fetch('/fetch-review-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reviewId: reviewId })
    })
    .then(response => response.json())
    .then(review => {
        
        // for(i=1; i<= Number(review.rating); i++){
        //     console.log(`edit-cone${i}`);
        
        //     console.log(cone);
        //     document.getElementById(`edit-cone${i}`).classList.add('checked');
        // }
        document.getElementById(`review-id`).value = review._id;
        document.getElementById('edit-rev-title').value = review.title;
        document.getElementById('edit-review-desc').value = review.body;
        if(review.media){
            document.getElementById('change-pic-review').innerHTML = 'Replace Photo';
            document.getElementById('review-image').style.display = 'block';
            document.getElementById('review-image').src =  `/assets/reviews/${review.media}` ;
        } else {
            document.getElementById('change-pic-review').innerHTML = 'Upload a Photo';
        }
        
    })
    .catch(error => console.error('Error:', error));
    
}


function closeEditReviewPopup(){
    
    
    // Hide edit popup
    document.getElementById('editReviewModal').style.display= 'none';
    // Disable overlay
    document.getElementById('overlay').style.display= 'none';
    document.getElementById('review-image').src = "";
    document.getElementById('review-image').style.display = 'none';

    document.getElementById('edit-rev-title').value = "";
    document.getElementById('edit-review-desc').value = "";
    document.getElementById('review-image-input').remove(); // remove hidden photo input; id is in changeReviewPhoto()

    for(i=1; i<= Number(review.rating); i++){    
        document.getElementById(`edit-cone${i}`).classList.remove('checked');
     }
}


// For changing / adding review photos in edit reviews
function changeReviewPhoto(){
    
    const input = document.createElement('input');
    
    input.type = 'file';
    input.accept = 'image/*';
    input.name = 'newReviewImage';
    input.style.display = 'none'; // keep the input box hidden
    input.id = 'review-image-input';

    // Add an event listener to handle file selection
    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageDisplay = document.getElementById('review-image');
                imageDisplay.src = e.target.result;
                imageDisplay.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }

        // to ensure it gets submitted
        document.getElementById('editReviewForm').appendChild(input);
    });

    input.click(); // open file input
}

// Submit edit review form 
$(document).ready(function() {
    $('#editReviewForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Serialize form data
        var form = document.getElementById(`editReviewForm`);
        var formData = new FormData(form);
        // Make AJAX request
        $.ajax({
            url: '/update-review',
            type: 'POST',
            data: formData,
            procesData: false,
            contentType: false,
            success: function(response) {
                // Show SweetAlert on successful response
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your review has been updated.',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if(result.isConfirmed){
                        window.location.reload()
                    }
                });
            },
            error: function(xhr, status, error) {
                // Optionally handle errors here
                Swal.fire({
                    icon: 'error',
                    title: 'error.',
                    text: 'Something went wrong!',
                    confirmButtonText: 'OK'
                });
            }
        });
    });
});


$(document).ready(function() {
    $('#save-review-btn').on('click', function() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save the changes?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
            var form = document.getElementById(`editReviewForm`);
            var formData = new FormData(form);
            // Make AJAX request
            $.ajax({
                url: '/update-review',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    // Show SweetAlert on successful response
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your review has been updated.',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if(result.isConfirmed){
                            window.location.reload()
                        }
                    });
                },
                error: function(xhr, status, error) {
                    // Optionally handle errors here
                    Swal.fire({
                        icon: 'error',
                        title: 'error.',
                        text: 'Something went wrong!',
                        confirmButtonText: 'OK'
                    });
                }
             });
        }
      });
    });
  });

  $(document).ready(function() {
    $('#delete-review').on('click', function() {
      
    const reviewId = $('#review-id').val();

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this review?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel!'
      }).then((result) => {
        if (result.isConfirmed) {
        
          $.ajax({
            url: '/delete-review',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ reviewId: reviewId }),
            success: function(response) {
              Swal.fire({
                title: 'Deleted!',
                text: 'The review has been deleted.',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: function(xhr, status, error) {
              Swal.fire({
                title: 'Error!',
                text: 'There was an issue deleting the review.',
                icon: 'error'
              });
            }
          });
        }
      });
    });
  });