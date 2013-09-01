import Head from 'next/head';

export default ({children, title=document.domain, css, className, container=true, ...props}) => (
  <div className={`${container ? 'container ' : ''}${className || ''}`} {...props}>
    <Head>
      <style dangerouslySetInnerHTML={{__html: css}} />
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    {children}
  </div>
);
