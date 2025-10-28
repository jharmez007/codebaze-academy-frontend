export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto text-lg md:text-xl px-6 py-20 text-gray-800 leading-relaxed">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-5">Privacy Policy</h1>
      <h2 className="text-lg md:text-xl font-semibold mb-8">Let’s talk about your privacy</h2>

      <p className="mb-6 font-extralight text-gray-700">
        This Privacy Policy explains how <strong>Codebaze Academy</strong> (“we”, “us”, “our”) collects, uses,
        and protects your personal information when you use our website, courses, or related online services
        (collectively, the “Services”). By using our Services, you agree to this Privacy Policy.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">1) Information We Collect</h2>
      <ul className="list-decimal ml-6 space-y-2 font-extralight text-gray-700">
        <li>
          <strong>Personal Data:</strong> When you register or enroll, we collect your name, email address,
          billing information, and other relevant details.
        </li>
        <li>
          <strong>Usage Data:</strong> We collect non-identifiable data about your interaction with our website,
          such as pages visited, time spent, and device information.
        </li>
        <li>
          <strong>Cookies:</strong> Our website uses cookies to improve user experience and analyze traffic.
        </li>
      </ul>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">2) How We Use Your Data</h2>
      <ul className="list-decimal ml-6 space-y-2 font-extralight text-gray-700">
        <li>To provide and manage your access to our courses and platform.</li>
        <li>To process payments securely and deliver course content.</li>
        <li>To communicate updates, promotions, or important account information.</li>
        <li>To improve our Services and personalize your experience.</li>
      </ul>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">3) Sharing of Information</h2>
      <p className="mb-6 font-extralight text-gray-700">
        We do not sell or rent your personal data. We may share your information with trusted third-party
        service providers—such as payment processors, analytics tools, or email platforms—strictly for the
        purpose of delivering our Services. These partners are required to maintain confidentiality and use
        data only as instructed.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">4) Data Security</h2>
      <p className="mb-6 font-extralight text-gray-700">
        We implement reasonable administrative, technical, and physical safeguards to protect your information
        from unauthorized access or disclosure. However, no system is completely secure, and you use our
        Services at your own risk.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">5) Your Rights and Choices</h2>
      <ul className="list-decimal ml-6 space-y-2 font-extralight text-gray-700">
        <li>You may request access to or deletion of your data at any time.</li>
        <li>
          You can opt out of promotional emails by following the “unsubscribe” link or contacting us directly.
        </li>
        <li>If you are under 16, parental consent is required to use our Services.</li>
      </ul>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">6) Retention of Data</h2>
      <p className="mb-6 font-extralight text-gray-700">
        We retain your personal data only as long as necessary to provide Services or comply with legal
        obligations. When data is no longer needed, it will be securely deleted or anonymized.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">7) Updates to This Policy</h2>
      <p className="mb-6 font-extralight text-gray-700">
        We may update this Privacy Policy periodically to reflect changes in our practices or legal
        requirements. Updates will be posted on this page with the new effective date.
      </p>

      <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4">8) Contact Us</h2>
      <p className="mb-6 font-extralight text-gray-700">
        If you have questions about this Privacy Policy or our data practices, contact us at: <br />
        <a href="mailto:support@codebazeacademy.com" className="underline hover:text-gray-400 transition ease-in">
          support@codebazeacademy.com
        </a>
      </p>

      <p className="mt-12 text-[16px] text-gray-500">
        Last updated: October 2025 <br />
        © {new Date().getFullYear()} Codebaze Academy. All rights reserved.
      </p>
    </div>
  );
}
