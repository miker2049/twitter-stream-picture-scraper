
export default function getFormattedDate() {

    let date_ob = new Date();
    let date = intTwoChars(date_ob.getDate());
    let month = intTwoChars(date_ob.getMonth() + 1);
    let year = date_ob.getFullYear();
    let hours = intTwoChars(date_ob.getHours());
    let minutes = intTwoChars(date_ob.getMinutes());
    let seconds = intTwoChars(date_ob.getSeconds());
    let dateDisplay = `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`;
    return dateDisplay

}


function intTwoChars(i) {
    return (`0${i}`).slice(-2);
}
