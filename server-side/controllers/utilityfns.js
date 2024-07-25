module.exports.formatDate = (dateString) => {
    const createdAt = new Date(dateString);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = createdAt.getDate();
    const monthIndex = createdAt.getMonth();
    const year = createdAt.getFullYear();

    const formattedDate = `${day} ${months[monthIndex]} ${year}`;

    return formattedDate;
}
module.exports.isWithin24Hours = (dateString) => {
    // Convert the date string to a Date object
    const date = new Date(dateString);

    // Get the current time in milliseconds
    const currentTime = new Date().getTime();

    // Calculate the time difference between the current time and the date in milliseconds
    const timeDifference = currentTime - date.getTime();

    // Calculate the number of hours in milliseconds
    const hoursInMilliseconds = 24 * 60 * 60 * 1000;

    // Check if the time difference is less than 24 hours
    return timeDifference < hoursInMilliseconds;
}

module.exports.getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const difference = currentDate - date;

    // Define time intervals in milliseconds
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    // Determine the appropriate time unit and value
    if (difference < minute) {
        return 'Just now';
    } else if (difference < hour) {
        return `${Math.floor(difference / minute)}m ago`;
    } else if (difference < day) {
        return `${Math.floor(difference / hour)}h ago`;
    } else if (difference < week) {
        return `${Math.floor(difference / day)}d ago`;
    } else if (difference < month) {
        return `${Math.floor(difference / week)}w ago`;
    } else if (difference < year) {
        return `${Math.floor(difference / month)}mo ago`;
    } else {
        return `${Math.floor(difference / year)}y ago`;
    }
}