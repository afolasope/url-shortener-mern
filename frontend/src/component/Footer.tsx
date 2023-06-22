const Footer = () => {
  return (
    <div className="p-6 bg-very-dark-violet text-white lg:flex lg:items-center lg:justify-between lg:px-32">
      <div className="mb-4">
        <p>Footer</p>
        <p className="text-sm">© 2023 FlexLink. All rights reserved.</p>
      </div>
      <div>
        <ul className="flex space-x-8">
          <li>Blog</li>
          <li>Terms</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
