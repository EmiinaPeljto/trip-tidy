import React from "react";

const ResendCodeButton = ({ onResend, resendDisabled, timer }) => (
  <div className="flex flex-col items-center mt-4">
    <button
      type="button"
      onClick={onResend}
      disabled={resendDisabled || timer > 0}
      className={`text-[#5AB1F5] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      Resend Code
    </button>
    <span className="text-xs text-gray-400 mt-1">
      {timer > 0
        ? `You can resend code in ${timer}s`
        : resendDisabled
        ? "Resend used"
        : ""}
    </span>
  </div>
);

export default ResendCodeButton;