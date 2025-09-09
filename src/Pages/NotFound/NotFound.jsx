import React from 'react'
import { HiHome, HiSearch, HiArrowLeft, HiBookOpen } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Main Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mb-6">
            <HiBookOpen className="w-16 h-16 text-blue-400" />
          </div>

          {/* 404 Number */}
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            404
          </h1>

          {/* Main Heading */}
          <h2 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Oops! It looks like the page you're looking for has gone on a study break.
            Don't worry, let's get you back on track with your learning journey.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          {/* Go Back Button */}
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-700/50 hover:bg-gray-700/70 text-white rounded-xl font-medium transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          {/* Home Button */}
          <Link
            to="/"
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <HiHome className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Search Button */}
          <Link
            to="/"
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-xl font-medium transition-all duration-200 border border-purple-500/30 hover:border-purple-400/50"
          >
            <HiSearch className="w-5 h-5" />
            <span>Explore Features</span>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-pink-500/10 rounded-full blur-xl animate-pulse"></div>
      </div>
    </div>
  )
}

export default NotFound