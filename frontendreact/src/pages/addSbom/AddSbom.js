import React from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { Block } from "../../components/Component";
import { Col, Row } from "reactstrap";
import AddSbomPage from "../components/AddSbomPage/AddSbomPage";

export const AddSbom = () => {
  return (
    <>
      <Head title="SBOMS" />
      <Content>
        <Block>
          <Row className="g-gs">
            <Col md="12" lg="12">
              <AddSbomPage />
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};
