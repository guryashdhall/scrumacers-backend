const validate_announcement = require('../validation/validateAnnouncement');

// Fetch Data - Announcement Module
const fetchAnnouncements = async (req, res) => {
    let e = new Error()
    try {
        await connection.query(`select e.first_name, e.last_name, e.email, e.emp_type, et.type_name as 'employee_position',
        t.team_name, a.* from announcement as a left join employee as e
        on a.posted_by=e.emp_id
        left join team as t on e.team_id=t.team_id
        left join employee_type as et on e.emp_type=et.id
        order by created_at desc;`, (err, data) => {
            if (err) {
                e.message = "something went wrong";
                e.status = 400;
                throw e;
            }
            return res.status(200).json({ data, message: `announcements fetched`, status: true });
        })
    } catch (e) {
        return res
            .status(400)
            .json({ data: false, message: `fail`, status: false });
    }
}

const postAnnouncement = async (req, res) => {
    let e = new Error()
    try {
        validate_announcement.validateAnnouncement(req.body);
        await connection.query(`insert announcement (title, description, posted_by) values
      ("${req.body.title}","${req.body.description}",${req.employee[0].emp_id});`, (err, data) => {
            if (err) {
                e.message = "something went wrong";
                e.status = 400;
                throw e;
            }
            if (data.affectedRows) {
                return res.status(200).json({ data: true, message: `announcement added`, status: true });
            } else {
                return res.status(400).json({ data: false, message: `announcement didn't update`, status: false });
            }
        })
    } catch (e) {
        return res
            .status(400)
            .json({ data: false, message: `fail`, status: false });
    }
}

const deleteAnnouncement = async (req, res) => {
    let e = new Error()
    try {
        await connection.query(`delete from announcement where id=${req.body.post_id} and posted_by=${req.employee[0].emp_id};`,
            (err, data) => {
                if (err) {
                    e.message = "Something went wrong";
                    e.status = 400;
                    throw e;
                }
                if (data.affectedRows) {
                    return res.status(200).json({ data: true, message: `Announcement Deleted`, status: true });
                } else {
                    return res.status(400).json({ data: false, message: `Couldn't delete announcement. Try again!`, status: false });
                }
            })
    } catch (e) {
        return res
            .status(400)
            .json({ data: false, message: `Something went wrong`, status: false });
    }
}

const announcementFunctions = {
    fetchAnnouncements,
    postAnnouncement,
    deleteAnnouncement
}

module.exports = announcementFunctions