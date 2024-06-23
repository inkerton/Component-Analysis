import React from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { Block } from "../../components/Component";
import { Col, Row } from "reactstrap";
import notFoundImage from '../../images/404animation.gif'
import logo from '../../../src/assets/images/logo-full.png'

const NotFound = () => {
  return (
    <div className='bg-white h-screen'>
      <Head title="404 - Page Not Found" />
      <Content >
        <Block >
          <section className="page_404">
            <img src={logo} alt='Logo' style={{width: '250px'}}/>
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="col-sm-10 offset-sm-1 text-center">
                    <div className="four_zero_four_bg flex justify-center">
                      {/* Include the background image here */}
                      <img
                        src={notFoundImage}
                        alt="404"
                        style={{ background: 'transparent', width: '500px' }}
                        className=""
                      />
                    </div>
                    <div className="contant_box_404">
                      <h3 className="h2">Looks like you're lost :(</h3>
                      <p>The page you are looking for is not available!</p>
                      <a href="/" className="link_404 font-bold">
                        Go to Home
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Block>
      </Content>
    </div>
  );
};

export default NotFound;

