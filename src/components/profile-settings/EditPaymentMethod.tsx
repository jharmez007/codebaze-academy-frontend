import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';
// If using an icon library, e.g., react-icons:
import { FaCreditCard, FaUniversity } from 'react-icons/fa' // ADDED

interface EditPaymentMethodProps {
  activeEdit: string | null;
  onEdit: (key: string | null) => void;
}

const EditPaymentMethod: React.FC<EditPaymentMethodProps> = ({
  activeEdit,
  onEdit,
}) => {
  // saved values shown when not editing
  const [savedMethod, setSavedMethod] = useState<"card" | "bank">("card");
  const [savedCard, setSavedCard] = useState("");
  const [savedBank, setSavedBank] = useState("");
  const [savedCountry, setSavedCountry] = useState("Nigeria");

  // form inputs
  const [method, setMethod] = useState<"card" | "bank">(savedMethod);
  const [cardNumber, setCardNumber] = useState(savedCard);
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [bankAccount, setBankAccount] = useState(savedBank);
  const [bankName, setBankName] = useState("");
  const [country, setCountry] = useState(savedCountry);

  // country list from API
  const [countries, setCountries] = useState<string[]>([]); // ADDED
  const [isLoadingCountries, setIsLoadingCountries] = useState(false); // ADDED

  // skeleton loading state
  const [isFormLoading, setIsFormLoading] = useState(false); // ADDED

  // ref for the edit form container to detect outside clicks
  const formRef = useRef<HTMLDivElement | null>(null);

  // populate inputs when edit opens
  useEffect(() => {
    if (activeEdit === "payment-method") {
      // show skeleton, then after short delay show form
      setIsFormLoading(true);
      setTimeout(() => {
        setIsFormLoading(false);
        // populate values
        setMethod(savedMethod);
        setCardNumber(savedCard);
        setBankAccount(savedBank);
        setCountry(savedCountry);
      }, 300); // adjust delay as desired
    }
  }, [activeEdit, savedCard, savedBank, savedCountry, savedMethod]);

  // fetch country list once
  useEffect(() => {
    setIsLoadingCountries(true);
    fetch("https://restcountries.com/v3.1/all") // simple public API
      .then(res => res.json())
      .then((data:any[]) => {
        const list = data
          .map(c => c.name.common)
          .sort((a,b) => a.localeCompare(b));
        setCountries(list);
      })
      .catch(err => {
        console.error("Country list fetch error:", err);
        setCountries(["Nigeria","Ghana","Kenya","South Africa"]); // fallback
      })
      .finally(() => setIsLoadingCountries(false));
  }, []);

  // close edit when clicking outside the form
  useEffect(() => {
    if (activeEdit !== "payment-method") return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!formRef.current) return;
      if (target && !formRef.current.contains(target)) {
        onEdit && onEdit(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeEdit, onEdit]);

  // Validation
  const isCardValid =
    cardNumber.trim().length >= 12 &&
    expiry.trim().length >= 5 && // "MM/YY"
    cvc.trim().length >= 3 &&
    country.trim() !== "";

  const isBankValid =
    bankAccount.trim().length >= 6 &&
    bankName.trim() !== "" &&
    country.trim() !== "";

  const isFormValid = method === "card" ? isCardValid : isBankValid;

  const openEdit = () => {
    if (!activeEdit) onEdit && onEdit("payment-method");
  };

  const handleDiscard = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setMethod(savedMethod);
    setCardNumber(savedCard);
    setBankAccount(savedBank);
    setExpiry("");
    setCvc("");
    setBankName("");
    setCountry(savedCountry);
    onEdit && onEdit(null);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) return;

    setSavedMethod(method);
    if (method === "card") setSavedCard(cardNumber.trim());
    else setSavedBank(bankAccount.trim());

    setSavedCountry(country.trim());
    onEdit && onEdit(null);
    toast.success("Payment method updated");
  };

  // auto-format expiry input: after two digits insert slash
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) {
      val = val.slice(0,2) + "/" + val.slice(2,4);
    }
    setExpiry(val);
  };

  return (
   <div>
    {/* Display block - hidden when editing */}
    {activeEdit !== "payment-method" && (
      <div className='text-sm max-sm:px-6'>
        <div className="block md:hidden font-semibold">Payment Method</div>
        <div className="flex justify-between items-center">
          <div className='truncate max-sm:max-w-[180px] mr-3'>
            <span className='text-gray-400'>
              {(!savedCard && !savedBank) ? 'Add your payment method for future purchases.' : ''}
            </span>
            <div className='truncate text-wrap'>
              {savedMethod === "card" && savedCard
                ? `Card •••• ${savedCard.slice(-4)}`
                : savedMethod === "bank" && savedBank
                ? `Bank: ${savedBank}`
                : ""}
            </div>
          </div>

          {/* Edit control */}
          <div
            // onClick={openEdit}
            className={`cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition py-2 px-4
               ${activeEdit ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-300'}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (!activeEdit && (e.key === 'Enter' || e.key === ' ')) openEdit(); }}
            aria-disabled={!!activeEdit}
          >
            <span className={activeEdit ? 'text-gray-500' : ''}>Edit</span>
          </div>
        </div>
      </div>
    )}

    {/* Edit Form */}
    {activeEdit === "payment-method" && (
      <>
        <div
          className="fixed inset-0 bg-transparent z-40"
          onMouseDown={() => onEdit && onEdit(null)}
          aria-hidden
        />

        <div
          ref={formRef}
          className='edit-form z-50 pointer-events-auto relative flex flex-col bg-white border border-gray-300 rounded-md text-sm'
        >
          {/* header */}
          <div className='flex justify-between items-center px-6 pt-5'>
            <div>
              <div className="font-semibold">Billing</div>
              <p className="text-gray-500 text-[13px]">Update your payment method for future payments.</p>
            </div>
          </div>

          <div className='px-6 py-5'>
            { isFormLoading
              ? (
                // skeleton loader placeholder matching form layout – ADDED
                <div className="animate-pulse space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1 h-10 bg-gray-200 rounded-md" />
                    <div className="flex-1 h-10 bg-gray-200 rounded-md" />
                  </div>
                  <div className="h-12 bg-gray-200 rounded-md" />
                  <div className="h-40 bg-gray-200 rounded-md" />
                  <div className="h-8 bg-gray-200 rounded-md" />
                  <div className="h-10 bg-gray-200 rounded-md" />
                </div>
              ) : (
                <form onSubmit={handleSave}>
                  <div className="mb-4">
                    {/* Tabs: Card | Bank with icons and full width */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setMethod("card")}
                        className={`flex-1 flex items-center gap-2 py-2 px-3 text-sm font-medium border rounded-md ${method === "card" ? "border-blue-400 text-blue-400" : "text-gray-500 hover:bg-gray-100"}`}
                      >
                        <FaCreditCard /> Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setMethod("bank")}
                        className={`flex-1 flex items-center gap-2 py-2 px-3 text-sm font-medium border rounded-md ${method === "bank" ? "border-blue-400 text-blue-400" : "text-gray-500 hover:bg-gray-100"}`}
                      >
                        <FaUniversity /> Bank
                      </button>
                    </div>

                    {method === "card" && (
                      <>
                        <label className="block text-gray-600 mb-1">Card number</label>
                        <input
                          type="text"
                          placeholder="1234 1234 1234 1234"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-3"
                          required
                        />

                        <div className="flex gap-3 mb-3">
                          <div className="flex-1">
                            <label className="block text-gray-600 mb-1">Expiration date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={handleExpiryChange}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-600 mb-1">Security code</label>
                            <input
                              type="text"
                              placeholder="CVC"
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {method === "bank" && (
                      <>
                        <label className="block text-gray-600 mb-1">Bank name</label>
                        <input
                          type="text"
                          placeholder="e.g. Access Bank"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-3"
                          required
                        />

                        <label className="block text-gray-600 mb-1">Account number</label>
                        <input
                          type="text"
                          placeholder="e.g. 0123456789"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-3"
                          required
                        />
                      </>
                    )}

                    {/* Country (shared) */}
                    <div>
                      <label className="block text-gray-600 mb-1">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        required
                      >
                        {isLoadingCountries
                          ? <option>Loading countries…</option>
                          : countries.map((c,i) => <option key={i} value={c}>{c}</option>)
                        }
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    By providing your payment information, you allow CODE BAZE DIGITAL SOLUTIONS, LLC to charge your account for future payments in accordance with their terms.
                  </p>

                  <div className='flex justify-end flex-wrap gap-2'>
                    <button
                      onClick={handleDiscard}
                      className='cursor-pointer text-[#717073] border border-gray-300 rounded-md py-1 px-3 text-sm hover:bg-gray-200 transition ease-in'
                      type="button"
                    >
                      Discard
                    </button>
                    <button
                      className={`cursor-pointer text-white rounded-md py-1 px-3 text-sm 
                        ${isFormValid ? 'bg-[#06040E] border border-[#06040E]' : 'bg-gray-300 border border-gray-300 pointer-events-none'}`}
                      type="submit"
                      disabled={!isFormValid}
                    >
                      Save
                    </button>
                  </div>
                </form>
              )
            }
          </div>
        </div>
      </>
    )}
   </div>
  )
}

export default EditPaymentMethod;
