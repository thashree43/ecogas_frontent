// GasBookingPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useGetProvidersQuery, useGetbookQuery, useOrderthegasMutation } from "../../../store/slice/Userapislice";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import {
  PincodeInput,
  ProvidersList,
  BookingModal,
  PaymentModal,
  SuccessMessage,
} from "./bookingcomponents";
import { GasProvider, CustomerDetails, GasProduct } from "./bookingcomponents/type";
import { useNavigate } from "react-router-dom";

// ------------------------------------------------------------------
// Set this to match your header's actual height in pixels.
// The page will be pushed down by this amount so nothing is hidden.
// ------------------------------------------------------------------
const HEADER_HEIGHT_PX = 72;

// ------------------------------------------------------------------
// ECOGAS brand mark – unchanged.
// ------------------------------------------------------------------
const LeafFlameMark: React.FC<{ className?: string; spin?: boolean }> = ({
  className = "h-8 w-8",
  spin = false,
}) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${spin ? "animate-spin [animation-duration:1.4s]" : ""}`}
  >
    <path
      d="M24 4C13 12 9 21 9 29a15 15 0 0 0 30 0c0-5-2-9-5-13 0 5-3 8-6 9 2-8-1-15-4-21Z"
      fill="url(#egLeafGrad)"
    />
    <path
      d="M24 4c-3 6 0 13-4 21-3-1-5-3-6-7-2 4-3 7-3 11a13 13 0 0 0 26 0c0-11-6-19-13-25Z"
      fill="url(#egLeafGrad2)"
      opacity="0.55"
    />
    <defs>
      <linearGradient id="egLeafGrad" x1="9" y1="4" x2="39" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7FC49A" />
        <stop offset="0.55" stopColor="#3E8361" />
        <stop offset="1" stopColor="#1F5C3E" />
      </linearGradient>
      <linearGradient id="egLeafGrad2" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB27A" />
        <stop offset="1" stopColor="#FF7A38" />
      </linearGradient>
    </defs>
  </svg>
);

// ------------------------------------------------------------------
// Down-arrow "scroll to pincode" indicator. A distinct circular key,
// separate from the leaf-flame brand mark, so it visually reads as
// an action cue rather than decoration. Sits in the hero and points
// down at the pincode section below it.
// ------------------------------------------------------------------
const PincodeArrowIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 4v14m0 0-6-6m6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GasBookingPage: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  // State management
  const [pincode, setPincode] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<GasProvider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    consumerId: "",
    mobile: "",
    address: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "cod">("UPI");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [selectedGas, setSelectedGas] = useState<GasProduct | null>(null);
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showNoBookingMessage, setShowNoBookingMessage] = useState(false);

  // Scroll target for the pincode-entry indicator in the hero
  const pincodeSectionRef = useRef<HTMLDivElement>(null);
  const handleJumpToPincode = () => {
    pincodeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // API hooks
  const {
    data: providers,
    error: providersError,
    isLoading: providersLoading,
    refetch,
  } = useGetProvidersQuery(pincode, {
    skip: pincode.length !== 6,
  });

  const providersWithName: GasProvider[] | undefined = providers?.map((provider) => ({
    ...provider,
    name: provider.agentname,
  }));

  const displayProviders = providersWithName ?? [];

  const {
    data: userData,
  } = useGetbookQuery(userId || "", {
    skip: !isModalOpen || !userId,
  });

  const [orderdata] = useOrderthegasMutation();

  // Effect hooks
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserId(parsedUserInfo.user._id);
    }
  }, []);

  useEffect(() => {
    if (pincode.length === 6) {
      refetch();
    }
  }, [pincode, refetch]);

  useEffect(() => {
    if (isModalOpen) {
      if (!userData || userData.book.length === 0) {
        setShowNoBookingMessage(true);
      } else {
        const firstBook = userData.book[0] || [];
        setCustomerDetails({
          name: firstBook.name,
          consumerId: firstBook.consumerid.toString(),
          mobile: firstBook.mobile.toString(),
          address: firstBook.address,
        });
      }
    }
  }, [userData, isModalOpen]);

  useEffect(() => {
    const loadDefaultAddress = async () => {
      setIsLoadingAddress(true);
      try {
        setCustomerDetails((prev) => ({ ...prev }));
      } catch (error) {
        console.error("Failed to fetch default address:", error);
      } finally {
        setIsLoadingAddress(false);
      }
    };

    if (isModalOpen && !userData) {
      loadDefaultAddress();
    }
  }, [isModalOpen, userData]);

  // Load the ECOGAS type pairing (Fraunces for display, Manrope for UI)
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Event handlers – unchanged
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
  };

  const handleProviderSelect = (provider: GasProvider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
    if (provider.products.length > 0) {
      setSelectedGas(provider.products[0]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
    setCustomerDetails({
      name: "",
      consumerId: "",
      mobile: "",
      address: "",
    });
    setPaymentMethod("UPI");
    setSelectedGas(null);
  };

  const handleCustomerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value as "UPI" | "cod");
  };

  const handleGasSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductId = e.target.value;
    const selectedProduct = selectedProvider?.products.find(
      (product) => product._id === selectedProductId
    );
    if (selectedProduct) {
      setSelectedGas(selectedProduct);
    }
  };

  const handleBooking = async () => {
    if (selectedProvider && selectedGas) {
      const newBookingData = {
        selectedProviderId: selectedProvider._id,
        customerDetails,
        paymentMethod,
        selectedGas: {
          _id: selectedGas._id,
          companyname: selectedGas.companyname,
          weight: selectedGas.weight,
          price: selectedGas.price,
        },
      };
      setBookingData(newBookingData);

      try {
        if (paymentMethod === "cod") {
          const { error: orderError } = await orderdata(newBookingData);
          if (orderError) {
            toast.error("Failed to create order. Please try again.");
            return;
          }
          setShowSuccessMessage(true);
        } else {
          setIsPaymentModal(true);
        }
        handleModalClose();
      } catch (error) {
        console.error("Booking failed:", error);
        toast.error("Booking failed. Please try again.");
      }
    }
  };

  const handleProcessPayment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      if (!stripe || !elements || !bookingData) {
        toast.error("Payment processing is not ready.");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        toast.error("Card information is not filled.");
        return;
      }

      const { error: orderError } = await orderdata(bookingData);

      if (orderError) {
        toast.error("Failed to create order. Please try again.");
        return;
      }

      setIsPaymentModal(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("An error occurred while processing your payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  // NoBookingMessage component – unchanged
  const NoBookingMessage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const navigate = useNavigate();

    const handleGoToProfile = () => {
      onClose();
      navigate("/profile");
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#10261D]/60 backdrop-blur-sm px-4 overflow-y-auto py-8"
      >
        <div
          className="relative w-full max-w-sm rounded-3xl bg-[#FBF7EE] border border-[#3E8361]/20 shadow-2xl overflow-hidden my-auto"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[#3E8361] via-[#57A876] to-[#FF7A38]" />
          <div className="p-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3E8361]/10">
              <LeafFlameMark className="h-8 w-8" />
            </div>
            <h2
              className="text-xl font-semibold text-[#182420]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Let's set up your profile
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6E8C7C]">
              We couldn't find a consumer profile linked to your account yet.
              Add your details once, and every future refill books in seconds.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={handleGoToProfile}
                className="w-full rounded-xl bg-gradient-to-r from-[#FF7A38] to-[#E85D1F] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF7A38]/25 transition hover:brightness-105 active:scale-[0.98]"
              >
                Go to my profile
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-[#182420]/10 px-4 py-3 text-sm font-semibold text-[#182420]/70 transition hover:bg-[#182420]/5"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step tracker – unchanged
  const currentStep = isModalOpen ? 2 : selectedProvider ? 2 : pincode.length === 6 ? 1 : 0;
  const steps = ["Find your area", "Pick a provider", "Confirm & book"];

  // ----------------------------------------------------------------
  //  MAIN RENDER
  //  - padding-top accounts for the fixed header.
  //  - A small circular down-arrow indicator sits at the bottom edge
  //    of the hero, pointing at (and scrolling to) the pincode
  //    section below it. Nothing else in the layout/appearance was
  //    changed.
  // ----------------------------------------------------------------
  return (
    <div
      className="min-h-screen bg-[#FBF7EE] overflow-x-hidden"
      style={{
        fontFamily: "'Manrope', sans-serif",
        paddingTop: `${HEADER_HEIGHT_PX}px`, // Push content down
      }}
    >
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#10261D]">
        <div className="pointer-events-none absolute -right-16 -top-16 opacity-[0.14]">
          <LeafFlameMark className="h-72 w-72" />
        </div>
        <div className="pointer-events-none absolute -left-10 bottom-[-4rem] opacity-[0.08]">
          <LeafFlameMark className="h-56 w-56" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <LeafFlameMark className="h-6 w-6" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-[#A8C4A2]">
              ECOGAS
            </span>
          </div>

          <h1
            className="mt-6 max-w-xl text-4xl font-semibold leading-[1.1] text-white sm:text-5xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Cook clean.
            <br />
            <span className="text-[#7FC49A]">Refill greener.</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#A8C4A2]">
            Book a cylinder from verified, low-emission providers near you —
            same reliable delivery, a lighter footprint on your kitchen.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {["Verified providers", "Low-emission delivery", "Carbon-tracked orders"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D7E8DC]"
                >
                  {badge}
                </span>
              )
            )}
          </div>
        </div>

        {/* Down-arrow indicator pointing to the pincode section below.
            Positioned at the bottom edge of the hero, centered, so it
            doesn't disturb any existing hero content or spacing. */}
        <button
          type="button"
          onClick={handleJumpToPincode}
          aria-label="Scroll to enter your pincode"
          className="absolute bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-white/10 text-[#7FC49A] ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 animate-bounce"
        >
          <PincodeArrowIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Step tracker – unchanged */}
      <div className="mx-auto -mt-6 max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-2xl border border-[#3E8361]/15 bg-white px-5 py-4 shadow-[0_10px_30px_-15px_rgba(16,38,29,0.25)]">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                    i <= currentStep
                      ? "bg-[#3E8361] text-white"
                      : "bg-[#3E8361]/10 text-[#6E8C7C]"
                  }`}
                >
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span
                  className={`hidden text-sm font-semibold sm:block ${
                    i <= currentStep ? "text-[#182420]" : "text-[#6E8C7C]"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-3 h-px flex-1 ${
                    i < currentStep ? "bg-[#3E8361]" : "bg-[#3E8361]/15"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main booking card */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8" ref={pincodeSectionRef}>
        <div className="rounded-3xl border border-[#3E8361]/12 bg-white p-6 shadow-[0_20px_50px_-25px_rgba(16,38,29,0.3)] sm:p-8">
          <h2
            className="text-xl font-semibold text-[#182420]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Where should we deliver?
          </h2>
          <p className="mt-1 text-sm text-[#6E8C7C]">
            Enter your 6-digit pincode to see eco-verified providers nearby.
          </p>

          <div className="mt-5">
            <PincodeInput pincode={pincode} onChange={handlePincodeChange} />
          </div>

          {providersLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <LeafFlameMark className="h-10 w-10" spin />
              <p className="text-sm font-medium text-[#6E8C7C]">
                Searching your area for clean providers…
              </p>
            </div>
          )}

          {providersError && (
            <div className="mt-5 rounded-2xl border border-[#FF7A38]/25 bg-[#FF7A38]/5 px-4 py-3.5 text-center text-sm font-medium text-[#B84A1B]">
              We couldn't reach the provider network. Please try again in a
              moment.
            </div>
          )}

          {providers && providers.length > 0 && (
            <div className="mt-6">
              <ProvidersList
                providers={displayProviders}
                selectedProvider={selectedProvider}
                onProviderSelect={handleProviderSelect}
              />
            </div>
          )}

          {providers && providers.length === 0 && !providersLoading && (
            <div className="mt-6 rounded-2xl border border-dashed border-[#3E8361]/25 bg-[#3E8361]/[0.04] px-4 py-8 text-center">
              <p className="text-sm font-medium text-[#182420]">
                No providers found for this pincode yet.
              </p>
              <p className="mt-1 text-xs text-[#6E8C7C]">
                We're expanding our eco-network — please check back soon.
              </p>
            </div>
          )}
        </div>

        {/* trust strip – unchanged */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "CO₂ saved / order", value: "~2.1 kg" },
            { label: "Verified refill partners", value: "150+" },
            { label: "Avg. delivery time", value: "30 min" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#3E8361]/12 bg-white px-3 py-4 text-center shadow-sm"
            >
              <p
                className="text-lg font-semibold text-[#3E8361]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-medium leading-tight text-[#6E8C7C]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modals – unchanged */}
      {selectedProvider && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          customerDetails={customerDetails}
          onCustomerDetailsChange={handleCustomerDetailsChange}
          selectedProvider={selectedProvider}
          selectedGas={selectedGas}
          onGasSelect={handleGasSelect}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={handlePaymentMethodChange}
          onBookingConfirm={handleBooking}
          isLoadingAddress={isLoadingAddress}
        />
      )}

      {showNoBookingMessage && (
        <NoBookingMessage
          onClose={() => {
            setShowNoBookingMessage(false);
            handleModalClose();
          }}
        />
      )}

      <PaymentModal
        isOpen={isPaymentModal}
        onClose={() => setIsPaymentModal(false)}
        bookingData={bookingData}
        onProcessPayment={handleProcessPayment}
        selectedGas={selectedGas}
      />

      <SuccessMessage
        isOpen={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
      />
    </div>
  );
};

export default GasBookingPage;