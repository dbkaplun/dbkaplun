import React from 'react';

export default ({email, children, ...props}) => (
  <a href={`mailto:${email}`} target="_blank" itemProp="email" {...props} {...(children
    ? {}
    : {dangerouslySetInnerHTML: {__html: email}})}>{children}
  </a>
);
