import { useSelector } from "react-redux";

const EditUserProfile = () => {
    const user = useSelector((state) => state.auth.user)
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4">
          <div className="flex items-center space-x-3 pb-4 border-b">
            <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full" />
            <div>
              <h3 className="text-lg font-semibold mr-10">{user.name}</h3>
              <p className="text-sm text-gray-500">Co-Founder</p>
            </div>
          </div>
          <nav className="mt-4">
            <ul className="space-y-2">
              <li className="text-blue-600 font-medium">My Profile</li>
              <li className="text-gray-600">Availability</li>
              <li className="text-gray-600">Billings & Earnings</li>
              <li className="text-gray-600">Connectivity</li>
              <li className="text-red-500">Logout</li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold">Edit User Profile</h2>
          
          {/* Profile Section */}
          <div className="bg-white shadow p-4 mt-4 rounded-lg flex items-center space-x-4">
            <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full" />
            <div>
              <p className="text-sm text-gray-500">Your Photo</p>
              <button className="bg-gray-200 px-3 py-1 rounded mr-2">Upload New</button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
            </div>
          </div>
          
          {/* Personal Info */}
          <div className="bg-white shadow p-4 mt-4 rounded-lg">
            <h3 className="font-medium mb-2">Personal Information</h3>
            <div className="space-y-2">
              <input className="w-full border p-2 rounded" placeholder="Full Name" value="Ayman Shaltoni" readOnly />
              <input className="w-full border p-2 rounded" placeholder="Email Address" value="Aymanshaltoni@gmail.com" readOnly />
              <input className="w-full border p-2 rounded" placeholder="Mobile Number" value="+966 5502938123" readOnly />
              <input className="w-full border p-2 rounded" placeholder="Role" value="Senior Product Designer" readOnly />
            </div>
          </div>
          
          {/* Bio Section */}
          <div className="bg-white shadow p-4 mt-4 rounded-lg">
            <h3 className="font-medium">Bio</h3>
            <p className="text-gray-600 text-sm mt-2">
              I'm a product designer specialized in user interface designs (Web & Mobile) with 10 years of experience...
            </p>
          </div>
          
          {/* Industry & Interests */}
          <div className="bg-white shadow p-4 mt-4 rounded-lg">
            <h3 className="font-medium">Industry/Interests</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {['UI Design', 'Framer', 'Startups', 'UX', 'Crypto', 'Mobile Apps', 'Webflow'].map(tag => (
                <span key={tag} className="bg-gray-200 text-sm px-2 py-1 rounded">{tag}</span>
              ))}
            </div>
          </div>
          
          {/* Social Media Accounts */}
          <div className="bg-white shadow p-4 mt-4 rounded-lg">
            <h3 className="font-medium">Social Media Accounts</h3>
            <div className="mt-2 space-y-2">
              <input className="w-full border p-2 rounded" value="https://twitter.com/Shalt0ni" readOnly />
              <input className="w-full border p-2 rounded" value="https://instagram.com/shaltoni" readOnly />
              <input className="w-full border p-2 rounded" value="https://www.linkedin.com/in/aymanshaltoni/" readOnly />
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  export default EditUserProfile;
  