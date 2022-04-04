const utilities = require("../utils/utilities");

// Fetch Notifications
const fetchNotifications = async (req, res) => {
    try {
        await connection.query(`select * from notification where notification_receiver= ${req.employee[0].emp_id} 
      and date(notification_sent_timestamp)=current_date() 
        order by notification_sent_timestamp desc;`,
            (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("Something went wrong", 400);
                    }
                    else{
                        return utilities.sendSuccessResponse(res, data, `Notifications fetched`);
                    }
                } catch(e){
                    return utilities.sendErrorResponse(res, "Some error occured", 400);
                }                
            }
        )
    } catch (e) {
        return utilities.sendErrorResponse(res, "Something went wrong", 400);
    }
}

const notificationFunctions = { fetchNotifications }

module.exports = notificationFunctions