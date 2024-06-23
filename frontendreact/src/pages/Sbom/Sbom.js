import React from "react";
import { useParams } from "react-router";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { Block } from "../../components/Component";
import { Col, Row } from "reactstrap";
import { SbomPage } from "../components/SbomPage/SbomPage";

export const Sbom = () => {
  const { id: sbomId } = useParams();
  return (
    <>
      <Head title="SBOMS" />
      <Content>
        <Block>
          <Row className="g-gs">
            <Col md="12" lg="12">
              <SbomPage sbomId={sbomId} />
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};
