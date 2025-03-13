import React from 'react'
import Header from '../components/NewHeader'
import Cards from '../components/Cards'
import EmailVerificationBanner from '../components/EmailVerificationBanner'

function HomePage() {
  return (
    <div className='bg-[#000000] h-full ' style={{paddingBottom:"45px"}}>
        <Cards/>
    </div>
  )
}

export default HomePage