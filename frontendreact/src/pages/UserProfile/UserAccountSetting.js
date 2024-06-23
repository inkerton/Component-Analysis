import React from "react";

import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { Block } from "../../components/Component";
import { Col, Row } from "reactstrap";

import UserProfileSettingPage from "../components/UserProfilePage/UserProfileSetting";

export const UserAccountSetting = () => {
  return (
    <>
      <Head title="SBOMS" />
      <Content>
        <Block>
          <Row className="g-gs">
            <Col md="12" lg="12">
              <UserProfileSettingPage />
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};
