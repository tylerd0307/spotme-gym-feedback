import React from 'react';
import styled from 'styled-components';
import { FaBars, FaDumbbell } from 'react-icons/fa';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 60px;
  background: rgba(40, 40, 40, 0.95);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.18);
  z-index: 1000;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  letter-spacing: 1px;
  gap: 10px;
  user-select: none;

  span {
    color: #ff7700;
    margin-left: 6px;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const TopText = styled.div`
  font-size: 1rem;
  color: #fff;
  opacity: 0.85;
  margin-right: 20px;
  @media (max-width: 600px) {
    display: none;
  }
`;

const SignUpBtn = styled.button`
  background: #ff7700;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 10px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background 0.2s, transform 0.12s;
  &:hover {
    background: #ff8800;
    transform: translateY(-2px) scale(1.04);
  }
`;

const MenuIcon = styled(FaBars)`
  font-size: 2.1rem;
  color: #fff;
  cursor: pointer;
  margin-left: 12px;
  transition: color 0.18s;
  &:hover {
    color: #ff7700;
  }
`;

// --- Logo styled-components ---
const LogoRow = styled.div`
  display: flex;
  align-items: center;
`;

const DumbbellIcon = styled(FaDumbbell)`
  font-size: 2.2rem;
  color: #fff;
  margin-right: 12px;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.18));
`;

const LogoText = styled.span`
  font-family: 'Poppins', 'Montserrat', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: 1px;
  display: flex;
  align-items: baseline;
`;

const SpotSpan = styled.span`
  color: #fff;
`;

const MeSpan = styled.span`
  color: #ff7700;
  margin-left: 0.1em;
`;


function NavBar({ user, onSignIn, onSignOut }) {
  return (
    <Nav>
      <Logo>
        <LogoRow>
          <DumbbellIcon />
          <LogoText>
            <span style={{color:'#fff'}}>Spot</span><span style={{color:'#ff7700'}}>Me</span>
          </LogoText>
        </LogoRow>
      </Logo>
      <Right>
        <TopText>Sign up to start uploading!</TopText>
        <SignUpBtn onClick={user ? onSignOut : onSignIn}>
          {user ? 'Sign Out' : 'Sign Up'}
        </SignUpBtn>
        <MenuIcon />
      </Right>
    </Nav>
  );
}

export default NavBar;
