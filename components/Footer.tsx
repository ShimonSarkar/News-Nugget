const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer-container">
      <p>© {currentYear} Nugget News. All rights reserved.</p>
    </div>
  );
};

export default Footer;
