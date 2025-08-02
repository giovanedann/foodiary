import { Column, Heading, Html, Row, Section } from "@react-email/components";
import React from "react";

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
                Recupere a sua conta
              </Heading>

              <Heading
                as="h2"
                className="font-normal text-base text-gray-600 pt-4"
              >
                Resete a sua senha e volte ao foco 💪
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
                Se você não solicitou este código, ignore este e-mail.
              </Heading>
              <Heading
                as="h3"
                className="text-base font-bold text-black leading-0"
              >
                Sua conta continua segura. Não se preocupe. ☺️
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
