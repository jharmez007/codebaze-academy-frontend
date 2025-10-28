export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto text-lg md:text-xl px-6 py-20 text-gray-800 leading-relaxed">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8">Terms of Service</h1>

      <p className="mb-6 font-extralight text-gray-700">
        Please read these Terms of Service carefully before using{" "}
        <strong>Codebaze Academy</strong> (“we”, “us”, “our”). By accessing or using our website,
        online courses, and services (collectively, the “Services”), you agree to comply with and be bound by
        these Terms and our{" "}
        <a href="/privacy" className="underline hover:text-gray-400 transition ease-in">
          Privacy Policy
        </a>
        . If you do not agree, please discontinue use of the Services immediately.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">1) Acceptance of Terms</h2>
      <p className="mb-6 font-extralight text-gray-700">
        By registering for or using our Services, you acknowledge that you have read, understood, and accepted
        these Terms of Service and any updates posted from time to time. We may modify these Terms at any time
        without prior notice. The latest version will always be available on our website.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">2) Use of Our Services</h2>
      <ul className="list-decimal ml-6 space-y-2 font-extralight text-gray-700">
        <li>You must be at least 16 years old or have parental consent to register and use the Services.</li>
        <li>
          You agree to use the Services only for lawful purposes and in a way that does not infringe the rights
          of others or restrict their enjoyment of the Services.
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your account credentials and for all
          activities that occur under your account.
        </li>
      </ul>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">3) Payments and Refunds</h2>
      <p className="mb-6 font-extralight text-gray-700">
        Payment for all Codebaze Academy courses and subscriptions must be completed before access is granted.
        All payments are non-refundable except where explicitly stated otherwise. However, refund requests may
        be reviewed within <strong>7 days of purchase</strong> under exceptional circumstances.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">4) Intellectual Property</h2>
      <p className="mb-6 font-extralight text-gray-700">
        All materials, including course content, graphics, logos, and software, are the property of Codebaze
        Academy or its content creators and are protected under intellectual property laws. You may not copy,
        distribute, reproduce, or modify any material without written consent.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">5) Student Responsibilities</h2>
      <ul className="list-decimal ml-6 space-y-2 font-extralight text-gray-700">
        <li>You may not share your login credentials or distribute course materials.</li>
        <li>
          You agree not to upload, share, or post any content that is unlawful, offensive, or violates the
          rights of others.
        </li>
        <li>
          Violation of these terms may result in suspension or permanent termination of your account without a
          refund.
        </li>
      </ul>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">6) Disclaimers and Limitation of Liability</h2>
      <p className="mb-6 font-extralight text-gray-700">
        Codebaze Academy provides all Services “as is” without any warranties, express or implied. We do not
        guarantee that participation in our courses will result in employment, business success, or income.
        Codebaze Academy shall not be liable for any direct, indirect, incidental, or consequential damages
        arising from the use of our Services.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">7) Termination</h2>
      <p className="mb-6 font-extralight text-gray-700">
        We reserve the right to suspend or terminate your access to the Services at any time, without notice,
        for any conduct that violates these Terms or is deemed harmful to Codebaze Academy or its users.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">8) Governing Law</h2>
      <p className="mb-6 font-extralight text-gray-700">
        These Terms are governed by the laws of the <strong>Federal Republic of Nigeria</strong>. Any disputes
        shall be subject to the exclusive jurisdiction of the courts in Lagos, Nigeria.
      </p>

      <p className="mt-12 text-[16px] text-gray-500">
        Last updated: October 2025 <br />
        © {new Date().getFullYear()} Codebaze Academy. All rights reserved.
      </p>
    </div>
  );
}
