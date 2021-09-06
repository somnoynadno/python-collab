import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Input, List, message, Modal, Row, Typography} from "antd";
import useWebSocket, {ReadyState} from 'react-use-websocket';
import AceEditor from "react-ace";
import {appAddress, wsAddress} from "../config";
import {useParams} from "react-router-dom";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import "skulpt";
import {Payload} from "../models/Payload";
import {teacherRole} from "../models/roles";

const {Title} = Typography;

interface ParamTypes {
    id: string;
}

function TeacherClassPage() {
    let {id} = useParams<ParamTypes>();

    const [sourceCode, setSourceCode] = useState("");
    const [output, setOutput] = useState("");
    const [executionTime, setExecutionTime] = useState(0.0);
    const [isError, setIsError] = useState(false);
    const [lockRun, setLockRun] = useState(false);

    const [name, setName] = useState("");
    const [tempName, setTempName] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [linkCopied, setLinkCopied] = useState(false);

    const [students, setStudents] = useState<Payload[]>([]);

    const socketUrl = `${wsAddress}/ws/${id}`;

    const {
        readyState,
        sendJsonMessage
    } = useWebSocket(socketUrl, {
        onOpen: () => console.log('connection opened'),
        shouldReconnect: (closeEvent) => true,
        onMessage: (m) => {
            try {
                let p = JSON.parse(m.data);
                Object.setPrototypeOf(p, Payload.prototype);
                updateStudents(p);
            } catch (err) {
                console.log(err);
            }
        }
    });

    const updateStudents = (student: Payload) => {
        if (student.Role === teacherRole) return;

        for (let i = 0; i < students.length; i++) {
            if (students[i].Name === student.Name) {
                students[i] = student;
                setStudents(students);
                return
            }
        }

        students.push(student);
        setStudents(students);
    }

    useEffect(() => {
        if (!name) {
            setIsModalVisible(true);
        } else {
            let payload = new Payload();
            payload.Role = teacherRole;
            payload.SourceCode = sourceCode;
            payload.Name = name;

            sendJsonMessage(payload);
        }
    }, [name, sendJsonMessage, sourceCode]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'устанавливается...',
        [ReadyState.OPEN]: 'открыто',
        [ReadyState.CLOSING]: 'закрывается...',
        [ReadyState.CLOSED]: 'закрыто',
        [ReadyState.UNINSTANTIATED]: 'не поддерживается',
    }[readyState];

    useEffect(() => {
        // @ts-ignore
        message.info(`Соединение ${connectionStatus}`)
    }, [connectionStatus]);

    let buffer = "";
    function out(text: string) {
        buffer += text;
        setOutput(buffer);
    }

    const run = () => {
        setLockRun(true);
        setOutput("");
        // @ts-ignore
        window.Sk.pre = "output";
        // @ts-ignore
        Sk.configure({output: out});
        let start = performance.now()
        // @ts-ignore
        let myPromise = window.Sk.misceval.asyncToPromise(function () {
            // @ts-ignore
            return window.Sk.importMainWithBody("<stdin>", false, sourceCode, false);
        });
        // @ts-ignore
        myPromise.then(function (mod) {
                let end = performance.now();
                setExecutionTime(end - start);
                setIsError(false);
                setLockRun(false);

                if (buffer === "") setOutput("Программа ничего не вывела на экран");
            },
            // @ts-ignore
            function (err) {
                let end = performance.now();
                setExecutionTime(end - start);
                setIsError(true);
                setOutput(err.toString());
                setLockRun(false);
            });
    }

    return <>
        <Modal title="Нужно представиться" visible={isModalVisible}
               cancelButtonProps={{style: {display: "none"}}}
               closable={false} cancelText={null} onOk={() => {
            setName(tempName);
            setIsModalVisible(false);
        }}>
            <Input onChange={(event) => setTempName(event.target.value)} placeholder="Имя Фамилия"/>
        </Modal>
        <Row className="container" style={{paddingTop: "48px"}}>
            <Col xl={11} lg={10} md={8} sm={24} xs={24}>
                <List
                    style={{maxHeight: "500px", overflow: "auto"}}
                    dataSource={students}
                    renderItem={item => (
                        <List.Item>
                            {item.Name}
                            <AceEditor
                                width="auto"
                                height="300px"
                                mode="python"
                                theme="github"
                                value={item.SourceCode}
                                fontSize={10}
                                name={item.Name}
                                editorProps={{$blockScrolling: true}}
                                readOnly={true}
                            />
                        </List.Item>
                    )}
                />
            </Col>
            <Col xl={2} lg={2} md={2}/>
            <Col xl={9} lg={10} md={14} sm={24} xs={24}>
                <Title level={3}>{tempName}</Title>
                <AceEditor
                    width="auto"
                    height="400px"
                    mode="python"
                    theme="github"
                    onChange={(value => {
                        setSourceCode(value);
                    })}
                    fontSize={16}
                    name="editor"
                    editorProps={{$blockScrolling: true}}
                />
                <br/>
                <Button disabled={lockRun} id="run" onClick={run} type="primary" style={{marginBottom: 24}}>
                    Исполнить
                </Button>
                <CopyToClipboard text={`${appAddress}/join/${id}`}
                                 onCopy={() => {
                                     setLinkCopied(true);
                                     message.success("Ссылка скопирована!");
                                 }}>
                    <Button disabled={linkCopied}>
                        Скопировать ссылку
                    </Button>
                </CopyToClipboard>
                {output && <Alert message={isError ? "Произошла ошибка" : `Успешно (${executionTime} мс)`}
                                  description={output} style={{whiteSpace: "pre-line"}}
                                  type={isError ? "error" : "success"}/>}
            </Col>
        </Row>
    </>
}

export default TeacherClassPage;
