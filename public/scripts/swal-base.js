function showSuccessPopUp(title, text) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        timer: 2500, // 2 seconds
        timerProgressBar: true
    });
}

function showErrorPopup(title, errorMessage) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: errorMessage,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        timer: 3000, // 3 seconds
        timerProgressBar: true
    });
}



