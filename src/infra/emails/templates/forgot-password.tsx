import React from "react";

import { Column } from "@react-email/column";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { TailwindConfig } from "../components/tailwind-config";

interface ForgotPasswordEmailProps {
  confirmationCode: string;
}

export default function ForgotPasswordEmail({
  confirmationCode,
}: ForgotPasswordEmailProps) {
  return (
    <TailwindConfig>
      <Html>
        <Section>
          <Row>
            <Column className="font-sans text-center">
              <Heading as="h1" className="text-2xl leading-[0] pt-10">
                Recover your account
              </Heading>

              <Heading
                as="h2"
                className="font-normal text-base text-gray-600 pt-4"
              >
                Reset your password and get back on track 💪
              </Heading>
            </Column>
          </Row>

          <Row>
            <Column className="text-center pt-4">
              <span className="bg-gray-200 inline-block px-8 py-4 text-3xl font-sans rounded-md font-bold tracking-[1rem]">
                {confirmationCode}
              </span>
            </Column>
          </Row>

          <Row>
            <Column className="text-center pt-4 font-sans">
              <Heading
                as="h3"
                className="text-base font-normal text-gray-600 leading-0"
              >
                If you did not request this code, please ignore this email.
              </Heading>
              <Heading
                as="h3"
                className="text-base font-bold text-black leading-0"
              >
                Your account remains secure. Don't worry. ☺️
              </Heading>
            </Column>
          </Row>
        </Section>
      </Html>
    </TailwindConfig>
  );
}

ForgotPasswordEmail.PreviewProps = {
  confirmationCode: "123456",
};
