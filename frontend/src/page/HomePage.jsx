import React from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import EmailVerificationBanner from '../components/EmailVerificationBanner'

function HomePage() {
  return (
    <div>
        <Header/>
        <EmailVerificationBanner/>
        <Cards/>
    </div>
  )
}

export default HomePage