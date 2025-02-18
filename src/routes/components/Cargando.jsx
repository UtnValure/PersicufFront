import React from 'react';
import { Container } from 'react-bootstrap';

const Cargando = () => {
  return (
    <Container className="text-center mt-5" style={{ minHeight: "50vh" }}>
      <div className="loading-message">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando...</p>
      </div>
    </Container>
  );
};

export default Cargando;