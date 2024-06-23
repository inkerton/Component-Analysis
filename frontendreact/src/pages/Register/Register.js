import React from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Block, Row, Col } from "../../components/Component";

import RegisterModal from "../components/RegisterPage/RegisterModal";

const Register = () => {
  return (
    <>
      <Head title="Login" />
      <Content>
        <Block>
          <Row className="g-gs">
            <Col md="12" lg="12">
              <RegisterModal />
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default Register;
