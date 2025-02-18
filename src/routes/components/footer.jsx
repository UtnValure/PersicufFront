import React from 'react';
import '../../styles/footer.css'

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          
          <div className="col-md-6 mb-4 mb-md-0">
            <h5>Persicuf</h5>
            <p>Tus prendas personalizadas.</p>
          </div>

          
          <div className="col-md-6">
            <h5>Contáctanos</h5>
            <p>Email: Persicuf@gmail.com</p>
            <p>Phone: (221) 446-9941</p>
          </div>
        </div>

        
        <hr className="my-4" />

        
        <p className="text-center mb-0">&copy; 2025 Persicuf. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;