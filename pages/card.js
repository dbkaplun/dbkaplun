import React from 'react';

import Layout from '../components/Layout';
import TelephoneLink from '../components/TelephoneLink';
import EmailLink from '../components/EmailLink';

import resume from '../resume.json';
import cardStyle from '../styles/pages/card.less';

export default class extends React.Component {
  static getInitialProps () {
    return {resume};
  }
  render () {
    let {resume} = this.props;
    return (
      <Layout title={`${resume.basics.name} • ${resume.basics.phone} • ${resume.basics.email}`} css={cardStyle}>
        <main className="card jumbotron" itemScope itemType="http://schema.org/Person">
          <h1 className="text-center">
            <span itemProp="name" className="text-primary">{resume.basics.name}</span>
            <p>
              <TelephoneLink phone={resume.basics.phone} className="text-muted" />
              {' ◦ '}
              <EmailLink email={resume.basics.email} className="text-muted" />
            </p>
          </h1>
        </main>
      </Layout>
    );
  }
};
