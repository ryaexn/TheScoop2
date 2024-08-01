// For editing gallery images
    function editRestoImage(index){
        
        let fileInput = $('<input>', {
            type: 'file',
            accept: 'image/*',
            name: 'restoImage',
            style: 'display: none'
        });

        
        $(`#button${index}`).append(fileInput);

        fileInput.click();

        fileInput.on('change', function(){
            if (this.files && this.files[0]){
                let reader = new FileReader();
                reader.onload = function(e){
                    // Inject image to gallery area
                    $(`#resto-image-${index}`).attr('src', e.target.result); 
                }
                reader.readAsDataURL(this.files[0]);

                let formData = new FormData();
                formData.append('restoImage', this.files[0]);
                formData.append('index', index);

                // Request to save update 
                $.ajax({ 
                    url: `/update-resto-picture`,
                    type: 'POST',
                    data: formData,
                    processData : false,
                    contentType : false,
                    success: function(response){
                        console.log("Resto image updated");
                    }, error: function(error){
                        console.error('Error uploading image: ', error);
                    }
                });
            }
            fileInput.remove();
        });
    }


// edit resto modal 
function editRestoDetails(){

    // Enable overlay
    document.getElementById('overlay').style.display= 'block';

    // popup
    document.getElementById('editRestaurantModal').style.display = 'block';
}

function closeEditRestaurantPopup(){
    
    // Hide edit popup
    document.getElementById('editRestaurantModal').style.display= 'none';

    // Disable overlay
    document.getElementById('overlay').style.display= 'none';
}


// Save edit changes of resto
$(document).ready(function() {
    
    $('#saveeditbutton').on('click', function(event) {
        event.preventDefault(); // Dont let the form be submitted yet

        Swal.fire({title: 'Are you sure you want to save these changes?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                // closeEditRestaurantPopup();
                Swal.fire({
                    icon: 'success',
                    title: 'Details updated!',
                    text: `The restaurant's details have been updated`,
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#3085d6',
                    timer: 1500, // 2 seconds
                    timerProgressBar: true,
                    didClose: () => {
                        
                        $(`#editRestoForm`).submit();
                    }
                });
                
            } else if (result.isDismissed) {
                Swal.fire('Cancelled', 'No changes have been made', 'info');
            }
        }); 
    }); 
}); 

$(document).ready(function() {
    $(`#deleteRestoButton`).on('click', function(event){
        event.preventDefault();
        Swal.fire({
            title: 'Are you sure you want to delete this?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/delete-resto-account',
                    type: 'POST', 
                    success: function(response) {
                        Swal.fire('The Scoop will miss you 💔', 'Your account has been deleted.', 'success').then(() => {
                            window.location.href = '/logout';
                        });
                    }
                });
            } else if (result.isDismissed) {
                Swal.fire('Cancelled', 'Your account is safe.', 'info');
            }
        });
    });
});