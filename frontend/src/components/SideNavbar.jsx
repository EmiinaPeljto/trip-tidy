import React, { useState } from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const SideNavbar = ({ itinerary, onSave, onDaySelect }) => {
  const [isSummaryOpen, setSummaryOpen] = useState(true);
  const [isItineraryOpen, setItineraryOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const days =
    itinerary?.itinerary_days?.length ||
    itinerary?.itinerary?.itineraryDays?.length ||
    itinerary?.duration ||
    5;
  const dayLinks = Array.from({ length: days }, (_, i) => `Day ${i + 1}`);

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const NavSection = ({ icon: Icon, title, isOpen, toggle, children }) => (
    <li className="mb-6">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center font-semibold text-gray-700 hover:text-blue-500 transition text-md"
      >
        <div className="flex items-center space-x-3">
          <Icon className="text-lg" />
          <span>{title}</span>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <ul className="mt-3 pl-7 space-y-2 text-gray-600 text-sm">
          {children}
        </ul>
      )}
    </li>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-5 right-5 z-50 p-2 bg-white rounded-full shadow-lg text-gray-800"
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }
        md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white h-full p-6 border-r border-gray-200 shadow-md md:shadow-none `}
      >
        <nav className="flex flex-col h-full justify-between">
          <ul className="space-y-4 overflow-y-auto flex-grow">
            <NavSection
              icon={FaClipboardList}
              title="Summary"
              isOpen={isSummaryOpen}
              toggle={() => setSummaryOpen(!isSummaryOpen)}
            >
              <li>
                <a
                  href="#travel-checklist"
                  onClick={(e) => handleScroll(e, "travel-checklist")}
                  className="hover:text-blue-500"
                >
                  Travel Checklist
                </a>
              </li>
              <li>
                <a
                  href="#hotel-recommendations"
                  onClick={(e) => handleScroll(e, "hotel-recommendations")}
                  className="hover:text-blue-500"
                >
                  Hotel Recommendations
                </a>
              </li>
              <li>
                <a
                  href="#flights"
                  onClick={(e) => handleScroll(e, "flights")}
                  className="hover:text-blue-500"
                >
                  Flights
                </a>
              </li>
              <li>
                <a
                  href="#place-recommendations"
                  onClick={(e) => handleScroll(e, "place-recommendations")}
                  className="hover:text-blue-500"
                >
                  Place Recommendations
                </a>
              </li>
            </NavSection>

            <NavSection
              icon={FaCalendarAlt}
              title="Itinerary"
              isOpen={isItineraryOpen}
              toggle={() => setItineraryOpen(!isItineraryOpen)}
            >
              {dayLinks.map((day, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 hover:text-blue-500 rounded"
                    onClick={(e) => {
                      // Optionally scroll to the itinerary section
                      const itinerarySection =
                        document.getElementById("itinerary-details");
                      if (itinerarySection) {
                        itinerarySection.scrollIntoView({ behavior: "smooth" });
                      }
                      if (onDaySelect) onDaySelect(i);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {day}
                  </button>
                </li>
              ))}
            </NavSection>

            <li>
              <a
                href="#budget"
                onClick={(e) => handleScroll(e, "budget")}
                className="flex items-center space-x-3 font-semibold text-gray-700 hover:text-blue-500 transition text-md"
              >
                <FaMoneyBillWave className="text-lg" />
                <span>Budget</span>
              </a>
            </li>
          </ul>

          {/* Save Itinerary Button */}
          <ul className="mt-4 border-t pt-4 border-gray-200">
            <li>
              <button
                onClick={onSave}
                className="w-full flex items-center space-x-3 font-semibold text-gray-700 hover:text-blue-500 transition text-md"
              >
                <FaSave className="text-lg" />
                <span>Save Itinerary</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SideNavbar;
