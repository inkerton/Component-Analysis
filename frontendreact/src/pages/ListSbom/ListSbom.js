import React from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";

import { Block, Row, Col } from "../../components/Component";
import SbomTable from "../components/SbomTable/SbomTable";

const ListSbom = () => {
  return (
    <>
      <Head title="SBOMS" />
      <Content>
        <Block>
          <Row className="g-gs">
            <Col md="12" lg="12">
              <SbomTable />
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default ListSbom;
