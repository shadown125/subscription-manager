export async function generateMetadata() {
  return {
    title: "Term of Service",
    applicationName: "Subscription Manager",
    robots: "index, follow",
    alternates: {
      canonical: `/terms-of-service`,
      languages: {
        en: `/terms-of-service`,
        "x-default": "/terms-of-service",
      },
    },
  };
}

export default function ToS() {
  return (
    <section className="dark:bg-background">
      <div className="wrapper max-w-[1100px]">
        <div className="text-grey-soft flex flex-col rounded-md bg-slate-200 p-8 shadow-sm dark:bg-default dark:text-white [&>p]:mb-2">
          <h1 className="h4 mb-2">Terms of Service</h1>
          <h2 className="h4 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Subscription Manager (the
            &quot;Service&quot;), you agree to be bound by these Terms of
            Service (&quot;Terms&quot;), which constitute a legally binding
            agreement between you and Subscription Manager (&quot;Company,&quot;
            &quot;we,&quot; or &quot;us&quot;). If you do not agree to these
            Terms, please do not use the Service.
          </p>
          <h3 className="h5 mb-2">2. Eligibility</h3>
          <p>
            You must be at least 18 years old to use the Service. By using the
            Service, you represent and warrant that you have the legal capacity
            to enter into a binding agreement.
          </p>
          <h2 className="h4 mb-2">3. Account Registration</h2>
          <p>
            To access certain features of the Service, you must create an
            account. You agree to:
          </p>
          <ul className="[&>li]:mb-2">
            <li>
              Provide accurate, current, and complete information during the
              registration process.
            </li>
            <li>Maintain and promptly update your account information.</li>
            <li>
              Maintain the security and confidentiality of your password and
              account.
            </li>
            <li>
              Accept responsibility for all activities that occur under your
              account.
            </li>
          </ul>
          <h4 className="h5 mb-2">4. Use of the Service</h4>
          <p>
            You agree to use the Service only for lawful purposes and in
            accordance with these Terms. You are prohibited from:
          </p>
          <ul className="[&>li]:mb-2">
            <li>
              Using the Service in any manner that could disable, overburden, or
              impair the Service.
            </li>
            <li>
              Using any robot, spider, or other automatic devices, processes, or
              means to access the Service for any purpose.
            </li>
            <li>
              Engaging in any conduct that restricts or inhibits anyone&apos;s
              use or enjoyment of the Service, or which, as determined by us,
              may harm the Company or users of the Service.
            </li>
          </ul>
          <h4 className="h5 mb-2">5. User Content</h4>
          <p>
            You retain ownership of the content you create, upload, or store
            using the Service (&quot;User Content&quot;). By making any User
            Content available through the Service, you grant to the Company a
            non-exclusive, transferable, sub-licensable, worldwide, royalty-free
            license to use, copy, modify, create derivative works based upon,
            and distribute your User Content in connection with operating and
            providing the Service.
          </p>
          <h4 className="h5 mb-2">6. Intellectual Property</h4>
          <p>
            The Service and its original content, features, and functionality
            are and will remain the exclusive property of the Company and its
            licensors. The Service is protected by copyright, trademark, and
            other laws of both the United States and foreign countries. Our
            trademarks and trade dress may not be used in connection with any
            product or service without the prior written consent of the Company.
          </p>
          <h4 className="h5 mb-2">7. Privacy Policy</h4>
          <p>
            Your use of the Service is also governed by our Privacy Policy,
            which can be found at <a href="/privacy-policy">privacy policy</a>.
            By using the Service, you consent to the practices described in the
            Privacy Policy.
          </p>
          <h4 className="h5 mb-2">8. Termination</h4>
          <p>
            We may terminate or suspend your account and access to the Service
            immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach these Terms.
            Upon termination, your right to use the Service will immediately
            cease.
          </p>
          <h4 className="h5 mb-2">9. Limitation of Liability</h4>
          <p>
            To the fullest extent permitted by applicable law, in no event will
            the Company, its affiliates, or their respective directors,
            employees, or agents be liable for any indirect, incidental,
            special, consequential, or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from (i) your use or inability to use
            the Service; (ii) any unauthorized access to or use of our servers
            and/or any personal information stored therein; (iii) any
            interruption or cessation of transmission to or from the Service;
            (iv) any bugs, viruses, trojan horses, or the like that may be
            transmitted to or through our Service by any third party; (v) any
            errors or omissions in any content or for any loss or damage
            incurred as a result of the use of any content posted, emailed,
            transmitted, or otherwise made available through the Service; and/or
            (vi) the defamatory, offensive, or illegal conduct of any third
            party.
          </p>
          <h4 className="h5 mb-2">10. Governing Law</h4>
          <p>
            These Terms will be governed by and construed in accordance with the
            laws of Germany, without regard to its conflict of law provisions.
            Any legal action or proceeding arising under these Terms will be
            brought exclusively in the federal or state courts located in
            Germany, and the parties irrevocably consent to the personal
            jurisdiction and venue therein.
          </p>
          <h4 className="h5 mb-2">11. Changes to Terms</h4>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will provide
            at least 30 day&apos;s notice prior to any new terms taking effect.
            What constitutes a material change will be determined at our sole
            discretion. By continuing to access or use our Service after any
            revisions become effective, you agree to be bound by the revised
            terms.
          </p>
          <h4 className="h5 mb-2">12. Contact Information</h4>
          <p>
            If you have any questions about these Terms, please contact us at
            scrumbuiss@gmail.com.
          </p>
        </div>
      </div>
    </section>
  );
}
