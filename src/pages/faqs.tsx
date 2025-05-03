import React from 'react';
import LandingLayout from '../layouts/LandingLayout.astro';
import FAQSection from '../components/FAQ';

type FAQ = {
  question: string;
  answer: string;
};

const faqs: Record<string, FAQ[]> = {
  licensing: [
    {
      question: "What is software licensing?",
      answer: "Software licensing is a legal mechanism that governs the use and distribution of software. It defines the terms under which users can install, use, and sometimes modify software. Keymint provides the technical tools to implement and enforce these license agreements in your software products."
    },
    {
      question: "What licensing models does Keymint support?",
      answer: "Keymint supports four key licensing models: node-locked licenses, perpetual licenses, subscription-based licenses, and trial licenses. Each model offers flexibility for different software distribution strategies."
    },
    {
      question: "How do node-locked licenses work?",
      answer: "Node-locked licenses are tied to a specific device or machine. This ensures that the license can only be used on one designated hardware unit, providing strict control over software usage."
    },
    {
      question: "What are the benefits of perpetual licenses?",
      answer: "Perpetual licenses provide lifetime access to a specific version of the software. They offer long-term stability and predictable costs, making them ideal for businesses seeking consistent software infrastructure."
    },
    {
      question: "Can I upgrade my license type?",
      answer: "Yes, Keymint offers flexible license management. You can easily upgrade from trial to subscription or perpetual licenses through our dashboard, with prorated pricing and seamless transitions."
    }
  ],
  technical: [
    {
      question: "What programming languages does Keymint support?",
      answer: "Keymint provides a REST API that can be used with any programming language capable of making HTTP requests. We offer comprehensive API documentation and examples for Python, JavaScript, Java, C#, and more."
    },
    {
      question: "Does Keymint work offline?",
      answer: "Yes, Keymint supports offline activation scenarios. You can choose between online validation for real-time license checking or offline activation with periodic online check-ins to balance security and user experience."
    },
    {
      question: "How secure is the Keymint API?",
      answer: "Our API uses industry-standard security protocols including HTTPS, JWT authentication, and rate limiting. We implement robust encryption and provide detailed access logs to ensure maximum security."
    },
    {
      question: "Can I integrate Keymint with my existing systems?",
      answer: "Absolutely. Keymint offers webhooks, extensive API documentation, and SDKs to help you seamlessly integrate our licensing system with your existing infrastructure, CRM, and billing systems."
    }
  ],
  support: [
    {
      question: "How can I contact Keymint support?",
      answer: "You can reach our support team via email at support@keymint.dev or through the live chat on our dashboard. Our standard support hours are 9 AM - 6 PM PST, Monday through Friday."
    },
    {
      question: "What support options are available?",
      answer: "We offer three support tiers: Basic (email support), Pro (priority email and chat), and Enterprise (dedicated support manager and SLA). Choose the tier that best fits your business needs."
    },
    {
      question: "How quickly do you respond to support requests?",
      answer: "Our response times vary by support tier. Basic support aims to respond within 48 hours, Pro within 24 hours, and Enterprise provides immediate, priority support."
    }
  ],
  billing: [
    {
      question: "How much does Keymint cost?",
      answer: "Keymint offers flexible pricing plans starting with a free tier for startups and small projects. Our pricing is based on the number of active licenses you manage and the features you need. Visit our pricing page for detailed information on our plans and pricing structure."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, Keymint offers a 14-day free trial with full access to all features. No credit card is required to start your trial."
    },
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time. When upgrading, the new pricing and features take effect immediately. When downgrading, changes take effect at the end of your current billing cycle."
    },
    {
      question: "Do you offer custom enterprise plans?",
      answer: "Yes, we offer custom enterprise plans for larger organizations with specific needs. These can include features like dedicated support, custom SLAs, higher rate limits, and on-premises deployment options. Contact our sales team to discuss your requirements."
    }
  ]
};

const FAQPage: React.FC = () => {
];

const supportFaqs = [
  {
    question: "How do I get support?",
    answer:
      "Keymint offers multiple support channels. Free and basic plans include community support via our forums and documentation. Premium plans include email support with guaranteed response times. Enterprise plans include dedicated support managers and phone support.",
  },
  {
    question: "What kind of documentation and support do you offer?",
    answer:
      "Yes, Keymint provides comprehensive documentation including quickstart guides, API references, and implementation examples. Our documentation is continuously updated and improved based on user feedback. We also offer community and email support.",
  },
  {
    question: "Can I request new features?",
    answer:
      "Absolutely! We welcome feature requests from our customers. You can submit feature requests through our customer portal or by contacting support. We regularly review requests and incorporate them into our product roadmap.",
  },
  {
    question: "What if I need help implementing Keymint?",
    answer:
      "In addition to our documentation and support channels, Keymint offers implementation services to help you integrate our licensing solution into your software. Our team can provide guidance, code reviews, and even hands-on assistance with implementation.",
  },
];

const FAQs = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Find answers to the most common questions about Keymint and software
            licensing.
          </p>
        </div>

        <div className="mt-16">
          <FAQSection title="Licensing Questions" faqs={licensingFaqs} />

          <FAQSection title="Technical Questions" faqs={technicalFaqs} />

          <FAQSection title="Billing & Pricing" faqs={billingFaqs} />

          <FAQSection title="Support & Resources" faqs={supportFaqs} />
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Can't find the answer you're looking for? Please contact our support
            team.
          </p>
          <a
            href="/help/support"
            className="inline-flex items-center rounded-md bg-brand-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
