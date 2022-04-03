// Fetch Notifications
const fetchNotifications = async (req, res) => {
    let e = new Error();
    try {
        await connection.query(`select * from notification where notification_receiver= ${req.employee[0].emp_id} 
      and date(notification_sent_timestamp)=current_date() 
        order by notification_sent_timestamp desc;`,
            (err, data) => {
                if (err) {
                    e.message = "Something went wrong";
                    e.status = 400;
                    throw e;
                }
                return res.status(200).json({ data: data, message: `Notifications fetched`, status: true });
            }
        )
    } catch (e) {
        return res
            .status(400)
            .json({ data: false, message: `Something went wrong`, status: false });
    }
}

const notificationFunctions = { fetchNotifications }

module.exports = notificationFunctions