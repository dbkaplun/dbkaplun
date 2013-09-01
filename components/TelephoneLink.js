import React from 'react';

export default ({phone, children, ...props}) => (
  <a href={`tel:${phone.replace(/\D/g, '')}`} target="_blank" itemProp="telephone" {...props} {...(children
    ? {}
    : {dangerouslySetInnerHTML: {__html: phone}})}>{children}
  </a>
);
