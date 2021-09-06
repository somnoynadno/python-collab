import {Button, Col, Row, Typography, Modal, Input} from "antd";
import React, {useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import {appAddress} from "../config";
import history from '../history';

const {Title} = Typography;

function IndexPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [link, setLink] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        window.location.replace(link);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setLink('');
    };

    return <>
        <Modal title="Ссылка для подключения" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Input onChange={(event) => setLink(event.target.value)}
                   placeholder={`${appAddress}/join/код-приглашения`}/>
        </Modal>
        <Row justify="center" align="middle">
            <Col xs={{span: 20}} md={{span: 16}} lg={{span: 10}}>
                <Row align="middle" justify="center" gutter={16} style={{marginTop: "40px"}}>
                    <Col>
                        <Title level={1}>Python Collab</Title>
                    </Col>
                </Row>
                <Row align="middle" justify="center">
                    <Col>
                        <Button onClick={() => history.push(`/class/${uuidv4()}`)}
                                shape="round" size="large" type="primary" block>
                            Создать класс
                        </Button>
                        <br/>
                        <Button shape="round" size="large" onClick={showModal} block>Присоединиться</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>
}

export default IndexPage;
