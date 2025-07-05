import React, { useState } from 'react';
import { FaClipboardList, FaCalendarAlt, FaMoneyBillWave, FaChevronDown, FaChevronUp, FaBars, FaTimes } from 'react-icons/fa';

const SideNavbar = ({ itinerary }) => {
  const [isSummaryOpen, setSummaryOpen] = useState(true);
  const [isItineraryOpen, setItineraryOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const days = itinerary?.itinerary_days?.length || itinerary?.duration || 5;
  const dayLinks = Array.from({ length: days }, (_, i) => `Day ${i + 1}`);

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleSummary = () => setSummaryOpen(!isSummaryOpen);
  const toggleItinerary = () => setItineraryOpen(!isItineraryOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-5 right-5 z-50 p-2 bg-white rounded-full shadow-lg text-gray-800"
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-white w-full sm:w-64 md:w-full h-full p-6 flex flex-col shadow-lg md:shadow-none `}
      >
        <nav className="h-full">
          <ul className="flex flex-col h-full">
            {/* Summary Section */}
            <li className="mb-4">
              <button
                onClick={toggleSummary}
                className="w-full flex justify-between items-center font-semibold text-lg text-gray-800 mb-2 focus:outline-none hover:text-[#5AB1F5] transition-colors"
              >
                <div className="flex items-center">
                  <FaClipboardList className="mr-3 text-xl" />
                  <span>Summary</span>
                </div>
                {isSummaryOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {isSummaryOpen && (
                <ul className="pl-8 border-l-2 border-gray-200 space-y-2 mt-2 transition-all duration-300">
                  <li><a href="#travel-checklist" onClick={(e) => handleScroll(e, 'travel-checklist')} className="block py-1 text-gray-600 hover:text-[#5AB1F5] transition">Travel Checklist</a></li>
                  <li><a href="#hotel-recommendations" onClick={(e) => handleScroll(e, 'hotel-recommendations')} className="block py-1 text-gray-600 hover:text-[#5AB1F5] transition">Hotel Recommendations</a></li>
                  <li><a href="#flights" onClick={(e) => handleScroll(e, 'flights')} className="block py-1 text-gray-600 hover:text-[#5AB1F5] transition">Flights</a></li>
                  <li><a href="#place-recommendations" onClick={(e) => handleScroll(e, 'place-recommendations')} className="block py-1 text-gray-600 hover:text-[#5AB1F5] transition">Place Recommendations</a></li>
                </ul>
              )}
            </li>

            {/* Itinerary Section */}
            <li className="mb-4">
              <button
                onClick={toggleItinerary}
                className="w-full flex justify-between items-center font-semibold text-lg text-gray-800 mb-2 focus:outline-none hover:text-[#5AB1F5] transition-colors"
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3 text-xl" />
                  <span>Itinerary</span>
                </div>
                {isItineraryOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {isItineraryOpen && (
                <ul className="pl-8 border-l-2 border-gray-200 space-y-2 mt-2 transition-all duration-300 max-h-60 overflow-y-auto">
                  {dayLinks.map(day => (
                    <li key={day}>
                      <a href={`#${day.toLowerCase().replace(' ', '-')}`} onClick={(e) => handleScroll(e, `${day.toLowerCase().replace(' ', '-')}`)} className="block py-1 text-gray-600 hover:text-[#5AB1F5] transition">{day}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Budget Section */}
            <li className="mb-4">
              <a 
                href="#budget" 
                onClick={(e) => handleScroll(e, 'budget')} 
                className="w-full flex items-center font-semibold text-lg text-gray-800 focus:outline-none hover:text-[#5AB1F5] transition-colors"
              >
                <FaMoneyBillWave className="mr-3 text-xl" />
                <span>Budget</span>
              </a>
            </li>

            {/* Empty space */}
            <li className="mt-auto"></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default SideNavbar;
