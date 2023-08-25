import React from 'react';
import styled from 'styled-components';

import logoImage from './logo.jpg'; // Make sure to provide the correct path to your logo image

const Footer = () => {
  return (
    <FooterContainer>
      <Content>
        <LeftSection>
          <Logo>
            <LogoImage src={logoImage} alt="MyLogo" />
          </Logo>
          <CopyRight>&copy; 2023 Skill Swap Company. All rights reserved.</CopyRight>
        </LeftSection>
        <RightSection>
          <SocialMedia>
            <SocialLink href="https://www.facebook.com/profile.php?id=61550428124489" target="_blank">Facebook</SocialLink>
            <SocialLink href="https://twitter.com/v_bragadeesh" target="_blank">Twitter</SocialLink>
            <SocialLink href="https://www.instagram.com/skillswap07/" target="_blank">Instagram</SocialLink>
          </SocialMedia>
          <ContactInfo>
            <ContactLink href="mailto:skillswap934@gmail.com">Mail</ContactLink>
          </ContactInfo>
        </RightSection>
      </Content>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  min-height: 20vh;
  padding: 0.23rem;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const LeftSection = styled.div``;

const Logo = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const LogoImage = styled.img`
  max-width: 100px; // Adjust the maximum width as needed
`;

const CopyRight = styled.p`
  font-size: 0.85rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const SocialMedia = styled.div`
  margin-right: 1rem;
`;

const SocialLink = styled.a`
  color: #fff;
  text-decoration: none;
  margin-right: 1rem;
  font-size: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default Footer;
