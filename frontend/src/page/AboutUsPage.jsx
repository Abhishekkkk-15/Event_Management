import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
const AboutUsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center mb-14 text-[white] " style={{padding:"10px"}}>
      <div className="w-full max-w-4xl shadow-lg p-8 border-2 border-white rounded-4xl" style={{ padding:"10px"}}>
        <h1 className="text-[44px] font-bold text-center mb-6 text-[#F2F826]" style={{fontSize:"33px"}}>
          About Our Event Management Platform
        </h1>

        <p className="text-lg mb-6 leading-relaxed">
          Welcome to <span className="font-semibold">Event Buddy</span> – your ultimate platform for seamless event planning, ticket booking, and real-time event updates. We are dedicated to providing organizers and attendees with a smooth and hassle-free experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 w-full">
          <div className="p-4 rounded-md ">
            <h2 className="text-xl font-semibold text-[#F2F826] mb-3">Our Mission</h2>
            <p>
              Our mission is to revolutionize the event industry by offering a user-friendly and efficient platform for event discovery, planning, and ticketing. We aim to simplify event management for organizers while ensuring a seamless experience for attendees.
            </p>
          </div>
          <div className="p-4 rounded-md">
            <h2 className="text-xl font-semibold text-[#F2F826] mb-3">Our Vision</h2>
            <p>
              We envision a world where every event, big or small, is easily accessible, well-organized, and engaging. Our platform bridges the gap between event organizers and attendees, making memorable experiences more reachable than ever.
            </p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-[#F2F826]">Why Choose Us?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Effortless event planning and ticket booking.</li>
            <li>Real-time updates and notifications.</li>
            <li>Secure and hassle-free payment options.</li>
            <li>A vibrant community of event enthusiasts.</li>
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
          <p className="mb-6">
            Have questions or want to collaborate? Connect with us on LinkedIn and GitHub to stay updated and explore more.
          </p>
          <div className="flex justify-center space-x-6 gap-4" style={{marginTop:"10px"}} >
            <a
              href="https://www.linkedin.com/in/abhishek-jangid-3532b1323"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={30} />
            </a>
            <a
              href="https://github.com/Abhishekkkk-15"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
