import React from 'react';

const BookedClasses = ({user_id, attendances, lessons, types, teachers, locations, unbookLesson}) => {
  return (
  <div>
    {(attendances.length <= 0) ? (
      <div className="center-align">
        No Booked Classes
      </div>
    ) : (
      <div>
        <div className="row title">
          <div className="col s6 m2 l2">
            Date
          </div>
          <div className="col s6 m2 l2">
            Time
          </div>
          <div className="col s6 m2 l2">
            Class Type
          </div>
          <div className="col s6 m2 l2">
            Teacher
          </div>
          <div className="col s6 m2 l2">
            Location
          </div>
          <div className="col s12 m2 l2">
            Booking
          </div>
        </div>
        {attendances.map((attendance, i) =>
          <div key={"attendance" + i} className="row">
            <div className="col s6 m2 l2">
              {(lessons).find((lesson) => {return (lesson._id === attendance.lesson_id)}).date}
            </div>
            <div className="col s6 m2 l2">
              {(lessons).find((lesson) => {return (lesson._id === attendance.lesson_id)}).startTime} ~
              {(lessons).find((lesson) => {return (lesson._id === attendance.lesson_id)}).endTime}
            </div>
            <div className="col s6 m2 l2">
              {types[(types.findIndex(type => type._id===((lessons).find((lesson) => {return (lesson._id === attendance.lesson_id)}).type_id)))].name}
            </div>
            <div className="col s6 m2 l2">
              {teachers[(teachers.findIndex(teacher => teacher._id===((lessons).find((lesson) => {return (lesson._id === attendance.lesson_id)}).user_id)))].firstName}
              &nbsp;{teachers[(teachers.findIndex(teacher => teacher._id===((lessons).find((lesson) => {return (lesson._id === attendance.lesson_id)}).user_id)))].lastName}
            </div>
            <div className="col s6 m2 l2">
              {locations[(locations.findIndex(location => location._id===((lessons).find((lesson) => {return (lesson._id === attendance.lesson_id)}).location_id)))].name}
            </div>
            <div className="col s12 m1 l1">
              <button className="btn booking-btn waves-effect waves-light deep-orange lighten-1" onClick={() => { unbookLesson((user_id), ((lessons).find((lesson) => {return (lesson._id === attendance.lesson_id)})._id)) }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    )}
  </div>


  )
};

export default BookedClasses;
