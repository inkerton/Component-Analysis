import React from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Block, Row, Col } from "../../components/Component";

import LoginModal from "../components/LoginPage/LoginModal";

const Login = () => {
  return (
    <>
      <Head title="Login" />
      <Content>
        <Block>
          <Row className="g-gs  items-center h-screen">
            <Col md="12" lg="12" className="flex justify-center w-8/12">
              <LoginModal />
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default Login;
