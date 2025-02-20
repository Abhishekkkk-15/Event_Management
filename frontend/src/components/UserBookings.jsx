import React from 'react'

function UserBookings({userBookings}) {
  console.log(userBookings)
  let today = Date.now()
  return (
    <div>
        <span className='text-4xl m-10'>Bookings</span>
        <div className='flex flex-col gap-1'>
        {
          userBookings.map((data,idx)=>(
            <div key={idx} className={`flex justify-between ${data?.event.date <= today ? 'bg-red-500' : 'bg-green-500'} p-4 rounded-md`}>
              <h1>{data?.event.title}</h1>
              <span>{data.event.startAt}</span>
            </div>
          ))
        }
        </div>
    </div>
  )
}

export default UserBookings