import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const PatientSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      <Input
        id="search-patient"
        placeholder="Buscar por nombre, correo o CURP..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" size="sm">Buscar</Button>
    </form>
  );
};

export default PatientSearch;
