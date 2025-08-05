import * as React from 'react';
import { Body, Container, Head, Html, Img, Link, Preview, Section, Text } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const WelcomeEmail = ({ firstName, lastName }) => {
    const fullName = `${firstName} ${lastName}`;

    return (
        <Html>
            <Head>
                <title>Welcome to Our App!</title>
            </Head>
            <Preview>Welcome! Start Exploring.</Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[30px]">
                            <Img
                                src={`${baseUrl}/static/social.png`}
                                width="428"
                                height="92"
                                alt="Coded Mails"
                                className="w-[428px] max-h-[92px]"
                            />
                        </Section>
                        <Text className="text-black text-[24px] font-semibold">
                            Hi {fullName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Welcome to our amazing platform! We're thrilled to have you join
                            our community.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Start exploring all the exciting features and connect with other
                            members.
                        </Text>
                        <Section className="text-center mt-[32px]">
                            <Link
                                href="https://codedmails.com"
                                className="bg-[#007bff] text-white py-[12px] px-[24px] rounded no-underline text-[14px] font-semibold"
                            >
                                Get Started
                            </Link>
                        </Section>
                        <Text className="text-black text-[12px] leading-[24px]">
                            If you have any questions, feel free to reach out to our support
                            team.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};