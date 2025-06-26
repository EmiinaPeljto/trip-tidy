import React, { useRef } from "react";

const OTP_LENGTH = 6;

const VerificationCodeInput = ({ code, setCode }) => {
  const inputsRef = useRef([]);

  // Split code into array for controlled inputs
  const codeDigits = code.padEnd(OTP_LENGTH, "").split("");

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const newCode =
      code.substring(0, idx) + val + code.substring(idx + 1, OTP_LENGTH);
    setCode(newCode.slice(0, OTP_LENGTH));
    // Move focus to next input
    if (idx < OTP_LENGTH - 1 && val) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      if (!codeDigits[idx] && idx > 0) {
        setCode(
          code.substring(0, idx - 1) + "" + code.substring(idx, OTP_LENGTH)
        );
        inputsRef.current[idx - 1].focus();
      } else {
        setCode(
          code.substring(0, idx) + "" + code.substring(idx + 1, OTP_LENGTH)
        );
      }
      e.preventDefault();
    } else if (!/^[0-9]$/.test(e.key) && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    if (text.length === OTP_LENGTH) {
      setCode(text);
      inputsRef.current[OTP_LENGTH - 1].focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: OTP_LENGTH }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={codeDigits[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="shadow-xs w-12 h-14 sm:w-16 sm:h-16 rounded-lg border border-gray-300 bg-white p-2 text-center text-2xl sm:text-4xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AB1F5] transition"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default VerificationCodeInput;
