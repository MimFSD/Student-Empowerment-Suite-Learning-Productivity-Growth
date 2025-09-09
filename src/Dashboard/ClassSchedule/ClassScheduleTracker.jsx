import React, { useState, useEffect } from 'react'
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiAcademicCap,
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiFilter,
  HiStar,
  HiEye,
  HiChevronLeft,
  HiChevronRight,
  HiBell,
  HiViewList
} from 'react-icons/hi'
import useAxios from '../../Hook/useAxios'
import useAuth from '../../Hook/useAuth'
import Swal from 'sweetalert2'

const ClassScheduleTracker = () => {
  const { user } = useAuth()
  const axiosInstance = useAxios()
  
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDay, setFilterDay] = useState('all')
  const [selectedWeek, setSelectedWeek] = useState(0)
  const [newClass, setNewClass] = useState({
    subject: '',
    timeFrom: '',
    timeTo: '',
    location: '',
    day: 'Monday',
    color: 'blue',
    instructor: '',
    credits: 1
  })

  // Update current time every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch classes when component mounts or user changes
  useEffect(() => {
    if (user?.uid) {
      fetchClasses()
    }
  }, [user])

  // Fetch all classes for the current user
  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get(`/api/classes/${user.uid}`)
      if (response.data.success) {
        setSchedule(response.data.data)
      } else {
        setError('Failed to fetch classes')
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setError('Error fetching classes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const colors = ['blue', 'purple', 'green', 'red', 'yellow', 'pink', 'indigo', 'cyan', 'orange']

  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
    green: 'bg-green-500/20 border-green-500/30 text-green-300',
    red: 'bg-red-500/20 border-red-500/30 text-red-300',
    yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
    pink: 'bg-pink-500/20 border-pink-500/30 text-pink-300',
    indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
    cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
    orange: 'bg-orange-500/20 border-orange-500/30 text-orange-300'
  }

  // Helper functions for responsive features
  const getCurrentWeekDates = (weekOffset = 0) => {
    const today = new Date()
    const currentDay = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1 + (weekOffset * 7))
    
    return days.map((_, index) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + index)
      return date
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const handleAddClass = async () => {
    if (newClass.subject && newClass.timeFrom && newClass.timeTo && newClass.location && user?.uid) {
      try {
        setError('')
        const response = await axiosInstance.post('/api/classes', {
          userId: user.uid,
          ...newClass
        })
        
        if (response.data.success) {
          // Refresh the classes list
          await fetchClasses()
          setNewClass({
            subject: '',
            timeFrom: '',
            timeTo: '',
            location: '',
            day: 'Monday',
            color: 'blue',
            instructor: '',
            credits: 1
          })
          setShowAddForm(false)
          
          // Success alert
          Swal.fire({
            title: 'Success!',
            text: 'Class added successfully!',
            icon: 'success',
            confirmButtonColor: '#10b981',
            background: '#1f2937',
            color: '#ffffff'
          })
        } else {
          setError('Failed to add class')
        }
      } catch (error) {
        console.error('Error adding class:', error)
        setError('Error adding class. Please try again.')
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add class. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#ffffff'
        })
      }
    }
  }

  const handleEditClass = (cls) => {
    // Extract timeFrom and timeTo from the time string
    const [timeFrom, timeTo] = cls.time.split(' - ')
    
    setEditingClass({
      ...cls,
      timeFrom,
      timeTo
    })
    setShowEditForm(true)
    setShowAddForm(false)
  }

  const handleUpdateClass = async () => {
    if (editingClass.subject && editingClass.timeFrom && editingClass.timeTo && editingClass.location) {
      try {
        setError('')
        const response = await axiosInstance.put(`/api/classes/${editingClass._id}`, {
          subject: editingClass.subject,
          timeFrom: editingClass.timeFrom,
          timeTo: editingClass.timeTo,
          location: editingClass.location,
          day: editingClass.day,
          color: editingClass.color
        })
        
        if (response.data.success) {
          // Refresh the classes list
          await fetchClasses()
          setEditingClass(null)
          setShowEditForm(false)
          
          // Success alert
          Swal.fire({
            title: 'Success!',
            text: 'Class updated successfully!',
            icon: 'success',
            confirmButtonColor: '#10b981',
            background: '#1f2937',
            color: '#ffffff'
          })
        } else {
          setError('Failed to update class')
        }
      } catch (error) {
        console.error('Error updating class:', error)
        setError('Error updating class. Please try again.')
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update class. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#ffffff'
        })
      }
    }
  }

  const handleDeleteClass = async (id, subject) => {
    // Confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${subject}" class?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff'
    })

    if (result.isConfirmed) {
      try {
        setError('')
        const response = await axiosInstance.delete(`/api/classes/${id}`)
        if (response.data.success) {
          // Refresh the classes list
          await fetchClasses()
          
          // Success alert
          Swal.fire({
            title: 'Deleted!',
            text: 'Class has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#10b981',
            background: '#1f2937',
            color: '#ffffff'
          })
        } else {
          setError('Failed to delete class')
        }
      } catch (error) {
        console.error('Error deleting class:', error)
        setError('Error deleting class. Please try again.')
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete class. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#ffffff'
        })
      }
    }
  }

  const getClassesForDay = (day) => {
    return schedule
      .filter(cls => cls.day === day)
      .filter(cls => {
        if (searchTerm) {
          return cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 cls.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 (cls.instructor && cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
        }
        return true
      })
      .sort((a, b) => {
        const aTime = a.time || `${getTimeComponents(a).timeFrom} - ${getTimeComponents(a).timeTo}`
        const bTime = b.time || `${getTimeComponents(b).timeFrom} - ${getTimeComponents(b).timeTo}`
        return aTime.localeCompare(bTime)
      })
  }

  // Get filtered classes for list view
  const getFilteredClasses = () => {
    let filtered = schedule
    
    if (searchTerm) {
      filtered = filtered.filter(cls => 
        cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cls.instructor && cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    if (filterDay !== 'all') {
      filtered = filtered.filter(cls => cls.day === filterDay)
    }
    
    return filtered.sort((a, b) => {
      const dayOrder = days.indexOf(a.day) - days.indexOf(b.day)
      if (dayOrder !== 0) return dayOrder
      const aTime = a.time || `${getTimeComponents(a).timeFrom} - ${getTimeComponents(a).timeTo}`
      const bTime = b.time || `${getTimeComponents(b).timeFrom} - ${getTimeComponents(b).timeTo}`
      return aTime.localeCompare(bTime)
    })
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading classes...</div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300">
          {error}
        </div>
        <button
          onClick={fetchClasses}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    )
  }

  // Helper function to convert 24-hour time to 12-hour format
  const formatTo12Hour = (time24) => {
    if (!time24) return time24
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Helper function to get current time in HH:MM:SS format
  const getCurrentTime = () => {
    const now = new Date()
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0') + ':' +
           now.getSeconds().toString().padStart(2, '0')
  }

  // Helper function to calculate time difference in seconds
  const getTimeDifferenceInSeconds = (targetTime) => {
    const now = new Date()
    const [targetHour, targetMinute] = targetTime.split(':').map(Number)
    const target = new Date()
    target.setHours(targetHour, targetMinute, 0, 0)
    
    return Math.floor((target - now) / 1000)
  }

  // Helper function to format time duration with seconds
  const formatDuration = (seconds) => {
    if (seconds < 0) return null
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Helper function to extract time components
  const getTimeComponents = (cls) => {
    if (cls.timeFrom && cls.timeTo) {
      return { timeFrom: cls.timeFrom, timeTo: cls.timeTo }
    }
    if (cls.time && cls.time.includes(' - ')) {
      const [timeFrom, timeTo] = cls.time.split(' - ')
      return { timeFrom, timeTo }
    }
    return { timeFrom: 'N/A', timeTo: 'N/A' }
  }

  // Helper function to get today's day name
  const getTodayName = () => {
    const today = new Date().getDay()
    return days[today === 0 ? 6 : today - 1] // Adjust for Sunday = 0
  }

  // Helper function to check class status
  const getClassStatus = (timeString) => {
    if (!timeString) return { status: 'unknown', message: 'Time not set' }
    
    const currentTime = getCurrentTime().substring(0, 5) // Get HH:MM part for comparison
    let startTime, endTime
    
    if (timeString.includes(' - ')) {
      [startTime, endTime] = timeString.split(' - ')
    } else {
      // If no separator, assume it's a single time or handle gracefully
      return { status: 'scheduled', message: 'Class scheduled' }
    }
    
    if (currentTime < startTime) {
      const secondsUntilStart = getTimeDifferenceInSeconds(startTime)
      const duration = formatDuration(secondsUntilStart)
      return { 
        status: 'upcoming', 
        message: duration ? `Starts in ${duration}` : `Starts at ${formatTo12Hour(startTime)}` 
      }
    } else if (currentTime >= startTime && currentTime <= endTime) {
      const secondsUntilEnd = getTimeDifferenceInSeconds(endTime)
      const duration = formatDuration(secondsUntilEnd)
      return { 
        status: 'ongoing', 
        message: duration ? `Ends in ${duration}` : `Ends at ${formatTo12Hour(endTime)}` 
      }
    } else {
      return { status: 'ended', message: 'Class ended' }
    }
  }

  // Get today's classes with status
  const getTodayClasses = () => {
    const todayName = getTodayName()
    return getClassesForDay(todayName).map(cls => {
      const { timeFrom, timeTo } = getTimeComponents(cls)
      return {
        ...cls,
        statusInfo: getClassStatus(cls.time || `${timeFrom} - ${timeTo}`)
      }
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <HiCalendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Class Schedule</h1>
              <p className="text-gray-400 text-sm">Manage your academic timetable</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm)
                setShowEditForm(false)
                setEditingClass(null)
              }}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <HiPlus className="w-4 h-4" />
              <span>Add Class</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes, locations, or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/40 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="bg-gray-800/40 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            <option value="all">All Days</option>
            {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
        </div>
      </div>

      {/* Today's Schedule - Enhanced */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
              <HiBell className="w-5 h-5 mr-2 text-yellow-400" />
              Today's Classes - {getTodayName()}
            </h2>
            <span className="text-xs text-gray-400 bg-gray-700/30 px-2 py-1 rounded-full">
              {getTodayClasses().length} classes
            </span>
          </div>
          <div className="space-y-3">
            {getTodayClasses().map((cls) => (
              <div
                key={cls.id}
                className={`${colorClasses[cls.color]} border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0`}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <HiAcademicCap className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">{cls.subject}</h4>
                    <p className="text-xs sm:text-sm opacity-80">{cls.location}</p>
                    {cls.instructor && <p className="text-xs opacity-70">{cls.instructor}</p>}
                  </div>
                </div>
                <div className="text-left sm:text-right ml-8 sm:ml-0">
                  <p className="font-medium text-sm sm:text-base">{cls.displayTime || cls.time || `${getTimeComponents(cls).timeFrom} - ${getTimeComponents(cls).timeTo}`}</p>
                  <p className={`text-xs sm:text-sm font-medium ${
                    cls.statusInfo?.status === 'ongoing' ? 'text-green-400' :
                    cls.statusInfo?.status === 'upcoming' ? 'text-blue-400' :
                    'text-red-400'
                  }`}>
                    {cls.statusInfo?.message || 'Class scheduled'}
                  </p>
                </div>
              </div>
            ))}
            
            {getTodayClasses().length === 0 && (
              <div className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
                <HiCalendar className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>No classes scheduled for today</p>
                <p className="text-xs mt-1">Enjoy your free time! 🎉</p>
              </div>
            )}
          </div>
        </div>

      {/* Add Class Form */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg mr-3">
                <HiPlus className="w-6 h-6 text-white" />
              </div>
              Add New Class
            </h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Subject Name *</label>
              <input
                type="text"
                placeholder="e.g., Computer Science"
                value={newClass.subject}
                onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Location/Room *</label>
              <input
                type="text"
                placeholder="e.g., Room 101, Building A"
                value={newClass.location}
                onChange={(e) => setNewClass({...newClass, location: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Instructor</label>
              <input
                type="text"
                placeholder="e.g., Prof. John Smith"
                value={newClass.instructor}
                onChange={(e) => setNewClass({...newClass, instructor: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Credits</label>
              <select
                value={newClass.credits}
                onChange={(e) => setNewClass({...newClass, credits: parseInt(e.target.value)})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                {[1,2,3,4,5,6].map(credit => (
                  <option key={credit} value={credit}>{credit} Credit{credit > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Start Time *</label>
              <input
                type="time"
                value={newClass.timeFrom}
                onChange={(e) => setNewClass({...newClass, timeFrom: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">End Time *</label>
              <input
                type="time"
                value={newClass.timeTo}
                onChange={(e) => setNewClass({...newClass, timeTo: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Day of Week *</label>
              <select
                value={newClass.day}
                onChange={(e) => setNewClass({...newClass, day: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Theme Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewClass({...newClass, color})}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      newClass.color === color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
                    } ${
                      color === 'blue' ? 'bg-blue-500' :
                      color === 'purple' ? 'bg-purple-500' :
                      color === 'green' ? 'bg-green-500' :
                      color === 'red' ? 'bg-red-500' :
                      color === 'yellow' ? 'bg-yellow-500' :
                      color === 'pink' ? 'bg-pink-500' :
                      color === 'indigo' ? 'bg-indigo-500' :
                      color === 'cyan' ? 'bg-cyan-500' :
                      'bg-orange-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleAddClass}
              disabled={!newClass.subject || !newClass.timeFrom || !newClass.timeTo || !newClass.location}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <HiPlus className="w-5 h-5" />
              <span>Add Class</span>
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewClass({
                  subject: '',
                  timeFrom: '',
                  timeTo: '',
                  location: '',
                  day: 'Monday',
                  color: 'blue',
                  instructor: '',
                  credits: 1
                })
              }}
              className="px-6 py-3 bg-gray-700/60 text-gray-300 rounded-xl hover:bg-gray-600/60 hover:text-white transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* All Classes */}
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
              <HiViewList className="w-6 h-6 text-white" />
            </div>
            All Classes
            <span className="ml-3 text-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-3 py-1 rounded-full text-blue-300">
              {getFilteredClasses().length} total
            </span>
          </h2>
          
          {getFilteredClasses().length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <HiEye className="w-4 h-4" />
              <span className="hidden sm:inline">Click to edit</span>
              <span className="sm:hidden">Tap to edit</span>
            </div>
          )}
        </div>
        
        {getFilteredClasses().length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-6">
            {getFilteredClasses().map((cls, index) => {
              // Calculate duration
              const { timeFrom, timeTo } = getTimeComponents(cls)
              const calculateDuration = (startTime, endTime) => {
                if (!startTime || !endTime || startTime === 'N/A' || endTime === 'N/A') return 'N/A'
                const [startHour, startMin] = startTime.split(':').map(Number)
                const [endHour, endMin] = endTime.split(':').map(Number)
                if (isNaN(startHour) || isNaN(startMin) || isNaN(endHour) || isNaN(endMin)) return 'N/A'
                const startMinutes = startHour * 60 + startMin
                const endMinutes = endHour * 60 + endMin
                const durationMinutes = endMinutes - startMinutes
                const hours = Math.floor(durationMinutes / 60)
                const minutes = durationMinutes % 60
                return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
              }

              const duration = calculateDuration(timeFrom, timeTo)
              
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer ${colorClasses[cls.color]}`}
                  onClick={() => handleEditClass(cls)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-5 ${
                    cls.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    cls.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    cls.color === 'green' ? 'from-green-500 to-green-600' :
                    cls.color === 'red' ? 'from-red-500 to-red-600' :
                    cls.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                    cls.color === 'pink' ? 'from-pink-500 to-pink-600' :
                    cls.color === 'indigo' ? 'from-indigo-500 to-indigo-600' :
                    cls.color === 'cyan' ? 'from-cyan-500 to-cyan-600' :
                    'from-orange-500 to-orange-600'
                  }`} />
                  
                  <div className="relative p-4 sm:p-6">
                    <div className="flex flex-col space-y-4">
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 ${
                            cls.color === 'yellow' ? 'text-yellow-200' : 
                            `text-${cls.color}-200`
                          }`}>
                            {cls.subject}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              cls.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30' :
                              `bg-${cls.color}-500/20 text-${cls.color}-200 border border-${cls.color}-500/30`
                            }`}>
                              {cls.day}
                            </span>
                            {cls.credits && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50">
                                {cls.credits} CR
                              </span>
                            )}
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30">
                              {duration}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1 bg-gray-800/40 rounded-lg p-1 self-start">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClass(cls);
                            }}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-md transition-all duration-200"
                            title="Edit Class"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClass(cls._id || cls.id, cls.subject);
                            }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-all duration-200"
                            title="Delete Class"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Time Information */}
                        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <HiClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Time</span>
                          </div>
                          <div className="text-sm font-medium text-white">
                            {timeFrom} - {timeTo}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Duration: {duration}
                          </div>
                        </div>
                        
                        {/* Location Information */}
                        {cls.location && (
                          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                            <div className="flex items-center space-x-2 mb-2">
                              <HiLocationMarker className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Location</span>
                            </div>
                            <div className="text-sm font-medium text-white truncate" title={cls.location}>
                              {cls.location}
                            </div>
                          </div>
                        )}
                        
                        {/* Instructor Information */}
                        {cls.instructor && (
                          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30 sm:col-span-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <HiAcademicCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Instructor</span>
                            </div>
                            <div className="text-sm font-medium text-white" title={cls.instructor}>
                              {cls.instructor}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            cls.color === 'blue' ? 'bg-blue-400' :
                            cls.color === 'purple' ? 'bg-purple-400' :
                            cls.color === 'green' ? 'bg-green-400' :
                            cls.color === 'red' ? 'bg-red-400' :
                            cls.color === 'yellow' ? 'bg-yellow-400' :
                            cls.color === 'pink' ? 'bg-pink-400' :
                            cls.color === 'indigo' ? 'bg-indigo-400' :
                            cls.color === 'cyan' ? 'bg-cyan-400' :
                            'bg-orange-400'
                          }`} />
                          <span className="text-xs text-gray-400">
                            Theme: {cls.color.charAt(0).toUpperCase() + cls.color.slice(1)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {cls._id ? cls._id.slice(-6) : index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Effect Border */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                    cls.color === 'blue' ? 'from-blue-400 to-blue-500' :
                    cls.color === 'purple' ? 'from-purple-400 to-purple-500' :
                    cls.color === 'green' ? 'from-green-400 to-green-500' :
                    cls.color === 'red' ? 'from-red-400 to-red-500' :
                    cls.color === 'yellow' ? 'from-yellow-400 to-yellow-500' :
                    cls.color === 'pink' ? 'from-pink-400 to-pink-500' :
                    cls.color === 'indigo' ? 'from-indigo-400 to-indigo-500' :
                    cls.color === 'cyan' ? 'from-cyan-400 to-cyan-500' :
                    'from-orange-400 to-orange-500'
                  }`} />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl p-6 sm:p-8 mx-auto max-w-md">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                <HiCalendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Classes Found</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                {searchTerm || filterDay !== 'all' 
                  ? 'No classes match your current filters. Try adjusting your search criteria or clear the filters.' 
                  : 'You haven\'t added any classes yet. Start building your schedule by adding your first class!'
                }
              </p>
              {(!searchTerm && filterDay === 'all') && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2 mx-auto"
                >
                  <HiPlus className="w-5 h-5" />
                  <span>Add Your First Class</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Class Form */}
      {showEditForm && editingClass && (
        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg mr-3">
                <HiPencil className="w-6 h-6 text-white" />
              </div>
              Edit Class
            </h2>
            <button
              onClick={() => {
                setShowEditForm(false)
                setEditingClass(null)
              }}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Subject Name *</label>
              <input
                type="text"
                placeholder="e.g., Computer Science"
                value={editingClass.subject}
                onChange={(e) => setEditingClass({...editingClass, subject: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Location/Room *</label>
              <input
                type="text"
                placeholder="e.g., Room 101, Building A"
                value={editingClass.location}
                onChange={(e) => setEditingClass({...editingClass, location: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Instructor</label>
              <input
                type="text"
                placeholder="e.g., Prof. John Smith"
                value={editingClass.instructor || ''}
                onChange={(e) => setEditingClass({...editingClass, instructor: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Credits</label>
              <select
                value={editingClass.credits || 1}
                onChange={(e) => setEditingClass({...editingClass, credits: parseInt(e.target.value)})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {[1,2,3,4,5,6].map(credit => (
                  <option key={credit} value={credit}>{credit} Credit{credit > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Start Time *</label>
              <input
                type="time"
                value={editingClass.timeFrom}
                onChange={(e) => setEditingClass({...editingClass, timeFrom: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">End Time *</label>
              <input
                type="time"
                value={editingClass.timeTo}
                onChange={(e) => setEditingClass({...editingClass, timeTo: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Day of Week *</label>
              <select
                value={editingClass.day}
                onChange={(e) => setEditingClass({...editingClass, day: e.target.value})}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Theme Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setEditingClass({...editingClass, color})}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      editingClass.color === color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
                    } ${
                      color === 'blue' ? 'bg-blue-500' :
                      color === 'purple' ? 'bg-purple-500' :
                      color === 'green' ? 'bg-green-500' :
                      color === 'red' ? 'bg-red-500' :
                      color === 'yellow' ? 'bg-yellow-500' :
                      color === 'pink' ? 'bg-pink-500' :
                      color === 'indigo' ? 'bg-indigo-500' :
                      color === 'cyan' ? 'bg-cyan-500' :
                      'bg-orange-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleUpdateClass}
              disabled={!editingClass.subject || !editingClass.timeFrom || !editingClass.timeTo || !editingClass.location}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <HiPencil className="w-5 h-5" />
              <span>Update Class</span>
            </button>
            <button
              onClick={() => {
                setShowEditForm(false)
                setEditingClass(null)
              }}
              className="px-6 py-3 bg-gray-700/60 text-gray-300 rounded-xl hover:bg-gray-600/60 hover:text-white transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default ClassScheduleTracker