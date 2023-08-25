import React from 'react';
import styled from 'styled-components';
import {Link} from "react-router-dom";

const SkillCoinsRulePage = () => {
  return (
    <SkillCoinsContainer>
      <Section>
        <SectionTitle>About Skill Coins</SectionTitle>
        <SectionContent>
          Skill Coins are the virtual currency of Skill Swap. They are earned
          through successful skill swaps, teaching others, and other means. These
          coins can be used to learn new skills, purchase products, and access
          exclusive offers.
        </SectionContent>
      </Section>
      
      <Section>
        <SectionTitle>Rules of Skill Swapping</SectionTitle>
        <SectionContent>
        Successful skill swaps are considered concluded when both users mutually indicate their completion by using the "Finish" button.
         To ensure that the skills have been effectively learned and exchanged, a minimum duration of 10 days of learning is required. Once this period is met, the list of completed skills for each user is updated to reflect their achievements. As a token of accomplishment, both users receive 1 skill coin each.
        In the event of any disputes, a "Report" button is available for initiating a resolution process. If such an issue arises and the dispute is reported, the connection between the users is permanently suspended, preventing the update of completed skills.
        This system encourages a fair and accountable skill exchange process while providing mechanisms to address conflicts that may arise during the journey.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Earning Skill Coins</SectionTitle>
        <SectionContent>
          Skill coins can be earned by teaching others, successful skill swaps,
          and more. These coins can't be withdrawn but can be used for learning,
          purchasing, and accessing exclusive offers in our e-commerce store.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Using Skill Coins</SectionTitle>
        <SectionContent>
          Skill coins can be used to learn new skills, purchase products, and
          avail coupons in our e-commerce store. They offer a unique opportunity
          to enhance your knowledge and access exclusive benefits.
        </SectionContent>
      </Section>
      <BackButton to="/skill-coins">Back</BackButton>
    </SkillCoinsContainer>
  );
};

const SkillCoinsContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SectionContent = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #333;
`;

const BackButton = styled(Link)`
  display: inline-block;
  background-color: #2e4052;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top:2rem;
  margin-left:.5rem;
  &:hover {
    background-color: #34495e;
  }
`;
export default SkillCoinsRulePage;
