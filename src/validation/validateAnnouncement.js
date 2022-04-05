function validateAnnouncement(data) {
    let error = new Error();

    if (data.title == "" || data.title == " ") {
        error.message = "Announcement Title can't be empty";
        throw error;
    } else if (data.description == "" || data.description == " ") {
        error.message = "Annnouncement Description can't be empty";
        throw error;
    }
}

module.exports = { validateAnnouncement }