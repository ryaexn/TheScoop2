
// Delete Account
$(document).ready(function() {
    $('#delete-account-btn').on('click', function() {
        Swal.fire({
            title: 'Are you sure you want to delete this?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/delete-account',
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

// Fake Delete button

$(document).ready(function() {
    $('#fake-delete-account-btn').click(function() {
        Swal.fire({
            title: "Unable to Delete Account",
            text: "You can't delete your account when you have reviews. Please delete your reviews first.",
            icon: "warning",
            button: "OK"
        });
    });
});






