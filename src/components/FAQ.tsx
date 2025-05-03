import React, { useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  description?: string;
  faqs: FAQItem[];
}

export default function FAQSection({ title, description, faqs }: FAQSectionProps) {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
      </div>
      
      <dl className="space-y-6">
        {faqs.map((faq, index) => (
          <Disclosure as="div" key={index} className="border-b border-slate-200 dark:border-slate-800 pb-6">
            {({ open }) => (
              <>
                <dt>
                  <Disclosure.Button className="flex w-full items-start justify-between text-left text-slate-900 dark:text-white">
                    <span className="text-lg font-semibold">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <svg
                        className={`${open ? '-rotate-180' : 'rotate-0'} h-6 w-6 transform transition-transform duration-200 ease-in-out text-slate-500 dark:text-slate-400`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </Disclosure.Button>
                </dt>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel as="dd" className="mt-2 pr-12">
                    <p className="text-base text-slate-600 dark:text-slate-300">{faq.answer}</p>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </dl>
    </div>
  );
}