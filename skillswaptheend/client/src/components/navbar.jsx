import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #222;
  padding: 20px;
`;

const NavList = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-right: 20px;
  font-size: 18px;
`;

const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff8800;
  }
`;

const Navbar = () => {
  return (
    <Nav>
      <NavList>
        <NavItem>
          <NavLink href="/">Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/about">About Us</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/contact">Contact Us</NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
};

export default Navbar;
