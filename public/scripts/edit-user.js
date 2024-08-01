function verifyPasswords(){
    
// user id is retrieved from current sesh, in server side

    var currPassword = $('#currentPasswordInput').val();
    var newPassword = $('#newPasswordInput').val();
    var verifyPassword = $('#verifyPasswordInput').val();

    $.ajax({
        url: '/verify-current-password',
        type: 'POST',
        data: { password: currPassword }, 
        success: function(response) {
          if (response.success) {
            // Check if new password matches verify password
            if (newPassword != verifyPassword) {
              showErrorPopup('Change Password Failed', 'Your new passwords do not match.')
              return false;
            } else {

                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you want to change passwords?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // Submit the form
                    
                      $.ajax({
                        url: '/save-password',
                        type: 'POST',
                        data: { newPassword: newPassword },
                        success: function(response) {
                          if (response.success) {
                            showSuccessPopUp('Password updated.', '');
                            // Clear input fields
                            $('#currentPasswordInput').val("");
                            $('#newPasswordInput').val("");
                            $('#verifyPasswordInput').val("");
                          } else {
                            showErrorPopup('Change Password failed.', 'Please recheck your inputs!');
                          }
                        },
                        error: function(error) {
                          console.error("Error saving password:", error);
                          alert("An error occurred while changing the password.");
                        }
                      });

                    }
                  });
                  return false;
            }
          } else {
            showErrorPopup("Current password is incorrect.", "Make sure you entered your current password correctly.");
            return false;
          }
        },
        error: function(error) {
            showErrorPopup('Error while changing password.', response.message)
            return false;
          }
        });

    return false;
}


// For uploading a photo icon
$(document).ready(function() {
  $('#new-user-icon').on('change', function(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              $('#user-icon-img').attr('src', e.target.result);
              console.log(file);
          }

          reader.readAsDataURL(file);
          const formData = new FormData();
          formData.append('newUserIcon', file);
        
          // Make the POST request to /upload-icon
          $.ajax({
              url: '/upload-icon',
              type: 'POST',
              data: formData,
              contentType: false,
              processData: false,
              success: function(response) {
                  
                  console.log('Upload successful:', response);
              },
              error: function(error) {
                  console.error('Upload failed:', error);
              }
          });

          showSuccessPopUp("Profile Picture Updated", "");
      }
  });
});

