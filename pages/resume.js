import React from 'react';
import moment from 'moment';

import Layout from '../components/Layout';
import TelephoneLink from '../components/TelephoneLink';
import EmailLink from '../components/EmailLink';

import resume from '../resume.json';
import resumeStyle from '../styles/pages/resume.less';

export function toHumanDate (date) {
  return moment(date).format('MMM Y');
};

export function isNonEmptyArray (arr) {
  return !!(arr || []).length;
}

export default class Resume extends React.Component {
  static getInitialProps () {
    return {resume};
  }
  render () {
    let {resume} = this.props;
    return (
      <Layout title={`${resume.basics.name}'s resume`} css={resumeStyle}>

        <main className="resume" itemScope itemType="http://schema.org/Person">

          <div className="page-header">
            <h1 className="text-center">
              <span itemProp="name">{resume.basics.name}</span>
              {' '}
              <small>
                <TelephoneLink phone={resume.basics.phone} className="text-muted" />
                {' ◦ '}
                <EmailLink email={resume.basics.email} className="text-muted" />
              </small>
            </h1>
          </div>

          <article className="col-md-8">
            <h2 className="sr-only">Timeline</h2>

            {(resume.work || []).map(({position, website, company, location, startDate, endDate, summary, highlights}, i) => (
              <section key={`work-${i}`}>

                <h4 className="pull-left">
                  <strong dangerouslySetInnerHTML={{__html: position}} /> at <a href={website} target="_blank" dangerouslySetInnerHTML={{__html: company}} />
                </h4>
                <h5 className="pull-right text-right text-muted">
                  <span><span>{toHumanDate(startDate)}</span> &ndash; {endDate && (<span>{toHumanDate(endDate)}</span>)}</span>
                  {location && [
                    <br key={`work-${i}-location-br`} />,
                    <span key={`work-${i}-location-span`} dangerouslySetInnerHTML={{__html: location}} />
                  ]}
                </h5>

                <p dangerouslySetInnerHTML={{__html: summary}} className="clear-left" />
                <ul>
                  {highlights.map((highlight, j) => (
                    <li key={`work-${i}-highlight-${j}`} dangerouslySetInnerHTML={{__html: highlight}} />
                  ))}
                </ul>

              </section>
            ))}

            <hr className="hidden-print" />

            {(resume.education || []).map(({website, institution, location, startDate, endDate, area}, i) => (
              <section key={`education-${i}`}>

                <h4 className="pull-left">{website
                  ? <a href={website} target="_blank" dangerouslySetInnerHTML={{__html: institution}} />
                  : <span dangerouslySetInnerHTML={{__html: institution}} />
                }</h4>
                <h5 className="pull-right text-right text-muted">
                  <span><span>{toHumanDate(startDate)}</span> &ndash; {endDate && (<span>{toHumanDate(endDate)}</span>)}</span>
                  {location && [
                    <br key={`education-${i}-location-br`} />,
                    <span key={`education-${i}-location-span`} dangerouslySetInnerHTML={{__html: location}} />
                  ]}
                </h5>

                <p className="clear-left" dangerouslySetInnerHTML={{__html: area}} />
              </section>
            ))}
          </article>

          <aside className="col-md-4">
            {isNonEmptyArray(resume.skills) &&
              <div className="text-center">
                <h3>Skills</h3>
                <ul className="list-inline">
                  {[...resume.skills.map(({keywords}, i) => (
                    keywords.map((keyword, j) => (
                      <li key={`skill-${i}-keyword-${j}`} dangerouslySetInnerHTML={{__html: keyword}} />
                    ))
                  ))]}
                </ul>
              </div>
            }

            {isNonEmptyArray(resume.references) &&
              <div className="hidden-print padding-large-vertical">
                <h3 className="sr-only">References</h3>
                {resume.references.map(({reference, name}, i) => (
                  <blockquote key={`reference-${i}`}>
                    <p dangerouslySetInnerHTML={{__html: reference}} />
                    <footer dangerouslySetInnerHTML={{__html: name}} />
                  </blockquote>
                ))}
              </div>
            }
          </aside>
        </main>
      </Layout>
    );
  }
};
