const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Select Marketplace</h3>
        <p className="text-sm text-gray-400 mb-6">
          Premium digital assets for creators. eBooks, Vectors, and Zip files.
        </p>
        <div className="border-t border-gray-700 pt-6 text-xs">
          &copy; {new Date().getFullYear()} Select Marketplace. Built with Spring Boot & React.
        </div>
      </div>
    </footer>
  );
};

export default Footer;