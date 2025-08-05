import React from "react";
import { Button } from "../ui/button";
import { OtpInput } from "../ui/otp-input";

type OtpStepProps = {
    email: string;
    otp: string;
    setOtp: (otp: string) => void;
    onSubmit: () => void;
    onGoBack?: () => void; // Optional prop for going back to the previous step
};

export default function OtpStep({ email, otp, setOtp, onSubmit, onGoBack }: OtpStepProps) {
    return (
        <div className="flex flex-col gap-[24px] items-center w-full">
            <div className="gap-[24px] flex flex-col items-center">
                <div className="text-center font-normal text-sm text-gray-400 mt-[30px]">
                    We have sent a code to{" "}
                    <span className="font-semibold text-sm text-white">{email}</span>
                </div>
            </div>
            <div className="flex flex-col gap-[12px] justify-center items-center">
                <div className="flex flex-row gap-[12px] items-center fit-content">
                    <OtpInput value={otp} onChange={(val) => setOtp(val)} length={4} />
                </div>
                <Button
                    onClick={onSubmit}
                    disabled={otp.length !== 4}
                    className="bg-[#FF2E79] py-[10px] px-[36px] font-medium"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
