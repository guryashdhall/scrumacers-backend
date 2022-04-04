const utilities = require('../utils/utilities');
const validate_announcement = require('../validation/validateAnnouncement');

// Fetch Data - Announcement Module
const fetchAnnouncements = async (_req, res) => {    
    try {
        await connection.query(`select e.first_name, e.last_name, e.email, e.emp_type, et.type_name as 'employee_position',
        t.team_name, a.* from announcement as a left join employee as e
        on a.posted_by=e.emp_id
        left join team as t on e.team_id=t.team_id
        left join employee_type as et on e.emp_type=et.id
        order by created_at desc;`, (err, data) => {
            try{
                if (err) {
                    utilities.throwError("Fetch announcement SQL Failure",400);  
                }
                else{
                    return utilities.sendSuccessResponse(res,data,`announcements fetched`);                    
                }
            } catch(e){
                return utilities.sendErrorResponse(res,"Some error occured",400);
            }                        
        })
    } catch (e) {
        return utilities.sendErrorResponse(res,"Request Failed",400);
    }
}

const postAnnouncement = async (req, res) => {    
    try {
        validate_announcement.validateAnnouncement(req.body);
        await connection.query(`insert announcement (title, description, posted_by) values
      ("${req.body.title}","${req.body.description}",${req.employee[0].emp_id});`, (err, data) => {
          try{
            if (err) {
                utilities.throwError("Insert announcement SQL Failure",400);                
            }
            else{
                if (data.affectedRows) {
                    return utilities.sendSuccessResponse(res,data,`announcement added`);
                } else {
                    return utilities.sendErrorResponse(res,`announcement didn't update`,400);
                }
            }
          } catch(e){
            return utilities.sendErrorResponse(res,"Some error occured",400);
          }            
        })
    } catch (e) {
        return utilities.sendErrorResponse(res,"Request Failed",400);
    }
}

const deleteAnnouncement = async (req, res) => {    
    try {
        await connection.query(`delete from announcement where id=${req.body.post_id} and posted_by=${req.employee[0].emp_id};`,
            (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("Delete announcement SQL Failure",400); 
                    }
                    else{
                        if (data.affectedRows) {
                            return utilities.sendSuccessResponse(res,data,`Announcement Deleted`);
                        } else {
                            return utilities.sendErrorResponse(res,"Couldn't delete announcement. Try again!",400);
                        }
                    }
                } catch(e){
                    return utilities.sendErrorResponse(res,"Some error occured",400);
                }                                
            })
    } catch (e) {
        return utilities.sendErrorResponse(res,"Request Failed",400);
    }
}

const announcementFunctions = {
    fetchAnnouncements,
    postAnnouncement,
    deleteAnnouncement
}

module.exports = announcementFunctions