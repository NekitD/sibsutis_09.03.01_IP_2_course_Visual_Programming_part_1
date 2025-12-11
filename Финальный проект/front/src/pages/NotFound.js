import React from 'react';

const errorStyle = { color: 'red' };

const NotFound = ({ message = 'Запрашиваемая страница не существует.' }) => (
  <div>
    <h2>Страница не найдена</h2>
    {message && <p style={errorStyle}>{message}</p>}
  </div>
);

export default NotFound;