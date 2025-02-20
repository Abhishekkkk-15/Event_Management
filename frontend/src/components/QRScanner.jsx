import {QrReader} from 'react-qr-reader'

import React, { useState } from 'react'
import { ticketScanner } from '../REST_API/booking.js'

function QRScanner() {
    const [ticketStatus,setTicketStatus] = useState("")

    const handleScan = async(ticketId)=>{
        if(!ticketId) return
        try {
            const {data} = await ticketScanner({ticketId,eventId:"1f6f0360-be7e-4c18-bc94-4be95bb2167e"})
            console.log(data.message)
            setTicketStatus(data.message)
        } catch (error) {
            console.log(error.response.data.message)
            setTicketStatus(error.response.data.message)
        }
    }

  return (
    <div>
        <h3>Scan Ticket</h3>
        <QrReader
        delay={10000} 
        onResult={(result, error) => {
            if (result) {
              console.log(result.text)
              handleScan(result.text)
            }
  
            // if (!!error) {
            //   console.log(error);
            // }
          }}
        // onError={(err) => console.log(err)} 
        style={{width:"300px"}}
        />
        <p>{ticketStatus}</p>
    </div>
  )
}

export default QRScanner